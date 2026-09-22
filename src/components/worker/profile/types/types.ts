export interface WorkerAddress {
  state: string;
  pincode: string;
  panchayath: string;
  city: string;
  place: string;
}

export interface WorkerProfileData {
  _id: string;

  name: string;

  email: string;

  phone: string;

  address: WorkerAddress;

  workTypes: string[];

  bio?: string;

  preferredWorks: string[];

  workerProfileImage?: string;

  workerProfileImagePublicId?: string;

  createdAt: string;
}

// modal props

export interface ChangePasswordModalProps {
  isOpen: boolean;

  setIsOpen: (isOpen: boolean) => void;
}