import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "../../layouts/DashboardLayout/DashboardLayout";
import { getMyShifts } from "../../api/shift";
import "./MyShifts.css";

function MyShifts() {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["my-shifts"],
    queryFn: getMyShifts,
  });

  const shifts = data?.data || [];

  return (
    <DashboardLayout>
      <section className="shifts-page">
        <div className="shifts-heading">
          <div>
            <p className="section-label">Schedule</p>
            <h2>My Shifts</h2>
            <p>View all shifts currently assigned to you.</p>
          </div>

          <button
            type="button"
            className="refresh-button"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {isLoading && (
          <div className="state-card">
            <p>Loading your shifts...</p>
          </div>
        )}

        {isError && (
          <div className="state-card error-state">
            <h3>Unable to load shifts</h3>
            <p>{error?.response?.data?.message || error.message}</p>

            <button type="button" onClick={() => refetch()}>
              Try again
            </button>
          </div>
        )}

        {!isLoading && !isError && shifts.length === 0 && (
          <div className="state-card">
            <h3>No shifts assigned</h3>
            <p>You currently do not have any assigned shifts.</p>
          </div>
        )}

        {!isLoading && !isError && shifts.length > 0 && (
          <div className="shift-grid">
            {shifts.map((shift) => {
              const shiftDate = new Date(shift.date);

              return (
                <article className="shift-card" key={shift._id}>
                  <div className="shift-card-header">
                    <span className="shift-status">Assigned</span>

                    <span className="shift-id">
                      #{shift._id.slice(-6)}
                    </span>
                  </div>

                  <div className="shift-date">
                    <span>
                      {shiftDate.toLocaleDateString("en-IN", {
                        weekday: "long",
                      })}
                    </span>

                    <strong>
                      {shiftDate.toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </strong>
                  </div>

                  <div className="shift-time-row">
                    <div>
                      <span>Start time</span>
                      <strong>{shift.startTime}</strong>
                    </div>

                    <div className="time-divider" />

                    <div>
                      <span>End time</span>
                      <strong>{shift.endTime}</strong>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}

export default MyShifts;