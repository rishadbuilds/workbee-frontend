import { api } from "./axios-instance/axios-instance";
import { DISPUTE_ENDPOINTS } from "@/constants/api-endpoints/dispute-endpoints";
import type { CreateDisputePayload, DisputeActionPayload } from "./types/dispute";


export const DisputeService = {
  getUploadSignature: (resourceType: "image" | "video") => {
    return api.get(DISPUTE_ENDPOINTS.UPLOAD_SIGNATURE(resourceType));
  },
  createDispute: (data: CreateDisputePayload) => {
    return api.post(DISPUTE_ENDPOINTS.CREATE, data);
  },
  getMyDisputes: () => {
    return api.get(DISPUTE_ENDPOINTS.MY_DISPUTES);
  },
  getWorkerDisputes: () => {
    return api.get(DISPUTE_ENDPOINTS.WORKER_DISPUTES);
  },
  getDisputeById: (id: string) => {
    return api.get(DISPUTE_ENDPOINTS.ADMIN_DETAIL(id));
  },

  getAllDisputes: (params: {
    page: number;
    limit: number;
    status?: string;
    actionTarget?: 'all' | 'worker' | 'user';
    search?: string;
  }) => {
    return api.get(DISPUTE_ENDPOINTS.ADMIN_ALL, { params });
  },

  applyAction: (id: string, data: DisputeActionPayload) => {
    return api.patch(DISPUTE_ENDPOINTS.ADMIN_ACTION(id), data);
  },
};