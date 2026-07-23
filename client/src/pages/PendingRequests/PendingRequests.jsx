import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import DashboardLayout from "../../layouts/DashboardLayout/DashboardLayout";
import {
  approveSwapRequest,
  getPendingSwapRequests,
  rejectSwapRequest,
} from "../../api/swaps";
import toast from "react-hot-toast";
import "./PendingRequests.css";

function PendingRequests() {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["pending-swap-requests"],
    queryFn: getPendingSwapRequests,
  });

 const approveMutation = useMutation({
    mutationFn: approveSwapRequest,

    onSuccess: () => {
        toast.success(
        "Swap request approved successfully."
        );

        queryClient.invalidateQueries({
        queryKey: ["pending"],
        });

        queryClient.invalidateQueries({
        queryKey: ["my-requests"],
        });

        queryClient.invalidateQueries({
        queryKey: ["my-shifts"],
        });

        queryClient.invalidateQueries({
        queryKey: ["available-for-swap"],
        });
    },

    onError: (error) => {
        toast.error(
        error?.response?.data?.message ||
            "Unable to approve request."
        );
    },
});

  const rejectMutation = useMutation({
    mutationFn: rejectSwapRequest,

    onSuccess: () => {
        toast.success(
        "Swap request rejected successfully."
        );

        queryClient.invalidateQueries({
        queryKey: ["pending"],
        });

        queryClient.invalidateQueries({
        queryKey: ["my-requests"],
        });

        queryClient.invalidateQueries({
        queryKey: ["available-for-swap"],
        });
    },

    onError: (error) => {
        toast.error(
        error?.response?.data?.message ||
            "Unable to reject request."
        );
    },
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

  const isActionPending =
    approveMutation.isPending || rejectMutation.isPending;

  const activeRequestId =
    approveMutation.variables || rejectMutation.variables;

  const handleApprove = (requestId) => {
    const shouldApprove = window.confirm(
      "Are you sure you want to approve this swap request?"
    );

    if (shouldApprove) {
      approveMutation.mutate(requestId);
    }
  };

  const handleReject = (requestId) => {
    const shouldReject = window.confirm(
      "Are you sure you want to reject this swap request?"
    );

    if (shouldReject) {
      rejectMutation.mutate(requestId);
    }
  };

  return (
    <DashboardLayout>
      <section className="pending-requests-page">
        <div className="pending-heading">
          <div>
            <p className="section-label">Manager Review</p>
            <h2>Pending Requests</h2>
            <p>
              Review employee shift swap requests and take action.
            </p>
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
          <div className="manager-state-card">
            Loading pending requests...
          </div>
        )}

        {isError && (
          <div className="manager-state-card manager-error-state">
            <h3>Unable to load requests</h3>

            <p>
              {error?.response?.data?.message ||
                "Something went wrong while loading pending requests."}
            </p>

            <button type="button" onClick={() => refetch()}>
              Try again
            </button>
          </div>
        )}

        {!isLoading && !isError && requests.length === 0 && (
          <div className="manager-state-card">
            <h3>No pending requests</h3>
            <p>All shift swap requests have been reviewed.</p>
          </div>
        )}

        {(approveMutation.isError || rejectMutation.isError) && (
          <div className="action-message action-error">
            {approveMutation.error?.response?.data?.message ||
              rejectMutation.error?.response?.data?.message ||
              "Unable to update the swap request."}
          </div>
        )}

        {(approveMutation.isSuccess || rejectMutation.isSuccess) && (
          <div className="action-message action-success">
            Request updated successfully.
          </div>
        )}

        {!isLoading && !isError && requests.length > 0 && (
          <div className="manager-request-list">
            {requests.map((request) => {
              const isCurrentRequestLoading =
                isActionPending && activeRequestId === request._id;

              return (
                <article
                  className="manager-request-card"
                  key={request._id}
                >
                  <div className="manager-request-header">
                    <div>
                      <span className="manager-request-number">
                        Request #{request._id.slice(-6)}
                      </span>

                      <p>
                        Submitted {formatDateTime(request.createdAt)}
                      </p>
                    </div>

                    <span className="manager-pending-badge">
                      PENDING
                    </span>
                  </div>

                  <div className="employee-swap-summary">
                    <div className="employee-summary-card">
                      <span>Requester</span>

                      <strong>{request.requester.name}</strong>

                      <p>{request.requester.email}</p>
                    </div>

                    <div className="employee-swap-arrow">↔</div>

                    <div className="employee-summary-card">
                      <span>Target employee</span>

                      <strong>{request.targetEmployee.name}</strong>

                      <p>{request.targetEmployee.email}</p>
                    </div>
                  </div>

                  <div className="manager-shift-comparison">
                    <div className="manager-shift-card">
                      <span>Requester shift</span>

                      <strong>
                        {formatDate(request.requesterShift.date)}
                      </strong>

                      <p>
                        {request.requesterShift.startTime} –{" "}
                        {request.requesterShift.endTime}
                      </p>
                    </div>

                    <div className="shift-swap-icon">→</div>

                    <div className="manager-shift-card">
                      <span>Target shift</span>

                      <strong>
                        {formatDate(request.targetShift.date)}
                      </strong>

                      <p>
                        {request.targetShift.startTime} –{" "}
                        {request.targetShift.endTime}
                      </p>
                    </div>
                  </div>

                  <div className="manager-request-actions">
                    <button
                      type="button"
                      className="reject-request-button"
                      disabled={isActionPending}
                      onClick={() => handleReject(request._id)}
                    >
                      {isCurrentRequestLoading &&
                      rejectMutation.isPending
                        ? "Rejecting..."
                        : "Reject"}
                    </button>

                    <button
                      type="button"
                      className="approve-request-button"
                      disabled={isActionPending}
                      onClick={() => handleApprove(request._id)}
                    >
                      {isCurrentRequestLoading &&
                      approveMutation.isPending
                        ? "Approving..."
                        : "Approve"}
                    </button>
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

export default PendingRequests;