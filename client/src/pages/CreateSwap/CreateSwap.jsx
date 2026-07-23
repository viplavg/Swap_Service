import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import DashboardLayout from "../../layouts/DashboardLayout/DashboardLayout";
import {
  getMyShifts,
  getAvailableShiftsForSwap,
} from "../../api/shift";
import { createSwapRequest } from "../../api/swaps";
import { createSwapSchema } from "../../schemas/swap.schema";
import toast from "react-hot-toast";
import "./CreateSwap.css";

function CreateSwap() {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    resolver: zodResolver(createSwapSchema),
    defaultValues: {
      requesterShift: "",
      targetShift: "",
    },
  });

  const {
    data: myShiftsResponse,
    isLoading: isLoadingMyShifts,
    isError: isMyShiftsError,
  } = useQuery({
    queryKey: ["my-shifts"],
    queryFn: getMyShifts,
  });

  const {
    data: availableShiftsResponse,
    isLoading: isLoadingAvailableShifts,
    isError: isAvailableShiftsError,
  } = useQuery({
    queryKey: ["available-for-swap"],
    queryFn: getAvailableShiftsForSwap,
  });

  const mutation = useMutation({
  mutationFn: createSwapRequest,

  onSuccess: () => {
    toast.success("Swap request created successfully.");

    reset();

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
        "Unable to create swap request."
    );
  },
});

  const myShifts = myShiftsResponse?.data || [];
  const availableShifts =
    availableShiftsResponse?.data || [];

  const formatShift = (shift) => {
    const formattedDate = new Date(
      shift.date
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    return `${formattedDate} | ${shift.startTime} - ${shift.endTime}`;
  };

  const onSubmit = (formData) => {
    mutation.mutate(formData);
  };

  const isLoading =
    isLoadingMyShifts ||
    isLoadingAvailableShifts;

  const hasQueryError =
    isMyShiftsError ||
    isAvailableShiftsError;

  return (
    <DashboardLayout>
      <section className="create-swap-page">
        <div className="create-swap-heading">
          <p className="section-label">
            Shift Management
          </p>

          <h2>Create Swap Request</h2>

          <p>
            Select one of your shifts and the target
            shift you want to exchange it with.
          </p>
        </div>

        {isLoading && (
          <div className="swap-state-card">
            Loading shifts...
          </div>
        )}

        {hasQueryError && (
          <div className="swap-state-card swap-error">
            Unable to load shifts. Please refresh the
            page and try again.
          </div>
        )}

        {!isLoading && !hasQueryError && (
          <form
            className="swap-form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="form-group">
              <label htmlFor="requesterShift">
                Your shift
              </label>

              <select
                id="requesterShift"
                {...register("requesterShift")}
              >
                <option value="">
                  Select your shift
                </option>

                {myShifts.map((shift) => (
                  <option
                    key={shift._id}
                    value={shift._id}
                  >
                    {formatShift(shift)}
                  </option>
                ))}
              </select>

              {errors.requesterShift && (
                <p className="field-error">
                  {errors.requesterShift.message}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="targetShift">
                Target shift
              </label>

              <select
                id="targetShift"
                {...register("targetShift")}
              >
                <option value="">
                  Select target shift
                </option>

                {availableShifts.map((shift) => (
                  <option
                    key={shift._id}
                    value={shift._id}
                  >
                    {formatShift(shift)}
                  </option>
                ))}
              </select>

              {errors.targetShift && (
                <p className="field-error">
                  {errors.targetShift.message}
                </p>
              )}
            </div>

            {myShifts.length === 0 && (
              <div className="form-message">
                You do not have any assigned shifts.
              </div>
            )}

            {availableShifts.length === 0 && (
              <div className="form-message">
                No target shifts are currently
                available.
              </div>
            )}

            <button
              type="submit"
              className="submit-swap-button"
              disabled={
                isSubmitting ||
                mutation.isPending ||
                myShifts.length === 0 ||
                availableShifts.length === 0
              }
            >
              {mutation.isPending
                ? "Creating request..."
                : "Create Swap Request"}
            </button>
          </form>
        )}
      </section>
    </DashboardLayout>
  );
}

export default CreateSwap;