import { useEffect, useState, useCallback } from "react";
import {
  Eye,
  X,
  Search,
  Loader2,
} from "lucide-react";

import { WorkService } from "@/services/work-service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { toast } from "sonner";

import WorkerApplicationDialog, {
  type Applier,
} from "./modal/WorkerApplicationDialog";

type StatusFilter =
  | "all"
  | "pending"
  | "approved"
  | "rejected";

const STATUS_TABS: {
  value: StatusFilter;
  label: string;
}[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

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

export default function NewAppliers() {
  const [appliers, setAppliers] = useState<Applier[]>([]);
  const [totalAppliers, setTotalAppliers] = useState(0);

  const [loading, setLoading] = useState(true);

  const [selectedApplier, setSelectedApplier] =
    useState<Applier | null>(null);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [debouncedSearch, setDebouncedSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 10;

  const [totalPages, setTotalPages] =
    useState(0);

  // -----------------------------
  // Debounce search
  // -----------------------------

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // -----------------------------
  // Reset page when filters change
  // -----------------------------

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter]);

  // -----------------------------
  // Fetch applications
  // -----------------------------

  const getNewAppliers = useCallback(async () => {
    try {
      setLoading(true);

      const response =
        await WorkService.getAppliers(
          currentPage,
          itemsPerPage,
          debouncedSearch,
          statusFilter
        );

      if (response.data.success) {
        const data = response.data.data;

        setAppliers(data.workers || []);
        setTotalAppliers(data.total || 0);
        setTotalPages(data.totalPages || 0);
      }
    } catch (error) {
      console.error(
        "Error fetching new appliers:",
        error
      );

      toast.error(
        "Error while fetching worker applications."
      );
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    itemsPerPage,
    debouncedSearch,
    statusFilter,
  ]);

  useEffect(() => {
    getNewAppliers();
  }, [getNewAppliers]);

  // -----------------------------
  // Handlers
  // -----------------------------

  const handleViewDetails = (
    applier: Applier
  ) => {
    setSelectedApplier(applier);
    setIsModalOpen(true);
  };

  const handlePageChange = (
    newPage: number
  ) => {
    if (
      newPage < 1 ||
      newPage > totalPages
    ) {
      return;
    }

    setCurrentPage(newPage);
  };

  const handleReset = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  // -----------------------------
  // Initial loading
  // -----------------------------

  if (
    loading &&
    appliers.length === 0 &&
    !searchTerm &&
    statusFilter === "all"
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center text-center">
          <Loader2 className="mb-4 h-8 w-8 animate-spin text-primary" />

          <p className="text-sm text-muted-foreground">
            Loading appliers...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl space-y-4">
        {/* Status Tabs */}

        <Tabs
          value={statusFilter}
          onValueChange={(value) =>
            setStatusFilter(
              value as StatusFilter
            )
          }
        >
          <TabsList className="w-full sm:w-fit">
            {STATUS_TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex-1 sm:flex-none"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          {/* Toolbar */}

          <div className="flex flex-wrap items-center justify-between gap-4 border-b p-4">
            <div className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                placeholder="Search by name, email, phone..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                className="pl-9 pr-9"
              />

              {loading && searchTerm && (
                <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
              )}
            </div>

            {(searchTerm ||
              statusFilter !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
              >
                <X className="mr-1 h-4 w-4" />
                Reset
              </Button>
            )}
          </div>

          {/* Table */}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/40">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Name
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Email
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Phone
                  </th>

                  <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>

                  <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Details
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {loading &&
                appliers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center"
                    >
                      <Loader2 className="mx-auto h-7 w-7 animate-spin text-primary" />
                    </td>
                  </tr>
                ) : appliers.length > 0 ? (
                  appliers.map((applier) => (
                    <tr
                      key={applier.id}
                      className="transition-colors hover:bg-muted/40"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="font-medium text-foreground">
                          {applier.name}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {applier.email}
                      </td>

                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {applier.phone}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <ApplicationStatusBadge
                          status={applier.status}
                        />
                      </td>

                      <td className="px-6 py-4 text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleViewDetails(
                              applier
                            )
                          }
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center"
                    >
                      <div className="flex flex-col items-center">
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                          <Search className="h-5 w-5 text-muted-foreground" />
                        </div>

                        <p className="text-sm font-medium text-foreground">
                          No appliers found
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {searchTerm ||
                          statusFilter !==
                            "all"
                            ? "Try changing your search or filter."
                            : "No applications yet."}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}

          {totalAppliers > 0 && (
            <div className="flex flex-col gap-3 border-t px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-muted-foreground">
                Showing{" "}
                {(currentPage - 1) *
                  itemsPerPage +
                  1}{" "}
                to{" "}
                {Math.min(
                  currentPage *
                    itemsPerPage,
                  totalAppliers
                )}{" "}
                of {totalAppliers} appliers
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handlePageChange(
                      currentPage - 1
                    )
                  }
                  disabled={
                    currentPage === 1 ||
                    loading
                  }
                >
                  Previous
                </Button>

                <span className="min-w-[110px] px-2 text-center text-sm text-muted-foreground">
                  Page {currentPage} of{" "}
                  {totalPages || 1}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handlePageChange(
                      currentPage + 1
                    )
                  }
                  disabled={
                    currentPage >=
                      totalPages ||
                    loading
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Worker application modal */}

      <WorkerApplicationDialog
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedApplier(null);
        }}
        applier={selectedApplier}
        onRefresh={getNewAppliers}
      />
    </div>
  );
}