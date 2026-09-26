
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {RouterLink, RouterLinkActive} from '@angular/router';

import { Timestamp } from '@angular/fire/firestore';

import { IssueService } from '../services/issue.service';
import { Issue } from '../models/issue.model';

@Component({
  selector: 'app-track-status',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './track-status.component.html',
})
export class TrackStatusComponent {
  searchForm: FormGroup;

  result: Issue | null = null;

  notFound = false;
  searched = false;
  isSearching = false;

  constructor(
    private fb: FormBuilder,
    private issueService: IssueService
  ) {
    this.searchForm = this.fb.group({
      ticketId: [
        '',
        Validators.required,
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email,
        ],
      ],
    });
  }

  // =========================================================
  // SEARCH
  // =========================================================

  async search(): Promise<void> {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }

    this.isSearching = true;
    this.searched = true;
    this.notFound = false;
    this.result = null;

    const ticketId =
      String(
        this.searchForm.get(
          'ticketId'
        )?.value ?? ''
      )
        .trim()
        .toUpperCase();

    const email =
      String(
        this.searchForm.get(
          'email'
        )?.value ?? ''
      )
        .trim()
        .toLowerCase();

    try {
      const found =
        await this.issueService.getByTicketId(
          ticketId
        );

      if (
        found &&
        found.email
          ?.trim()
          .toLowerCase() === email
      ) {
        this.result = found;
        this.notFound = false;
      } else {
        this.result = null;
        this.notFound = true;
      }
    } catch (error) {
      console.error(
        'Failed to search ticket:',
        error
      );

      this.result = null;
      this.notFound = true;
    } finally {
      this.isSearching = false;
    }
  }

  // =========================================================
  // DATE
  // =========================================================

  formatFirestoreDate(
    value: unknown
  ): Date | null {
    const millis =
      this.toMillis(value);

    return millis > 0
      ? new Date(millis)
      : null;
  }

  private toMillis(
    value: unknown
  ): number {
    if (!value) {
      return 0;
    }

    if (value instanceof Date) {
      return value.getTime();
    }

    if (value instanceof Timestamp) {
      return value.toMillis();
    }

    if (typeof value === 'number') {
      return value;
    }

    if (typeof value === 'string') {
      const parsed =
        Date.parse(value);

      return Number.isNaN(parsed)
        ? 0
        : parsed;
    }

    if (
      typeof value === 'object' &&
      value !== null
    ) {
      const timestamp =
        value as {
          toMillis?: () => number;
          seconds?: number;
          nanoseconds?: number;
        };

      if (
        typeof timestamp.toMillis ===
        'function'
      ) {
        return timestamp.toMillis();
      }

      if (
        typeof timestamp.seconds ===
        'number'
      ) {
        return (
          timestamp.seconds * 1000
        );
      }
    }

    return 0;
  }

  // =========================================================
  // STATUS BADGE
  // =========================================================

  statusBadgeClass(
    status: string
  ): string {
    switch (status) {
      case 'Open':
        return 'bg-danger';

      case 'Assigned':
        return 'bg-primary';

      case 'In Progress':
        return 'bg-warning text-dark';

      case 'Resolved':
        return 'bg-success';

      case 'Closed':
        return 'bg-secondary';

      default:
        return 'bg-secondary';
    }
  }
}

