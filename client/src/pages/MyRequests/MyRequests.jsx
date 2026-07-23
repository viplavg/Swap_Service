import { useQuery } from "@tanstack/react-query";

import DashboardLayout from "../../layouts/DashboardLayout/DashboardLayout";
import { getMySwapRequests } from "../../api/swaps";
import "./MyRequests.css";

function MyRequests() {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["my-requests"],
    queryFn: getMySwapRequests,
  });

  const requests = data?.data || [];

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusClass = (status) => {
    return `request-status request-status-${status.toLowerCase()}`;
  };

  return (
    <DashboardLayout>
      <section className="requests-page">
        <div className="requests-heading">
          <div>
            <p className="section-label">Swap History</p>
            <h2>My Requests</h2>
            <p>Track the current status of your shift swap requests.</p>
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
          <div className="request-state-card">Loading your requests...</div>
        )}

        {isError && (
          <div className="request-state-card request-error-state">
            <h3>Unable to load requests</h3>
            <p>
              {error?.response?.data?.message ||
                "Something went wrong while loading requests."}
            </p>

            <button type="button" onClick={() => refetch()}>
              Try again
            </button>
          </div>
        )}

        {!isLoading && !isError && requests.length === 0 && (
          <div className="request-state-card">
            <h3>No swap requests yet</h3>
            <p>Your submitted shift swap requests will appear here.</p>
          </div>
        )}

        {!isLoading && !isError && requests.length > 0 && (
          <div className="request-list">
            {requests.map((request) => {
              const requesterShift = request.requesterShift;
              const targetShift = request.targetShift;

              return (
                <article className="request-card" key={request._id}>
                  <div className="request-card-header">
                    <div>
                      <span className="request-number">
                        Request #{request._id.slice(-6)}
                      </span>

                      <p>Submitted {formatDateTime(request.createdAt)}</p>
                    </div>

                    <span className={getStatusClass(request.status)}>
                      {request.status}
                    </span>
                  </div>

                  <div className="swap-shifts">
                    <div className="request-shift">
                      <span>Your requested shift</span>

                      {requesterShift ? (
                        <>
                          <strong>{formatDate(requesterShift.date)}</strong>

                          <p>
                            {requesterShift.startTime} –{" "}
                            {requesterShift.endTime}
                          </p>
                        </>
                      ) : (
                        <>
                          <strong>Shift no longer available</strong>

                          <p>This shift may have been deleted.</p>
                        </>
                      )}
                    </div>

                    <div className="swap-arrow" aria-hidden="true">
                      →
                    </div>

                    <div className="request-shift">
                      <span>Target shift</span>

                      {targetShift ? (
                        <>
                          <strong>{formatDate(targetShift.date)}</strong>

                          <p>
                            {targetShift.startTime} – {targetShift.endTime}
                          </p>
                        </>
                      ) : (
                        <>
                          <strong>Shift no longer available</strong>

                          <p>This shift may have been deleted.</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="request-footer">
                    <div>
                      <span>Requested from</span>

                      <strong>
                        {request.targetEmployee?.name || "Employee"}
                      </strong>
                    </div>

                    {request.status !== "PENDING" && (
                      <div>
                        <span>Reviewed by</span>

                        <strong>{request.reviewedBy?.name || "Manager"}</strong>
                      </div>
                    )}

                    {request.reviewedAt && (
                      <div>
                        <span>Reviewed on</span>

                        <strong>{formatDateTime(request.reviewedAt)}</strong>
                      </div>
                    )}
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

export default MyRequests;
