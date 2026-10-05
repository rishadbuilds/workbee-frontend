import { useEffect, useState } from "react";
import { CalendarIcon, Eye, RotateCcw, X } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { WorkService } from "@/services/work-service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Pagination, PaginationContent, PaginationEllipsis, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";

import { BookingsWorkDetailsModal } from "./modals/BookingWorkDetailModal";
import {
  STATUS_STYLES, fmt, formatWorkDate, label, toISODate, type Booking,
} from "./types/bookings-shared";

interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const PAGE_SIZE = 10;

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "assigned", label: "Assigned" },
  { value: "in-progress", label: "In progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const rangeLabel = (r?: DateRange) => {
  if (!r?.from) return "Pick a date range";
  if (!r.to || toISODate(r.from) === toISODate(r.to)) return fmt(r.from);
  return `${fmt(r.from)} – ${fmt(r.to)}`;
};

// 1 … 4 5 [6] 7 8 … 20
const getPageNumbers = (current: number, total: number): (number | "ellipsis")[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "ellipsis")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push("ellipsis");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("ellipsis");
  pages.push(total);
  return pages;
};

export default function AllBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1, limit: PAGE_SIZE, total: 0, totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [range, setRange] = useState<DateRange | undefined>();
  const [calendarOpen, setCalendarOpen] = useState(false);

  const [selected, setSelected] = useState<Booking | null>(null);

  const fromDate = range?.from ? toISODate(range.from) : "";
  // a single clicked day acts as a one-day range
  const toDate = range?.to ? toISODate(range.to) : fromDate;

  useEffect(() => {
    let ignore = false;

    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await WorkService.getAdminBookings({
          page,
          limit: PAGE_SIZE,
          status: status !== "all" ? status : undefined,
          fromDate: fromDate || undefined,
          toDate: toDate || undefined,
        });
        if (ignore) return;
        const data = res.data.data; // adjust if your ResponseHelper/axios wrapper differs
        setBookings(data.works);
        setPagination(data.pagination);
      } catch {
        if (!ignore) setError("Failed to load bookings. Please try again.");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchBookings();
    return () => { ignore = true; };
  }, [page, status, fromDate, toDate]);

  const onStatusChange = (v: string) => { setStatus(v); setPage(1); };
  const onRangeChange = (r: DateRange | undefined) => { setRange(r); setPage(1); };

  const resetFilters = () => {
    setStatus("all"); setRange(undefined); setPage(1);
  };

  const hasFilters = status !== "all" || !!range?.from;
  const goTo = (p: number) => {
    if (p >= 1 && p <= pagination.totalPages) setPage(p);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={onStatusChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Work date</Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[270px] justify-start font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className={range?.from ? "" : "text-muted-foreground"}>
                      {rangeLabel(range)}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    numberOfMonths={2}
                    defaultMonth={range?.from}
                    selected={range}
                    onSelect={onRangeChange}
                  />
                  <div className="flex justify-end gap-2 border-t p-2">
                    <Button
                      variant="ghost" size="sm"
                      disabled={!range?.from}
                      onClick={() => onRangeChange(undefined)}
                    >
                      <X className="mr-1 h-4 w-4" /> Clear
                    </Button>
                    <Button size="sm" onClick={() => setCalendarOpen(false)}>Done</Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {hasFilters && (
              <Button variant="outline" onClick={resetFilters}>
                <RotateCcw className="mr-2 h-4 w-4" /> Reset
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Work</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[60px] text-right">View</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : bookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      No bookings found.
                    </TableCell>
                  </TableRow>
                ) : (
                  bookings.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="font-medium">{b.workTitle}</TableCell>
                      <TableCell className="whitespace-nowrap">{formatWorkDate(b)}</TableCell>
                      <TableCell className="whitespace-nowrap">{b.contactNumber}</TableCell>
                      <TableCell className="max-w-[240px] truncate" title={b.manualAddress}>
                        {b.manualAddress || "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={STATUS_STYLES[b.status]}>
                          {label(b.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost" size="icon"
                          aria-label={`View details of ${b.workTitle}`}
                          onClick={() => setSelected(b)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              {pagination.total === 0
                ? "0 results"
                : `Showing ${(pagination.page - 1) * pagination.limit + 1}–${Math.min(
                    pagination.page * pagination.limit, pagination.total
                  )} of ${pagination.total}`}
            </p>

            {pagination.totalPages > 1 && (
              <Pagination className="mx-0 w-auto">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      className={page === 1 ? "pointer-events-none opacity-50" : ""}
                      onClick={(e) => { e.preventDefault(); goTo(page - 1); }}
                    />
                  </PaginationItem>

                  {getPageNumbers(page, pagination.totalPages).map((p, i) => (
                    <PaginationItem key={`${p}-${i}`}>
                      {p === "ellipsis" ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          href="#"
                          isActive={p === page}
                          onClick={(e) => { e.preventDefault(); goTo(p); }}
                        >
                          {p}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      className={page === pagination.totalPages ? "pointer-events-none opacity-50" : ""}
                      onClick={(e) => { e.preventDefault(); goTo(page + 1); }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </CardContent>
      </Card>

      <BookingsWorkDetailsModal booking={selected} onClose={() => setSelected(null)} />
    </div>
  );
}