import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import DashboardLayout from "../../layouts/DashboardLayout/DashboardLayout";
import { getPendingSwapRequests } from "../../api/swaps";
import "./ManagerDashboard.css";

function ManagerDashboard() {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["pending-swap-requests"],
    queryFn: getPendingSwapRequests,
  });

  const pendingRequests = data?.data || [];

  const recentPendingRequests = [...pendingRequests]
    .sort(
      (a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    )
    .slice(0, 3);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatDateTime = (date) =>
    new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <DashboardLayout>
      <section className="manager-dashboard-page">
        <div className="manager-dashboard-heading">
          <div>
            <p className="section-label">Overview</p>
            <h2>Manager Dashboard</h2>
            <p>
              Review pending swap requests and manage
              employee schedules.
            </p>
          </div>

          <Link
            to="/manager-dashboard/create-shift"
            className="manager-primary-action"
          >
            Create Shift
          </Link>
        </div>

        {isLoading && (
          <div className="manager-dashboard-state">
            Loading dashboard...
          </div>
        )}

        {isError && (
          <div className="manager-dashboard-state manager-dashboard-error">
            {error?.response?.data?.message ||
              "Unable to load manager dashboard."}
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <div className="manager-stats-grid">
              <article className="manager-stat-card">
                <span>Pending Requests</span>
                <strong>{pendingRequests.length}</strong>

                <Link to="/manager-dashboard/pending-requests">
                  Review requests
                </Link>
              </article>

              <article className="manager-stat-card">
                <span>Requests Needing Action</span>
                <strong>{pendingRequests.length}</strong>

                <p>Awaiting manager decision</p>
              </article>

              <article className="manager-stat-card">
                <span>Recent Requests</span>
                <strong>{recentPendingRequests.length}</strong>

                <p>Displayed below</p>
              </article>

              <article className="manager-stat-card">
                <span>Schedule Management</span>
                <strong>Active</strong>

                <Link to="/manager-dashboard/create-shift">
                  Create shift
                </Link>
              </article>
            </div>

            <div className="manager-dashboard-grid">
              <section className="manager-dashboard-panel">
                <div className="manager-panel-heading">
                  <div>
                    <h3>Recent Pending Requests</h3>
                    <p>
                      Latest requests waiting for review.
                    </p>
                  </div>

                  <Link to="/manager-dashboard/pending-requests">
                    View all
                  </Link>
                </div>

                {recentPendingRequests.length === 0 ? (
                  <div className="manager-empty-state">
                    <h4>No pending requests</h4>
                    <p>
                      All employee swap requests have
                      been reviewed.
                    </p>
                  </div>
                ) : (
                  <div className="manager-recent-list">
                    {recentPendingRequests.map((request) => (
                      <article
                        className="manager-recent-card"
                        key={request._id}
                      >
                        <div className="manager-request-details">
                          <span>
                            Submitted{" "}
                            {formatDateTime(request.createdAt)}
                          </span>

                          <strong>
                            {request.requester?.name ||
                              "Employee"}
                          </strong>

                          <p>
                            {formatDate(
                              request.requesterShift.date
                            )}
                            {" · "}
                            {request.requesterShift.startTime}
                            {" → "}
                            {request.targetShift.startTime}
                          </p>

                          <small>
                            Target:{" "}
                            {request.targetEmployee?.name ||
                              "Employee"}
                          </small>
                        </div>

                        <span className="manager-dashboard-status">
                          PENDING
                        </span>
                      </article>
                    ))}
                  </div>
                )}
              </section>

              <aside className="manager-dashboard-panel">
                <div className="manager-panel-heading">
                  <div>
                    <h3>Quick Actions</h3>
                    <p>Common manager operations.</p>
                  </div>
                </div>

                <div className="manager-quick-actions">
                  <Link to="/manager-dashboard/pending-requests">
                    <strong>Review Pending Requests</strong>
                    <span>
                      Approve or reject employee shift
                      swap requests.
                    </span>
                  </Link>

                  <Link to="/manager-dashboard/create-shift">
                    <strong>Create Employee Shift</strong>
                    <span>
                      Assign a new shift to an employee.
                    </span>
                  </Link>
                </div>
              </aside>
            </div>
          </>
        )}
      </section>
    </DashboardLayout>
  );
}

export default ManagerDashboard;