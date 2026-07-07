export interface User {
  id?: string;
  name: string;
  email: string;
  password_hash: string;
  role: "CUSTOMER" | "TECHNICIAN" | "ADMIN";
  created_at?: Date;
  updated_at?: Date;
}

export interface Technician {
  id?: string;
  bio: string;
  is_available: boolean;
  rating_avg?: number;
  user_id: string;
}

export interface TechnicianService {
  id?: string;
  technician_id: string;
  service_id: string;
}

export interface Service {
  id?: string;
  name: string;
  description: string;
  category_id: string;
}

export interface Review {
  id?: string;
  user_id: string;
  technician_id: string;
  booking_id: string;
  rating?: number;
  comment: string;
  created_at?: Date;
}
export interface Payments {
  id: string;
  booking_id: string;

  amount: number;
  method: string;
  provider: string;
  status: status;
  paid_at: Date;
}
export interface Category {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
}

export interface Booking {
    id:string ;
    user_id:string;
    technician_id:string;
    service_id:string;
    status :status;
    scheduled_At: Date
    total_price:number;
    created_At: Date;
}

export type status =
  | "PENDING"
  | " CONFIRMED"
  | " IN_PROGRESS"
  | " COMPLETED"
  | "CANCELLED";
