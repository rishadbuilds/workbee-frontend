import type { MediaItem } from "./cloudinary.types";

export interface WorkerAssignedWorksParams {
    page?: number;
    limit?: number;
    bucket?: 'all' | 'assigned' | 'started' | 'ongoing' | 'completed';
    startDate?: string;
    endDate?: string;
}

export interface MyWorksParams {
  page?: number;
  limit?: number;
  bucket?: 'all' | 'active' | 'completed' | 'pending' | 'cancelled';
}

export interface LiveWorksParams {
  page?: number;
  limit?: number;
  bucket?: 'active' | 'completed';
}

export interface WorkerAddress {
    state: string;
    pincode: string;
    panchayath: string;
    city: string;
    place: string;
}

export interface AdminBookingsParams {
  page?: number;
  limit?: number;
  status?: string;
  fromDate?: string;
  toDate?: string;
}


export interface UpdateWorkDto {
    workTitle?: string;
    workCategory?: string;
    workType?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    budget?: number;
    status?: string;
    progress?: string;
    workerId?: string;
    manualAddress?: string;
    landmark?: string;
}

export interface PostWorkDto {
    userId: string;
    workTitle: string;
    workCategory: string;
    workType: string;

    date?: string;
    startDate?: string;
    endDate?: string;
    time: string;

    voiceFile: MediaItem | null;
    images: MediaItem[];
    videos: MediaItem[];

    description: string;
    duration?: string;
    budget?: string;

    latitude: number;
    longitude: number;

    currentLocation?: string;
    manualAddress?: string;
    landmark?: string;

    contactNumber: string;
    petrolAllowance?: string;
    extraRequirements?: string;
    anythingElse?: string;

    termsAccepted: boolean;
}