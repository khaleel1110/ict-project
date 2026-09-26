
import { Timestamp } from '@angular/fire/firestore';

// =========================================================
// ISSUE CATEGORY
// =========================================================

export type IssueCategory =
  | 'hardware'
  | 'software'
  | 'network'
  | 'account'
  | 'other';

// =========================================================
// ISSUE PRIORITY
// =========================================================

export type IssuePriority =
  | 'Critical'
  | 'High'
  | 'Medium'
  | 'Low';

// =========================================================
// ISSUE STATUS
// =========================================================

export type IssueStatus =
  | 'Open'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Closed';

// =========================================================
// ACTIVITY TYPE
// =========================================================

export type IssueActivityType =
  | 'assignment'
  | 'status'
  | 'report'
  | 'note';

// =========================================================
// FIRESTORE DATE
// =========================================================

export type FirestoreDate =
  | Timestamp
  | Date
  | string
  | number
  | null
  | undefined;

// =========================================================
// ISSUE ACTIVITY
// =========================================================

export interface IssueActivity {
  id: string;

  type: IssueActivityType;

  message: string;

  createdAt: FirestoreDate;

  createdBy?: string;

  technicianId?: string;

  technicianName?: string;
}

// =========================================================
// ISSUE
// =========================================================

export interface Issue {
  id: string;

  ticketId: string;

  fullName: string;

  email: string;

  phone?: string;

  department?: string;

  category: IssueCategory;

  priority: IssuePriority;

  status: IssueStatus;

  description: string;

  adminNotes?: string;

  assignedTechnicianId?: string;

  assignedTechnician?: string;

  assignedTechnicianEmail?: string;

  reports?: IssueActivity[];

  dateReported?: FirestoreDate;

  createdAt?: FirestoreDate;

  updatedAt?: FirestoreDate;
}

// =========================================================
// CREATE ISSUE PAYLOAD
// =========================================================
//
// Public users should NOT provide:
// - id
// - ticketId
// - status
// - reports
// - dates
// - assignment information
//
// These are controlled by IssueService/admin.
//
// =========================================================

export interface CreateIssuePayload {
  fullName: string;

  email: string;

  phone?: string;

  department?: string;

  category: IssueCategory;

  priority: IssuePriority;

  description: string;
}

