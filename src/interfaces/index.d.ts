export interface ICategory {
  id: number;
  title: string;
}

export type IStatus = "published" | "draft" | "rejected";

export interface IPost {
  id: number;
  title: string;
  content: string;
  status: IStatus;
  category: ICategory;
}

export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

export interface IVisitorDetailsForm {
  name: string;
  phone: string;
}

export interface IVisitor {
  id: number;
  name: string;
  phone: string;
  created_at: string;
  last_visited_at: string;
}

export const IVisitStatus = [
  "Waiting",
  "Serving",
  "Completed",
  "Cancelled",
] as const;
export type IVisitStatus = (typeof IVisitStatus)[number];

export interface IVisit {
  id: number;
  visitor: number;
  visitor_name: string;
  status: IVisitStatus;
  station: number | null;
  created_at?: string;
  entered_at: string | null;
  served_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
}

export interface IMember {
  id: string;
  name: string;
  email: string;
  role: IMemberRole;
  last_sign_in_at: string;
}

export const IMemberRole = ["Owner", "Admin", "Staff"] as const;
export type IMemberRole = (typeof IMemberRole)[number];

export const IStationStatus = ["Closed", "Open", "Serving"] as const;
export type IStationStatus = (typeof IStationStatus)[number];

export interface IStation {
  id: number;
  name: string;
  status: IStationStatus;
  opened_by: string | null;
  opened_at: string | null;
  serving_visit: number | null;
}
