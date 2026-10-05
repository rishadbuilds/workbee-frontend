import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogClose, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  PROGRESS_STYLES, STATUS_STYLES, formatDateTime, formatWorkDate, label,
  type Booking,
} from "../types/bookings-shared";

interface BookingsWorkDetailsModalProps {
  booking: Booking | null;
  onClose: () => void;
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="text-sm break-words">{children || "—"}</div>
    </div>
  );
}

export function BookingsWorkDetailsModal({ booking, onClose }: BookingsWorkDetailsModalProps) {
  return (
    <Dialog open={!!booking} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        {booking && (
          <>
            <DialogHeader>
              <DialogTitle>{booking.workTitle}</DialogTitle>
              <DialogDescription>{booking.workCategory}</DialogDescription>
              <div className="flex flex-wrap gap-2 pt-1">
                <Badge variant="outline" className={STATUS_STYLES[booking.status]}>
                  {label(booking.status)}
                </Badge>
                {booking.progress && (
                  <Badge variant="outline" className={PROGRESS_STYLES[booking.progress]}>
                    Progress: {label(booking.progress)}
                  </Badge>
                )}
              </div>
            </DialogHeader>

            <div className="grid gap-5 sm:grid-cols-2">
              <Detail label="Work type">
                {booking.workType === "multipleDay" ? "Multiple days" : "One day"}
              </Detail>
              <Detail label="Date">{formatWorkDate(booking)}</Detail>
              <Detail label="Time">{booking.time}</Detail>
              <Detail label="Duration">{booking.duration}</Detail>
              <Detail label="Budget">
                {booking.budget ? `₹${Number(booking.budget).toLocaleString("en-IN")}` : ""}
              </Detail>
              <Detail label="Petrol allowance">{booking.petrolAllowance}</Detail>
              <Detail label="Contact number">{booking.contactNumber}</Detail>
              <Detail label="Current location">{booking.currentLocation}</Detail>
              <div className="sm:col-span-2">
                <Detail label="Address">{booking.manualAddress}</Detail>
              </div>
              <Detail label="Landmark">{booking.landmark}</Detail>
              <Detail label="Posted on">{formatDateTime(booking.createdAt)}</Detail>
              <div className="sm:col-span-2">
                <Detail label="Description">{booking.description}</Detail>
              </div>
              <div className="sm:col-span-2">
                <Detail label="Extra requirements">{booking.extraRequirements}</Detail>
              </div>
              <div className="sm:col-span-2">
                <Detail label="Anything else">{booking.anythingElse}</Detail>
              </div>
              <Detail label="Client ID"><span className="font-mono text-xs">{booking.userId}</span></Detail>
              <Detail label="Worker ID">
                {booking.workerId && <span className="font-mono text-xs">{booking.workerId}</span>}
              </Detail>
              <Detail label="Last updated">{formatDateTime(booking.updatedAt)}</Detail>
            </div>

            {booking.images.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Images</p>
                <div className="grid grid-cols-3 gap-2">
                  {booking.images.map((img) => (
                    <a key={img.publicId} href={img.url} target="_blank" rel="noreferrer">
                      <img
                        src={img.url} alt="Work"
                        className="aspect-square w-full rounded-md border object-cover"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {booking.videos.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Videos</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {booking.videos.map((v) => (
                    <video key={v.publicId} src={v.url} controls className="w-full rounded-md border" />
                  ))}
                </div>
              </div>
            )}

            {booking.voiceFile && (
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Voice note</p>
                <audio src={booking.voiceFile.url} controls className="w-full" />
              </div>
            )}

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default BookingsWorkDetailsModal;