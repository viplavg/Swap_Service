import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DashboardLayout from "../../layouts/DashboardLayout/DashboardLayout";
import { createShift } from "../../api/shift";
import { getEmployees } from "../../api/users";
import { createShiftSchema } from "../../schemas/shift.schema";
import toast from "react-hot-toast";
import "./CreateShift.css";

function CreateShift() {

  const queryClient = useQueryClient();

  const today = new Date().toISOString().split("T")[0];

  const {
    data: employeesResponse,
    isLoading: isLoadingEmployees,
    isError: isEmployeesError,
  } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
  });

  const employees = employeesResponse?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createShiftSchema),
    defaultValues: {
      employee: "",
      date: "",
      startTime: "",
      endTime: "",
    },
  });

  const createShiftMutation = useMutation({
    mutationFn: createShift,

    onSuccess: () => {
      toast.success("Shift created successfully.");

      queryClient.invalidateQueries({
        queryKey: ["my-shifts"],
      });

      queryClient.invalidateQueries({
        queryKey: ["all-shifts"],
     });

      reset();
    },

    onError: (error) => {
      toast.error(
            error?.response?.data?.message ||
            "Unable to create shift."
        );
    },
  });

  const onSubmit = (formData) => {
    createShiftMutation.mutate(formData);
  };

  return (
    <DashboardLayout>
      <section className="create-shift-page">
        <div className="create-shift-heading">
          <p className="section-label">
            Schedule Management
          </p>

          <h2>Create Shift</h2>

          <p>
            Select an employee and assign a new work
            shift.
          </p>
        </div>

        <form
          className="create-shift-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="form-group">
            <label htmlFor="employee">
              Employee
            </label>

            <select
              id="employee"
              disabled={
                isLoadingEmployees ||
                createShiftMutation.isPending
              }
              {...register("employee")}
            >
              <option value="">
                {isLoadingEmployees
                  ? "Loading employees..."
                  : "Select an employee"}
              </option>

              {employees.map((employee) => (
                <option
                  key={employee._id}
                  value={employee._id}
                >
                  {employee.name} — {employee.email}
                </option>
              ))}
            </select>

            {errors.employee && (
              <span className="form-error">
                {errors.employee.message}
              </span>
            )}

            {isEmployeesError && (
              <span className="form-error">
                Unable to load employees.
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="date">
              Shift Date
            </label>

            <input
              id="date"
              type="date"
              min={today}
              disabled={createShiftMutation.isPending}
              {...register("date")}
            />

            {errors.date && (
              <span className="form-error">
                {errors.date.message}
              </span>
            )}
          </div>

          <div className="shift-time-grid">
            <div className="form-group">
              <label htmlFor="startTime">
                Start Time
              </label>

              <input
                id="startTime"
                type="time"
                disabled={createShiftMutation.isPending}
                {...register("startTime")}
              />

              {errors.startTime && (
                <span className="form-error">
                  {errors.startTime.message}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="endTime">
                End Time
              </label>

              <input
                id="endTime"
                type="time"
                disabled={createShiftMutation.isPending}
                {...register("endTime")}
              />

              {errors.endTime && (
                <span className="form-error">
                  {errors.endTime.message}
                </span>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={
              createShiftMutation.isPending ||
              isLoadingEmployees ||
              isEmployeesError
            }
          >
            {createShiftMutation.isPending
              ? "Creating Shift..."
              : "Create Shift"}
          </button>
        </form>
      </section>
    </DashboardLayout>
  );
}

export default CreateShift;