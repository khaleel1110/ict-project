
import { Injectable, inject } from '@angular/core';

import {
  Firestore,
  Timestamp,
  collection,
  collectionData,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  arrayUnion,
  query,
  where,
  getDocs,
} from '@angular/fire/firestore';

import { Observable } from 'rxjs';

import {
  Issue,
  IssueActivity,
  CreateIssuePayload,
} from '../models/issue.model';

@Injectable({
  providedIn: 'root',
})
export class IssueService {
  private readonly firestore = inject(Firestore);

  // =========================================================
  // COLLECTION
  // =========================================================

  private readonly issuesCollection = collection(
    this.firestore,
    'issues'
  );

  // =========================================================
  // ISSUES OBSERVABLE
  // =========================================================

  readonly issues$: Observable<Issue[]> =
    collectionData(
      this.issuesCollection,
      {
        idField: 'id',
      }
    ) as Observable<Issue[]>;

  // =========================================================
  // GET ALL
  // =========================================================

  getAll(): Observable<Issue[]> {
    return this.issues$;
  }

  // =========================================================
  // GET SINGLE ISSUE BY DOCUMENT ID
  // =========================================================

  async getById(
    id: string
  ): Promise<Issue | null> {
    const issueRef = doc(
      this.firestore,
      'issues',
      id
    );

    const snapshot = await getDoc(issueRef);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as Issue;
  }

  // =========================================================
  // GET ISSUE BY TICKET ID
  // =========================================================

  async getByTicketId(
    ticketId: string
  ): Promise<Issue | null> {
    const normalizedTicketId =
      ticketId.trim().toUpperCase();

    if (!normalizedTicketId) {
      return null;
    }

    const issuesQuery = query(
      this.issuesCollection,
      where(
        'ticketId',
        '==',
        normalizedTicketId
      )
    );

    const snapshot =
      await getDocs(issuesQuery);

    if (snapshot.empty) {
      return null;
    }

    const issueDoc =
      snapshot.docs[0];

    return {
      id: issueDoc.id,
      ...issueDoc.data(),
    } as Issue;
  }

  // =========================================================
  // CREATE
  // =========================================================

  async create(
    payload: CreateIssuePayload
  ): Promise<Issue> {
    const ticketId =
      this.generateTicketId();

    const issue = {
      ...payload,

      ticketId,

      status: 'Open' as const,

      reports: [],

      dateReported:
        serverTimestamp(),

      createdAt:
        serverTimestamp(),

      updatedAt:
        serverTimestamp(),
    };

    const document =
      await addDoc(
        this.issuesCollection,
        issue
      );

    return {
      id: document.id,
      ...payload,
      ticketId,
      status: 'Open',
      reports: [],
    };
  }

  // =========================================================
  // UPDATE
  // =========================================================

  async update(
    id: string,
    data: Partial<Issue>
  ): Promise<void> {
    const issueRef =
      doc(
        this.firestore,
        'issues',
        id
      );

    await updateDoc(
      issueRef,
      {
        ...data,

        updatedAt:
          serverTimestamp(),
      }
    );
  }

  // =========================================================
  // DELETE
  // =========================================================

  async delete(
    id: string
  ): Promise<void> {
    const issueRef =
      doc(
        this.firestore,
        'issues',
        id
      );

    await deleteDoc(
      issueRef
    );
  }

  // =========================================================
  // ADD ACTIVITY / REPORT
  // =========================================================


async addReport(
  issueId: string,
  report: IssueActivity
): Promise<void> {

  const issueRef = doc(
    this.firestore,
    'issues',
    issueId
  );

  // ---------------------------------------------------------
  // REMOVE UNDEFINED OPTIONAL VALUES
  // ---------------------------------------------------------

  const cleanReport: Record<string, unknown> = {
    id: report.id,
    type: report.type,
    message: report.message,
    createdAt: report.createdAt,
  };

  if (report.createdBy !== undefined) {
    cleanReport['createdBy'] =
      report.createdBy;
  }

  if (report.technicianId !== undefined) {
    cleanReport['technicianId'] =
      report.technicianId;
  }

  if (report.technicianName !== undefined) {
    cleanReport['technicianName'] =
      report.technicianName;
  }

  // ---------------------------------------------------------
  // SAVE
  // ---------------------------------------------------------

  await updateDoc(issueRef, {
    reports: arrayUnion(cleanReport),
    updatedAt: serverTimestamp(),
  });
}


  // =========================================================
  // GENERATE TICKET
  // =========================================================

  private generateTicketId(): string {
    const year =
      new Date().getFullYear();

    const random =
      Math.floor(
        10000 +
        Math.random() * 90000
      );

    return `ICT-${year}-${random}`;
  }
}

