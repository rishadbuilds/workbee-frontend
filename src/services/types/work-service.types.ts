
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