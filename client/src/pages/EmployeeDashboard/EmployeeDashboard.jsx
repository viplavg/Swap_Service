import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import DashboardLayout from "../../layouts/DashboardLayout/DashboardLayout";
import { getMyShifts } from "../../api/shift";
import { getMySwapRequests } from "../../api/swaps";
import "./EmployeeDashboard.css";

function EmployeeDashboard() {
  const {
    data: shiftsResponse,
    isLoading: isLoadingShifts,
    isError: isShiftsError,
  } = useQuery({
    queryKey: ["my-shifts"],
    queryFn: getMyShifts,
  });

  const {
    data: requestsResponse,
    isLoading: isLoadingRequests,
    isError: isRequestsError,
  } = useQuery({
    queryKey: ["my-requests"],
    queryFn: getMySwapRequests,
  });

  const shifts = shiftsResponse?.data || [];
  const requests = requestsResponse?.data || [];

  const pendingCount = requests.filter(
    (request) => request.status === "PENDING",
  ).length;

  const approvedCount = requests.filter(
    (request) => request.status === "APPROVED",
  ).length;

  const rejectedCount = requests.filter(
    (request) => request.status === "REJECTED",
  ).length;

  const recentRequests = [...requests]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const isLoading = isLoadingShifts || isLoadingRequests;

  const hasError = isShiftsError || isRequestsError;

  return (
    <DashboardLayout>
      <section className="employee-dashboard-page">
        <div className="employee-dashboard-heading">
          <div>
            <p className="section-label">Overview</p>
            <h2>Employee Dashboard</h2>
            <p>View your schedule and track recent shift swap activity.</p>
          </div>

          <Link
            to="/employee-dashboard/create-swap"
            className="primary-action-link"
          >
            Create Swap Request
          </Link>
        </div>

        {isLoading && (
          <div className="dashboard-state-card">Loading dashboard...</div>
        )}

        {hasError && (
          <div className="dashboard-state-card dashboard-error">
            Unable to load dashboard information.
          </div>
        )}

        {!isLoading && !hasError && (
          <>
            <div className="dashboard-stats-grid">
              <article className="dashboard-stat-card">
                <span>My Shifts</span>
                <strong>{shifts.length}</strong>
                <Link to="/employee-dashboard/shifts">View shifts</Link>
              </article>

              <article className="dashboard-stat-card">
                <span>Pending Requests</span>
                <strong>{pendingCount}</strong>
                <Link to="/employee-dashboard/requests">View requests</Link>
              </article>

              <article className="dashboard-stat-card">
                <span>Approved Requests</span>
                <strong>{approvedCount}</strong>
                <Link to="/employee-dashboard/requests">View requests</Link>
              </article>

              <article className="dashboard-stat-card">
                <span>Rejected Requests</span>
                <strong>{rejectedCount}</strong>
                <Link to="/employee-dashboard/requests">View requests</Link>
              </article>
            </div>

            <div className="dashboard-main-grid">
              <section className="dashboard-panel">
                <div className="dashboard-panel-heading">
                  <div>
                    <h3>Recent Requests</h3>
                    <p>Your latest shift swap activity.</p>
                  </div>

                  <Link to="/employee-dashboard/requests">View all</Link>
                </div>

                {recentRequests.length === 0 ? (
                  <div className="dashboard-empty-state">
                    <p>No swap requests yet.</p>

                    <Link to="/employee-dashboard/create-swap">
                      Create your first request
                    </Link>
                  </div>
                ) : (
                  <div className="recent-request-list">
                    {recentRequests.map((request) => {
                      const requesterShift = request.requesterShift;
                      const targetShift = request.targetShift;

                      return (
                        <article
                          className="recent-request-card"
                          key={request._id}
                        >
                          <div>
                            <span>
                              {requesterShift?.date
                                ? formatDate(requesterShift.date)
                                : "Shift unavailable"}
                            </span>

                            <strong>
                              {requesterShift?.startTime || "N/A"}
                              {" → "}
                              {targetShift?.startTime || "N/A"}
                            </strong>

                            <p>
                              With{" "}
                              {request.targetEmployee?.name ||
                                "another employee"}
                            </p>
                          </div>

                          <span
                            className={`recent-status recent-status-${request.status.toLowerCase()}`}
                          >
                            {request.status}
                          </span>
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>

              <aside className="dashboard-panel">
                <div className="dashboard-panel-heading">
                  <div>
                    <h3>Quick Actions</h3>
                    <p>Common employee actions.</p>
                  </div>
                </div>

                <div className="quick-actions-list">
                  <Link to="/employee-dashboard/create-swap">
                    <strong>Create Swap Request</strong>
                    <span>Request an exchange with another shift.</span>
                  </Link>

                  <Link to="/employee-dashboard/shifts">
                    <strong>View My Shifts</strong>
                    <span>Review your assigned work schedule.</span>
                  </Link>

                  <Link to="/employee-dashboard/requests">
                    <strong>Track My Requests</strong>
                    <span>Check pending and reviewed requests.</span>
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

export default EmployeeDashboard;
