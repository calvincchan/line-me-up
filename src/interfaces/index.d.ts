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
  "Calling",
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
  served_by_name: string | null;
  station: number | null;
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

export const IStationStatus = ["Closed", "Open", "Calling", "Serving"] as const;
export type IStationStatus = (typeof IStationStatus)[number];

export interface IStation {
  id: number;
  name: string;
  status: IStationStatus;
  opened_by: string | null;
  opened_by_name: string | null;
  opened_at: string | null;
  /* When statis is "Calling" or "Serving" this is set to the related visit id */
  visit: number | null;
  visitor_name: string | null;
  called_at: string | null;
  served_at: string | null;
}
