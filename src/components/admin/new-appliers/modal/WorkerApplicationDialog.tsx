import { useState } from "react";
import {
  Briefcase,
  CalendarDays,
  Check,
  CircleX,
  Mail,
  MapPin,
  Phone,
  X,
  Loader2,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

import { WorkService } from "@/services/work-service";
import { getErrorMessage } from "@/utils/error-helper";

import { RejectionDialog } from "./RejectionDialog";

export interface Applier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    state: string;
    pincode: string;
    panchayath: string;
    city: string;
    place: string;
  };
  workTypes: string[];
  preferredWorks: string[];
  confirmations: {
    reliable: boolean;
    honest: boolean;
    termsAccepted: boolean;
  };
  rejectionReason?: string;
  rejectedAt?: Date;
  status: string;
  createdAt?: Date;
}

interface WorkerApplicationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  applier: Applier | null;
  onRefresh: () => void;
}

const ApplicationStatusBadge = ({
  status,
}: {
  status: string;
}) => {
  if (status === "approved") {
    return (
      <Badge
        variant="outline"
        className="border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-400"
      >
        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-green-500 dark:bg-green-400" />
        Approved
      </Badge>
    );
  }

  if (status === "rejected") {
    return (
      <Badge
        variant="outline"
        className="border-destructive/30 bg-destructive/10 text-destructive"
      >
        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-destructive" />
        Rejected
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-400"
    >
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-yellow-500 dark:bg-yellow-400" />
      Pending
    </Badge>
  );
};

const InfoItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) => {
  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="mb-1.5 flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />

        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
      </div>

      <div className="text-sm font-medium text-foreground">
        {value}
      </div>
    </div>
  );
};

export default function WorkerApplicationDialog({
  isOpen,
  onClose,
  applier,
  onRefresh,
}: WorkerApplicationDialogProps) {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const approveWorker = async () => {
    if (!applier) return;

    try {
      setIsSubmitting(true);

      const response = await WorkService.approveWorkerApplication({
        workerId: applier.id,
        status: "approved",
      });

      if (response.data.success) {
        toast.success(
          "Worker approved successfully. Approval email sent."
        );

        onClose();
        onRefresh();
      }
    } catch (error) {
      console.error("Error approving worker:", error);

      toast.error(
        getErrorMessage(error) || "Error approving worker application."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectSuccess = () => {
    onClose();
    onRefresh();
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open && !isSubmitting) {
            onClose();
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader className="pr-8">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
              </div>

              <div className="min-w-0">
                <DialogTitle className="truncate text-xl">
                  {applier?.name}
                </DialogTitle>

                <DialogDescription className="mt-1">
                  Review worker application details and make a decision.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {applier && (
            <div className="space-y-6 py-2">
              {/* Status */}
              <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Application status
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Current status of this worker application
                  </p>
                </div>

                <ApplicationStatusBadge status={applier.status} />
              </div>

              {/* Previous Rejection */}
              {applier.status === "rejected" &&
                applier.rejectionReason && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                        <CircleX className="h-4 w-4 text-destructive" />
                      </div>

                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-destructive">
                          Previously Rejected
                        </h4>

                        <p className="mt-1 text-sm text-foreground">
                          <span className="font-medium">Reason:</span>{" "}
                          {applier.rejectionReason}
                        </p>

                        {applier.rejectedAt && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            Rejected on:{" "}
                            {new Date(
                              applier.rejectedAt
                            ).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

              {/* Personal Information */}
              <section>
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-foreground">
                    Personal information
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    Information provided by the worker during application.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoItem
                    icon={Briefcase}
                    label="Name"
                    value={applier.name}
                  />

                  <InfoItem
                    icon={Mail}
                    label="Email"
                    value={applier.email}
                  />

                  <InfoItem
                    icon={Phone}
                    label="Phone"
                    value={applier.phone}
                  />

                  <InfoItem
                    icon={Briefcase}
                    label="Work Types"
                    value={
                      applier.workTypes?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {applier.workTypes.map((work, index) => (
                            <Badge
                              key={`${work}-${index}`}
                              variant="secondary"
                            >
                              {work}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">
                          No work types selected
                        </span>
                      )
                    }
                  />

                  <InfoItem
                    icon={CalendarDays}
                    label="Applied On"
                    value={
                      applier.createdAt
                        ? new Date(
                            applier.createdAt
                          ).toLocaleDateString()
                        : "N/A"
                    }
                  />
                </div>
              </section>

              <Separator />

              {/* Address */}
              <section>
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-foreground">
                    Address
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    Address details provided by the worker.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoItem
                    icon={MapPin}
                    label="Place / Locality"
                    value={applier.address?.place || "N/A"}
                  />

                  <InfoItem
                    icon={MapPin}
                    label="Panchayath / Post Office"
                    value={applier.address?.panchayath || "N/A"}
                  />

                  <InfoItem
                    icon={MapPin}
                    label="City / District"
                    value={applier.address?.city || "N/A"}
                  />

                  <InfoItem
                    icon={MapPin}
                    label="State"
                    value={applier.address?.state || "N/A"}
                  />

                  <InfoItem
                    icon={MapPin}
                    label="Pincode"
                    value={applier.address?.pincode || "N/A"}
                  />
                </div>
              </section>

              <Separator />

              {/* Preferred Works */}
              <section>
                <div className="mb-3">
                  <h3 className="text-sm font-semibold text-foreground">
                    Preferred works
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    Work categories selected by the applicant.
                  </p>
                </div>

                {applier.preferredWorks?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {applier.preferredWorks.map((work, index) => (
                      <Badge
                        key={`${work}-${index}`}
                        variant="outline"
                        className="bg-muted/40"
                      >
                        {work}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No preferred works listed.
                  </p>
                )}
              </section>

              <Separator />

              {/* Agreement */}
              <section>
                <div className="mb-3">
                  <h3 className="text-sm font-semibold text-foreground">
                    Application agreement
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    The applicant confirmed the required worker agreement
                    before submitting the application.
                  </p>
                </div>

                <div className="flex items-center justify-between rounded-lg border bg-card px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50 dark:bg-green-950">
                      <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Worker agreement accepted
                      </p>

                      <p className="text-xs text-muted-foreground">
                        All required confirmations were accepted during
                        application.
                      </p>
                    </div>
                  </div>

                  <Badge
                    variant="outline"
                    className="border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-400"
                  >
                    <Check className="mr-1 h-3 w-3" />
                    Accepted
                  </Badge>
                </div>
              </section>
            </div>
          )}

          {/* Footer */}
          {applier && (
            <DialogFooter className="border-t pt-4">
              <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-foreground">
                    Review application
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Approve or reject this worker application.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={approveWorker}
                    disabled={
                      isSubmitting || applier.status === "approved"
                    }
                    className="border-green-300 text-green-700 hover:bg-green-50 hover:text-green-800 dark:border-green-900 dark:text-green-400 dark:hover:bg-green-950"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : applier.status === "approved" ? (
                      <Check className="h-4 w-4" />
                    ) : null}

                    {applier.status === "approved"
                      ? "Approved"
                      : "Approve"}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setShowRejectModal(true)}
                    disabled={isSubmitting}
                    className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                    Reject
                  </Button>
                </div>
              </div>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      <RejectionDialog
        open={showRejectModal}
        workerId={applier?.id ?? null}
        onClose={() => setShowRejectModal(false)}
        onSuccess={handleRejectSuccess}
      />
    </>
  );
}