import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { WorkService } from "@/services/work-service";
import { getErrorMessage } from "@/utils/error-helper";

interface RejectionDialogProps {
  open: boolean;
  workerId: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function RejectionDialog({
  open,
  workerId,
  onClose,
  onSuccess,
}: RejectionDialogProps) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    if (isSubmitting) return;

    setRejectionReason("");
    onClose();
  };

  const handleSubmit = async () => {
    if (!workerId) return;

    const reason = rejectionReason.trim();

    if (!reason) {
      toast.error("Please provide a reason for rejection.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response =
        await WorkService.approveWorkerApplication({
          workerId,
          status: "rejected",
          rejectionReason: reason,
        });

      if (response.data.success) {
        toast.success(
          "Worker application rejected. Notification email sent."
        );

        setRejectionReason("");

        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error(
        "Error rejecting worker:",
        error
      );

      toast.error(
        getErrorMessage(error) ||
          "Error rejecting worker application."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          handleClose();
        }
      }}
    >
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Reject Application
          </AlertDialogTitle>

          <AlertDialogDescription>
            Please provide a clear reason for rejecting
            this worker application. The reason will be
            sent to the worker via email.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2">
          <Label htmlFor="rejection-reason">
            Reason for Rejection{" "}
            <span className="text-muted-foreground">
              *
            </span>
          </Label>

          <Textarea
            id="rejection-reason"
            value={rejectionReason}
            onChange={(event) =>
              setRejectionReason(event.target.value)
            }
            placeholder="Please provide a clear reason for rejection."
            rows={4}
            disabled={isSubmitting}
            className="resize-none"
          />

          <p className="text-xs text-muted-foreground">
            The worker can review this reason and reapply
            after addressing your concerns.
          </p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isSubmitting}
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault();
              handleSubmit();
            }}
            disabled={
              isSubmitting ||
              !rejectionReason.trim()
            }
          >
            {isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}

            {isSubmitting
              ? "Rejecting..."
              : "Confirm Rejection"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}