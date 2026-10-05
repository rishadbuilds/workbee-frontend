export interface MediaItem {
  url: string;
  publicId: string;
}

export interface Booking {
  id: string;
  userId: string;
  workerId?: string;
  workTitle: string;
  workCategory: string;
  workType: "oneDay" | "multipleDay";
  date?: string;
  startDate?: string;
  endDate?: string;
  time: string;
  duration?: string;
  budget?: string;
  description: string;
  contactNumber: string;
  manualAddress?: string;
  landmark?: string;
  currentLocation?: string;
  petrolAllowance?: string;
  extraRequirements?: string;
  anythingElse?: string;
  images: MediaItem[];
  videos: MediaItem[];
  voiceFile?: MediaItem | null;
  status: "pending" | "assigned" | "in-progress" | "completed" | "cancelled";
  progress?: "started" | "ongoing" | "completed" | null;
  createdAt: string;
  updatedAt?: string;
}

export const STATUS_STYLES: Record<Booking["status"], string> = {
  pending: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
  assigned: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20",
  "in-progress": "bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/20",
  completed: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  cancelled: "bg-destructive/15 text-destructive border-destructive/20",
};

export const PROGRESS_STYLES: Record<string, string> = {
  started: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/20",
  ongoing: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/20",
  completed: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
};

/* ---------- helpers ---------- */

// Local-time YYYY-MM-DD (toISOString would shift the day in IST)
export const toISODate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const fmt = (d: Date) =>
  d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

export const formatDate = (d?: string) => (d ? fmt(new Date(d)) : "—");

export const formatDateTime = (d?: string) =>
  d
    ? new Date(d).toLocaleString("en-IN", {
        day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
      })
    : "—";

export const formatWorkDate = (b: Booking) =>
  b.workType === "multipleDay"
    ? `${formatDate(b.startDate)} – ${formatDate(b.endDate)}`
    : formatDate(b.date);

export const label = (s: string) =>
  s.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());