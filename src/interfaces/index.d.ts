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

export interface IVisit {
  id: number;
  visitor: number;
  status: "Waiting" | "Serving" | "Completed" | "Cancelled";
  station: number | null;
  created_at?: string;
  entered_at: string | null;
  served_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
}
