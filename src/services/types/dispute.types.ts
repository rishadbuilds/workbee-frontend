
export type ComplaintType =
  | "against_worker" | "about_work" | "cleanliness" | "behavior"
  | "work_not_completed" | "fraud_suspicion" | "other";

export type DisputeActionType =
  | "block_worker" | "unblock_worker"
  | "block_user" | "unblock_user"
  | "blacklist_worker" | "unblacklist_worker"
  | "blacklist_user" | "unblacklist_user"
  | "warning_email_worker" | "warning_email_user"
  | "no_action";

export interface CreateDisputePayload {
  workId: string;
  workerId: string;
  complaintType: ComplaintType;
  description: string;
  proofImages?: string[];
  proofVideo?: string;
}

export interface DisputeActionPayload {
  actionType: DisputeActionType;
  reason: string;
}

export interface WorkerSummary {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  isBlocked: boolean;
  isBlacklisted: boolean;
  totalWorksCompleted: number;
  totalActionsTaken: number;
}

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  isBlocked: boolean;
  isBlacklisted: boolean;
  totalActionsTaken: number;
}