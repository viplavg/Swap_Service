import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";

import DashboardLayout from "../../layouts/DashboardLayout/DashboardLayout";
import {
  deleteShift,
  getAllShifts,
  updateShift,
} from "../../api/shift";
import "./AllShifts.css";

function AllShifts() {
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [editingShift, setEditingShift] = useState(null);
  const [shiftToDelete, setShiftToDelete] = useState(null);

  const [editFormData, setEditFormData] = useState({
    date: "",
    startTime: "",
    endTime: "",
  });

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["all-shifts"],
    queryFn: getAllShifts,
  });

  const updateShiftMutation = useMutation({
    mutationFn: updateShift,

    onSuccess: () => {
      toast.success("Shift updated successfully.");

      queryClient.invalidateQueries({
        queryKey: ["all-shifts"],
      });

      queryClient.invalidateQueries({
        queryKey: ["my-shifts"],
      });

      queryClient.invalidateQueries({
        queryKey: ["available-for-swap"],
      });

      closeEditModal();
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to update shift."
      );
    },
  });

  const deleteShiftMutation = useMutation({
    mutationFn: deleteShift,

    onSuccess: () => {
      toast.success("Shift deleted successfully.");

      queryClient.invalidateQueries({
        queryKey: ["all-shifts"],
      });

      queryClient.invalidateQueries({
        queryKey: ["my-shifts"],
      });

      queryClient.invalidateQueries({
        queryKey: ["available-for-swap"],
      });

      setShiftToDelete(null);
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to delete shift."
      );
    },
  });

  const shifts = data?.data || [];

  const normalizedSearchTerm =
    searchTerm.trim().toLowerCase();

  const filteredShifts = shifts.filter((shift) => {
    const employeeName =
      shift.employee?.name?.toLowerCase() || "";

    const employeeEmail =
      shift.employee?.email?.toLowerCase() || "";

    const matchesSearch =
      employeeName.includes(normalizedSearchTerm) ||
      employeeEmail.includes(normalizedSearchTerm);

    const shiftDate = new Date(shift.date)
      .toISOString()
      .split("T")[0];

    const matchesDate =
      !selectedDate || shiftDate === selectedDate;

    return matchesSearch && matchesDate;
  });

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatDateForInput = (date) =>
    new Date(date).toISOString().split("T")[0];

  const today = new Date().toISOString().split("T")[0];

  const openEditModal = (shift) => {
    setEditingShift(shift);

    setEditFormData({
      date: formatDateForInput(shift.date),
      startTime: shift.startTime,
      endTime: shift.endTime,
    });
  };

  const closeEditModal = () => {
    if (updateShiftMutation.isPending) {
      return;
    }

    setEditingShift(null);

    setEditFormData({
      date: "",
      startTime: "",
      endTime: "",
    });
  };

  const openDeleteModal = (shift) => {
    setShiftToDelete(shift);
  };

  const closeDeleteModal = () => {
    if (deleteShiftMutation.isPending) {
      return;
    }

    setShiftToDelete(null);
  };

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;

    setEditFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleEditSubmit = (event) => {
    event.preventDefault();

    if (!editingShift?._id) {
      toast.error("Shift ID is missing.");
      return;
    }

    if (
      !editFormData.date ||
      !editFormData.startTime ||
      !editFormData.endTime
    ) {
      toast.error("Please fill in all shift details.");
      return;
    }

    if (editFormData.date < today) {
      toast.error("Shift date cannot be in the past.");
      return;
    }

    if (editFormData.endTime <= editFormData.startTime) {
      toast.error("End time must be after start time.");
      return;
    }

    updateShiftMutation.mutate({
      shiftId: editingShift._id,
      payload: {
        date: editFormData.date,
        startTime: editFormData.startTime,
        endTime: editFormData.endTime,
      },
    });
  };

  const handleDeleteShift = () => {
    if (!shiftToDelete?._id) {
      toast.error("Shift ID is missing.");
      return;
    }

    deleteShiftMutation.mutate(shiftToDelete._id);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDate("");
  };

  return (
    <DashboardLayout>
      <section className="all-shifts-page">
        <div className="all-shifts-heading">
          <div>
            <p className="section-label">
              Schedule Management
            </p>

            <h2>All Shifts</h2>

            <p>
              View and manage all employee shifts and
              assigned schedules.
            </p>
          </div>

          <div className="shift-count-card">
            <span>Total Shifts</span>
            <strong>{shifts.length}</strong>
          </div>
        </div>

        <div className="shift-filters">
          <div className="shift-filter-group">
            <label htmlFor="shift-search">
              Search employee
            </label>

            <input
              id="shift-search"
              type="search"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />
          </div>

          <div className="shift-filter-group">
            <label htmlFor="shift-date-filter">
              Filter by date
            </label>

            <input
              id="shift-date-filter"
              type="date"
              value={selectedDate}
              onChange={(event) =>
                setSelectedDate(event.target.value)
              }
            />
          </div>

          <button
            type="button"
            className="clear-shift-filters"
            onClick={clearFilters}
            disabled={!searchTerm && !selectedDate}
          >
            Clear Filters
          </button>
        </div>

        {isLoading && (
          <div className="all-shifts-state">
            Loading shifts...
          </div>
        )}

        {isError && (
          <div className="all-shifts-state all-shifts-error">
            {error?.response?.data?.message ||
              "Unable to load shifts."}
          </div>
        )}

        {!isLoading &&
          !isError &&
          filteredShifts.length === 0 && (
            <div className="all-shifts-empty">
              <h3>
                {shifts.length === 0
                  ? "No shifts found"
                  : "No matching shifts"}
              </h3>

              <p>
                {shifts.length === 0
                  ? "Create a shift to start managing employee schedules."
                  : "Try changing or clearing the current filters."}
              </p>
            </div>
          )}

        {!isLoading &&
          !isError &&
          filteredShifts.length > 0 && (
            <div className="all-shifts-table-wrapper">
              <table className="all-shifts-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Email</th>
                    <th>Date</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredShifts.map((shift) => (
                    <tr key={shift._id}>
                      <td>
                        <strong>
                          {shift.employee?.name ||
                            "Unknown Employee"}
                        </strong>
                      </td>

                      <td>
                        {shift.employee?.email || "N/A"}
                      </td>

                      <td>{formatDate(shift.date)}</td>

                      <td>{shift.startTime}</td>

                      <td>{shift.endTime}</td>

                      <td>
                        <div className="shift-action-buttons">
                          <button
                            type="button"
                            className="edit-shift-button"
                            onClick={() =>
                              openEditModal(shift)
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="delete-shift-button"
                            onClick={() =>
                              openDeleteModal(shift)
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </section>

      {editingShift && (
        <div
          className="edit-shift-modal-backdrop"
          onMouseDown={closeEditModal}
        >
          <div
            className="edit-shift-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-shift-title"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <div className="edit-shift-modal-header">
              <div>
                <p className="section-label">
                  Schedule Management
                </p>

                <h2 id="edit-shift-title">
                  Edit Shift
                </h2>

                <p>
                  Updating shift for{" "}
                  <strong>
                    {editingShift.employee?.name ||
                      "employee"}
                  </strong>
                </p>
              </div>

              <button
                type="button"
                className="close-edit-modal-button"
                onClick={closeEditModal}
                aria-label="Close edit shift modal"
                disabled={updateShiftMutation.isPending}
              >
                ×
              </button>
            </div>

            <form
              className="edit-shift-form"
              onSubmit={handleEditSubmit}
            >
              <div className="edit-shift-form-group">
                <label htmlFor="edit-shift-date">
                  Shift Date
                </label>

                <input
                  id="edit-shift-date"
                  name="date"
                  type="date"
                  min={today}
                  value={editFormData.date}
                  onChange={handleEditInputChange}
                  disabled={updateShiftMutation.isPending}
                  required
                />
              </div>

              <div className="edit-shift-time-grid">
                <div className="edit-shift-form-group">
                  <label htmlFor="edit-start-time">
                    Start Time
                  </label>

                  <input
                    id="edit-start-time"
                    name="startTime"
                    type="time"
                    value={editFormData.startTime}
                    onChange={handleEditInputChange}
                    disabled={updateShiftMutation.isPending}
                    required
                  />
                </div>

                <div className="edit-shift-form-group">
                  <label htmlFor="edit-end-time">
                    End Time
                  </label>

                  <input
                    id="edit-end-time"
                    name="endTime"
                    type="time"
                    value={editFormData.endTime}
                    onChange={handleEditInputChange}
                    disabled={updateShiftMutation.isPending}
                    required
                  />
                </div>
              </div>

              <div className="edit-shift-modal-actions">
                <button
                  type="button"
                  className="cancel-edit-shift-button"
                  onClick={closeEditModal}
                  disabled={updateShiftMutation.isPending}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-edit-shift-button"
                  disabled={updateShiftMutation.isPending}
                >
                  {updateShiftMutation.isPending
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {shiftToDelete && (
        <div
          className="delete-shift-modal-backdrop"
          onMouseDown={closeDeleteModal}
        >
          <div
            className="delete-shift-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-shift-title"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <div className="delete-shift-icon">
              !
            </div>

            <h2 id="delete-shift-title">
              Delete Shift?
            </h2>

            <p>
              Are you sure you want to delete the shift
              assigned to{" "}
              <strong>
                {shiftToDelete.employee?.name ||
                  "this employee"}
              </strong>
              ?
            </p>

            <div className="delete-shift-summary">
              <div>
                <span>Date</span>

                <strong>
                  {formatDate(shiftToDelete.date)}
                </strong>
              </div>

              <div>
                <span>Time</span>

                <strong>
                  {shiftToDelete.startTime} -{" "}
                  {shiftToDelete.endTime}
                </strong>
              </div>
            </div>

            <p className="delete-shift-warning">
              This action cannot be undone.
            </p>

            <div className="delete-shift-modal-actions">
              <button
                type="button"
                className="cancel-delete-shift-button"
                onClick={closeDeleteModal}
                disabled={deleteShiftMutation.isPending}
              >
                Cancel
              </button>

              <button
                type="button"
                className="confirm-delete-shift-button"
                onClick={handleDeleteShift}
                disabled={deleteShiftMutation.isPending}
              >
                {deleteShiftMutation.isPending
                  ? "Deleting..."
                  : "Delete Shift"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default AllShifts;