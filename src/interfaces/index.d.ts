export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

export interface IVisitorDetailsForm {
  name: string;
  phone: string;
}

export interface IVisitor {
  /* UUID */
  id: string;
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
  /* UUID */
  id: string;
  /* UUID */
  visitor: string;
  visitor_name: string; // denormalized
  status: IVisitStatus;
  /* integer ID */
  station: number | null;
  station_name: string | null; // denormalized
  created_at?: string;
  entered_at: string | null;
  served_at: string | null;
  served_by_name: string | null; // denormalized
  completed_at: string | null;
  cancelled_at: string | null;
}

export interface IMember {
  /* UUID */
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
  /* integer ID */
  id: number;
  name: string;
  status: IStationStatus;
  opened_by: string | null;
  opened_by_name: string | null; // denormalized
  opened_at: string | null;
  /* When statis is "Calling" or "Serving" this is set to the related visit id */
  /* UUID */
  visit: string | null;
  visitor_name: string | null; // denormalized
  called_at: string | null;
  served_at: string | null;
}
