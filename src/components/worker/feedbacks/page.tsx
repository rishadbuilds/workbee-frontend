import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  MessageSquareQuote,
  RefreshCw,
  Star,
  ThumbsUp,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ReviewService } from "@/services/review-service";
import { AuthHelper } from "@/utils/auth-helper";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

interface Testimonial {
  rating: number;
  testimonial: string;
  createdAt: string;
}

interface WorkerProfileStats {
  id: string;
  name: string;
  workerProfileImage?: string;
  totalWorksCompleted: number;
  avgRating: number;
  totalReviews: number;
  testimonials: Testimonial[];
}

type RatingFilter = "all" | "5" | "4" | "3" | "2" | "1";
type PeriodFilter = "all" | "30" | "90" | "365";
type SortOption = "newest" | "oldest" | "highest" | "lowest";

const PAGE_SIZE = 5;

const PERIOD_LABELS: Record<PeriodFilter, string> = {
  all: "All time",
  "30": "Last 30 days",
  "90": "Last 90 days",
  "365": "Last 12 months",
};

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

function pluralize(
  count: number,
  singular: string,
  plural = `${singular}s`
) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function Stars({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <div
      className="flex items-center gap-0.5"
      role="img"
      aria-label={`${value} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "size-4",
            star <= Math.round(value)
              ? "fill-white text-white"
              : "fill-transparent text-muted-foreground/40",
            className
          )}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Loading state                               */
/* -------------------------------------------------------------------------- */

function FeedbacksSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-72" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <Card key={item}>
            <CardHeader className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-20" />
            </CardHeader>

            <CardFooter>
              <Skeleton className="h-4 w-36" />
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>

          <CardContent className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <Skeleton key={item} className="h-5 w-full" />
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>

          <CardContent className="space-y-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    Page                                    */
/* -------------------------------------------------------------------------- */

export default function Feedbacks() {
  const [stats, setStats] = useState<WorkerProfileStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Filters
  const [rating, setRating] = useState<RatingFilter>("all");
  const [period, setPeriod] = useState<PeriodFilter>("all");
  const [sort, setSort] = useState<SortOption>("newest");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const workerId = AuthHelper.getUserId();

      if (!workerId) {
        console.error("Worker ID not found");
        setError(true);
        return;
      }

      const response =
        await ReviewService.getWorkerProfileStats(workerId);

      setStats(response.data.data);
    } catch (err) {
      console.error("Failed to load reviews:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  // Reset pagination whenever filters or sorting change
  useEffect(() => {
    setCurrentPage(1);
  }, [rating, period, sort]);

  const testimonials = useMemo(
    () => stats?.testimonials ?? [],
    [stats]
  );

  /* --------------------------- Rating distribution -------------------------- */

  const distribution = useMemo(() => {
    const total = testimonials.length;

    return [5, 4, 3, 2, 1].map((value) => {
      const count = testimonials.filter(
        (t) => t.rating === value
      ).length;

      return {
        value,
        count,
        percent: total ? (count / total) * 100 : 0,
      };
    });
  }, [testimonials]);

  /* ---------------------------- Positive feedback --------------------------- */

  const positivePercent = useMemo(() => {
    if (!testimonials.length) return 0;

    const positive = testimonials.filter(
      (t) => t.rating >= 4
    ).length;

    return Math.round(
      (positive / testimonials.length) * 100
    );
  }, [testimonials]);

  /* ---------------------------- Filtering / sorting ------------------------- */

  const filtered = useMemo(() => {
    const cutoff =
      period === "all"
        ? null
        : Date.now() - Number(period) * 86_400_000;

    const list = testimonials.filter((t) => {
      if (
        rating !== "all" &&
        t.rating !== Number(rating)
      ) {
        return false;
      }

      if (
        cutoff &&
        new Date(t.createdAt).getTime() < cutoff
      ) {
        return false;
      }

      return true;
    });

    return list.sort((a, b) => {
      switch (sort) {
        case "oldest":
          return (
            new Date(a.createdAt).getTime() -
            new Date(b.createdAt).getTime()
          );

        case "highest":
          return (
            b.rating - a.rating ||
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
          );

        case "lowest":
          return (
            a.rating - b.rating ||
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
          );

        default:
          return (
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
          );
      }
    });
  }, [testimonials, rating, period, sort]);

  /* ------------------------------- Pagination ------------------------------- */

  const totalPages = Math.ceil(
    filtered.length / PAGE_SIZE
  );

  const startIndex =
    (currentPage - 1) * PAGE_SIZE;

  const endIndex = startIndex + PAGE_SIZE;

  const visible = filtered.slice(
    startIndex,
    endIndex
  );

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);
  };

  const hasActiveFilters =
    rating !== "all" || period !== "all";

  const resetFilters = () => {
    setRating("all");
    setPeriod("all");
    setSort("newest");
  };

  /* ------------------------------ Loading / error ----------------------------- */

  if (loading) {
    return <FeedbacksSkeleton />;
  }

  if (error || !stats) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex min-h-[320px] flex-col items-center justify-center gap-2 text-center">
            <div className="mb-2 rounded-full border bg-muted p-3">
              <MessageSquareQuote className="size-6 text-muted-foreground" />
            </div>

            <h2 className="text-lg font-semibold">
              Couldn't load your reviews
            </h2>

            <p className="max-w-sm text-sm text-muted-foreground">
              Something went wrong while fetching your
              feedback. Check your connection and try again.
            </p>

            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={loadReviews}
            >
              <RefreshCw className="size-4" />
              Try again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* ---------------------------------- Page ---------------------------------- */

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Average rating"
          value={stats.avgRating.toFixed(1)}
          icon={<Star className="size-4" />}
          footer={
            <Stars
              value={stats.avgRating}
              className="size-3.5"
            />
          }
        />

        <StatCard
          label="Total reviews"
          value={String(stats.totalReviews)}
          icon={<MessageSquareQuote className="size-4" />}
          footer={`${pluralize(
            testimonials.length,
            "written testimonial"
          )}`}
        />

        <StatCard
          label="Completed works"
          value={String(stats.totalWorksCompleted)}
          icon={<BriefcaseBusiness className="size-4" />}
          footer="Successfully delivered"
        />

        <StatCard
          label="Positive feedback"
          value={
            testimonials.length
              ? `${positivePercent}%`
              : "–"
          }
          icon={<ThumbsUp className="size-4" />}
          footer="Testimonials rated 4 stars or higher"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Rating breakdown */}
        <Card className="lg:col-span-1 lg:self-start">
          <CardHeader>
            <CardTitle className="text-base">
              Rating breakdown
            </CardTitle>

            <CardDescription>
              Select a row to filter the feedback list.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-1">
            {distribution.map(
              ({ value, count, percent }) => {
                const active =
                  rating === String(value);

                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={active}
                    disabled={count === 0}
                    onClick={() =>
                      setRating(
                        active
                          ? "all"
                          : (String(
                            value
                          ) as RatingFilter)
                      )
                    }
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors",
                      "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      "disabled:pointer-events-none disabled:opacity-50",
                      active && "bg-muted"
                    )}
                  >
                    <span className="flex w-8 shrink-0 items-center gap-1 font-medium tabular-nums">
                      {value}

                      <Star className="size-3.5 fill-white text-white-400" />
                    </span>

                    <Progress
                      value={percent}
                      className="h-2 flex-1"
                    />

                    <span className="w-6 shrink-0 text-right text-muted-foreground tabular-nums">
                      {count}
                    </span>
                  </button>
                );
              }
            )}
          </CardContent>

          <CardFooter className="text-xs text-muted-foreground">
            Based on{" "}
            {pluralize(
              testimonials.length,
              "written testimonial"
            )}
            .
          </CardFooter>
        </Card>

        {/* Feedback list */}
        <Card className="lg:col-span-2">
          <CardHeader className="space-y-4">
            <div className="space-y-1.5">
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageSquareQuote className="size-4" />
                Client feedback
              </CardTitle>

              <CardDescription>
                What clients said about your work.
              </CardDescription>
            </div>

            {/* Toolbar */}
            {testimonials.length > 0 && (
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                {/* Rating filter */}
                <Select
                  value={rating}
                  onValueChange={(v) =>
                    setRating(v as RatingFilter)
                  }
                >
                  <SelectTrigger
                    className="w-full sm:w-[130px]"
                    aria-label="Filter by rating"
                  >
                    <SelectValue placeholder="Rating" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="all">
                      All ratings
                    </SelectItem>

                    {[5, 4, 3, 2, 1].map(
                      (value) => (
                        <SelectItem
                          key={value}
                          value={String(value)}
                        >
                          {value}{" "}
                          {value === 1
                            ? "star"
                            : "stars"}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>

                {/* Period filter */}
                <Select
                  value={period}
                  onValueChange={(v) =>
                    setPeriod(v as PeriodFilter)
                  }
                >
                  <SelectTrigger
                    className="w-full sm:w-[150px]"
                    aria-label="Filter by date"
                  >
                    <SelectValue placeholder="Date" />
                  </SelectTrigger>

                  <SelectContent>
                    {(
                      Object.keys(
                        PERIOD_LABELS
                      ) as PeriodFilter[]
                    ).map((key) => (
                      <SelectItem
                        key={key}
                        value={key}
                      >
                        {PERIOD_LABELS[key]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Sort */}
                <Select
                  value={sort}
                  onValueChange={(v) =>
                    setSort(v as SortOption)
                  }
                >
                  <SelectTrigger
                    className="w-full sm:w-[150px]"
                    aria-label="Sort feedback"
                  >
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="newest">
                      Newest first
                    </SelectItem>

                    <SelectItem value="oldest">
                      Oldest first
                    </SelectItem>

                    <SelectItem value="highest">
                      Highest rated
                    </SelectItem>

                    <SelectItem value="lowest">
                      Lowest rated
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* Reset */}
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    onClick={resetFilters}
                  >
                    Reset
                    <X className="size-4" />
                  </Button>
                )}
              </div>
            )}
          </CardHeader>

          <CardContent>
            {testimonials.length === 0 ? (
              <EmptyState
                title="No feedback yet"
                description="You haven't received any written testimonials yet. Complete more works and ask your clients to leave feedback."
              />
            ) : filtered.length === 0 ? (
              <EmptyState
                title="No matching feedback"
                description="Try changing your filters or clear them to see all feedback."
                action={
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetFilters}
                  >
                    Clear filters
                  </Button>
                }
              />
            ) : (
              <div>
                {visible.map((review, index) => (
                  <div
                    key={`${review.createdAt}-${index}`}
                  >
                    <article className="flex items-start gap-4 py-5 first:pt-0 last:pb-0">
                      <div className="hidden rounded-full border bg-muted p-2 sm:block">
                        <MessageSquareQuote className="size-4 text-muted-foreground" />
                      </div>

                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <Stars
                            value={review.rating}
                          />

                          <Badge
                            variant={
                              review.rating >= 4
                                ? "secondary"
                                : "outline"
                            }
                            className="tabular-nums"
                          >
                            {review.rating}/5
                          </Badge>
                        </div>

                        <blockquote className="break-words text-sm leading-6">
                          {review.testimonial}
                        </blockquote>

                        <time
                          dateTime={review.createdAt}
                          className="block text-xs text-muted-foreground"
                        >
                          {formatDate(
                            review.createdAt
                          )}
                        </time>
                      </div>
                    </article>

                    {index < visible.length - 1 && (
                      <Separator />
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>

          {/* Pagination */}
          {filtered.length > 0 && (
            <CardFooter className="flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                Showing {startIndex + 1}-
                {Math.min(
                  endIndex,
                  filtered.length
                )}{" "}
                of{" "}
                {pluralize(
                  filtered.length,
                  "testimonial"
                )}
              </p>

              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  {/* Previous */}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() =>
                      goToPage(currentPage - 1)
                    }
                  >
                    Previous
                  </Button>

                  {/* Page numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from(
                      { length: totalPages },
                      (_, index) => index + 1
                    ).map((page) => (
                      <Button
                        key={page}
                        variant={
                          currentPage === page
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        className="size-9 p-0"
                        onClick={() =>
                          goToPage(page)
                        }
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  {/* Next */}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={
                      currentPage === totalPages
                    }
                    onClick={() =>
                      goToPage(currentPage + 1)
                    }
                  >
                    Next
                  </Button>
                </div>
              )}
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Small components                             */
/* -------------------------------------------------------------------------- */

function StatCard({
  label,
  value,
  icon,
  footer,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardDescription>
            {label}
          </CardDescription>

          <div className="text-muted-foreground">
            {icon}
          </div>
        </div>

        <CardTitle className="text-3xl font-semibold tabular-nums">
          {value}
        </CardTitle>
      </CardHeader>

      <CardFooter className="text-xs text-muted-foreground">
        {footer}
      </CardFooter>
    </Card>
  );
}

function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center text-center">
      <div className="mb-4 rounded-full border bg-muted p-3">
        <MessageSquareQuote className="size-6 text-muted-foreground" />
      </div>

      <h3 className="text-base font-semibold">
        {title}
      </h3>

      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>

      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
}
