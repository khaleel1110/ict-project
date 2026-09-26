import {
  Component,
  inject,
} from '@angular/core';

import {
  CommonModule,
} from '@angular/common';

import {
  RouterLink,
} from '@angular/router';

import {
  Observable,
  map,
} from 'rxjs';

import {
  IssueService,
} from '../../services/issue.service';

import {
  Issue,
  IssueCategory,
  IssuePriority,
  IssueStatus,
} from '../../models/issue.model';

@Component({
  selector: 'app-admin-dashboard',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
  ],

  templateUrl:
    './admin-dashboard.component.html',

  styleUrl:
    './admin-dashboard.component.scss',
})
export class AdminDashboardComponent {
  private readonly issueService =
    inject(IssueService);

  // =========================================================
  // FILTER OPTIONS
  // =========================================================

  readonly categories: IssueCategory[] = [
    'hardware',
    'software',
    'network',
    'account',
    'other',
  ];

  readonly priorities: IssuePriority[] = [
    'Critical',
    'High',
    'Medium',
    'Low',
  ];

  // =========================================================
  // ALL ISSUES
  // =========================================================

  readonly issues$: Observable<Issue[]> =
    this.issueService.issues$;

  // =========================================================
  // RECENT ISSUES
  // =========================================================

  readonly recentIssues$: Observable<Issue[]> =
    this.issues$.pipe(
      map((issues) => {
        return [...issues]
          .sort((a, b) => {
            const dateA =
              this.getIssueDate(a);

            const dateB =
              this.getIssueDate(b);

            return dateB - dateA;
          })
          .slice(0, 6);
      })
    );

  // =========================================================
  // STATUS COUNT
  // =========================================================

  statusCount(
    issues: Issue[],
    status: IssueStatus
  ): number {
    return issues.filter(
      (issue) =>
        issue.status === status
    ).length;
  }

  // =========================================================
  // CATEGORY COUNT
  // =========================================================

  categoryCount(
    issues: Issue[],
    category: IssueCategory
  ): number {
    return issues.filter(
      (issue) =>
        issue.category === category
    ).length;
  }

  // =========================================================
  // PRIORITY COUNT
  // =========================================================

  priorityCount(
    issues: Issue[],
    priority: IssuePriority
  ): number {
    return issues.filter(
      (issue) =>
        issue.priority === priority
    ).length;
  }

  // =========================================================
  // PERCENTAGE
  // =========================================================

  percentage(
    count: number,
    total: number
  ): number {
    return total === 0
      ? 0
      : Math.round(
        (count / total) * 100
      );
  }

  // =========================================================
  // STATUS BADGE
  // =========================================================

  statusBadgeClass(
    status: IssueStatus
  ): string {
    switch (status) {
      case 'Open':
        return 'bg-danger';

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

  // =========================================================
  // PRIORITY BADGE
  // =========================================================

  priorityBadgeClass(
    priority: IssuePriority
  ): string {
    switch (priority) {
      case 'Critical':
        return 'bg-danger';

      case 'High':
        return 'bg-warning text-dark';

      case 'Medium':
        return 'bg-info text-dark';

      case 'Low':
        return 'bg-secondary';

      default:
        return 'bg-secondary';
    }
  }

  // =========================================================
  // DATE HELPER
  // =========================================================

  private getIssueDate(
    issue: Issue
  ): number {
    const value =
      issue.dateReported;

    if (!value) {
      return 0;
    }

    if (
      typeof value === 'object' &&
      value !== null &&
      'toDate' in value
    ) {
      return (
        value as {
          toDate: () => Date;
        }
      )
        .toDate()
        .getTime();
    }

    if (value instanceof Date) {
      return value.getTime();
    }

    if (
      typeof value === 'string' ||
      typeof value === 'number'
    ) {
      return new Date(value).getTime();
    }

    return 0;
  }
}
