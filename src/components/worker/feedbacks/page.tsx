import { useEffect, useState } from "react";
import { Star, MessageSquareQuote, BriefcaseBusiness } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ReviewService } from "@/services/review-service";
import { AuthHelper } from "@/utils/auth-helper";

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

export default function Feedbacks() {
  const [stats, setStats] = useState<WorkerProfileStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const workerId = AuthHelper.getUserId()

        if (!workerId) {
          console.error("Worker ID not found");
          return;
        }

        const response = await ReviewService.getWorkerProfileStats(workerId);

        setStats(response.data.data);
      } catch (error) {
        console.error("Failed to load reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">


        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <Card key={item}>
              <CardContent className="h-28 animate-pulse" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="space-y-6">


        <Card>
          <CardContent className="flex min-h-[300px] flex-col items-center justify-center text-center">
            <MessageSquareQuote className="mb-4 h-12 w-12 text-muted-foreground" />

            <h2 className="text-lg font-semibold">
              Unable to load reviews
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Worker Summary */}
      <Card>
        <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={stats.workerProfileImage}
              alt={stats.name}
            />

            <AvatarFallback className="text-xl">
              {stats.name?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h2 className="text-xl font-semibold">
              {stats.name}
            </h2>

            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-current" />
                {stats.avgRating.toFixed(1)} rating
              </span>

              <span>
                {stats.totalReviews}{" "}
                {stats.totalReviews === 1 ? "review" : "reviews"}
              </span>

              <span className="flex items-center gap-1.5">
                <BriefcaseBusiness className="h-4 w-4" />
                {stats.totalWorksCompleted} completed works
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rating Overview */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Overall Rating
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-5">
              <div className="text-5xl font-bold">
                {stats.avgRating.toFixed(1)}
              </div>

              <div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${star <= Math.round(stats.avgRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                        }`}
                    />
                  ))}
                </div>

                <p className="mt-1 text-sm text-muted-foreground">
                  Based on {stats.totalReviews}{" "}
                  {stats.totalReviews === 1 ? "review" : "reviews"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Completed Works
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-4">
              <div className="rounded-lg border p-3">
                <BriefcaseBusiness className="h-6 w-6" />
              </div>

              <div>
                <p className="text-3xl font-bold">
                  {stats.totalWorksCompleted}
                </p>

                <p className="text-sm text-muted-foreground">
                  Successfully completed works
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Testimonials */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquareQuote className="h-5 w-5" />
            Client Feedback
          </CardTitle>
        </CardHeader>

        <CardContent>
          {stats.testimonials.length === 0 ? (
            <div className="flex min-h-[240px] flex-col items-center justify-center text-center">
              <MessageSquareQuote className="mb-4 h-12 w-12 text-muted-foreground" />

              <h3 className="text-lg font-semibold">
                No feedback yet
              </h3>

              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                You haven't received any written testimonials from
                clients yet. Complete more works and ask your clients
                to leave feedback.
              </p>
            </div>
          ) : (
            <div className="space-y-0">
              {stats.testimonials.map((review, index) => (
                <div key={`${review.createdAt}-${index}`}>
                  <div className="py-6 first:pt-0 last:pb-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-3">
                        <div className="rounded-full bg-muted p-2">
                          <MessageSquareQuote className="h-4 w-4" />
                        </div>

                        <div>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${star <= review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted-foreground"
                                  }`}
                              />
                            ))}
                          </div>

                          <p className="mt-3 leading-7 text-foreground">
                            "{review.testimonial}"
                          </p>

                          <p className="mt-3 text-xs text-muted-foreground">
                            {new Date(
                              review.createdAt
                            ).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      <span className="shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium">
                        {review.rating}/5
                      </span>
                    </div>
                  </div>

                  {index < stats.testimonials.length - 1 && (
                    <Separator />
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
