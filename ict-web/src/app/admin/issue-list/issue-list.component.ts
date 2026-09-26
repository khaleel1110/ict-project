import {
  Component,
  OnDestroy,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { IssueService } from '../../services/issue.service';


import {
  Issue,
  IssueStatus,
} from '../../models/issue.model';
import {TechnicianService} from '../../services/technician.service';
import {Technician} from '../../models/technician.model';



@Component({
  selector: 'app-issue-list',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
  ],

  templateUrl:
    './issue-list.component.html',
})
export class IssueListComponent
  implements OnDestroy {

  issues: Issue[] = [];

  technicians: Technician[] = [];

  statusFilter = 'All';

  categoryFilter = 'All';

  searchTerm = '';

  selectedIssue: Issue | null = null;

  selectedTechnicianId = '';

  isLoading = true;

  errorMessage = '';

  private readonly subscriptions =
    new Subscription();

  constructor(
    private readonly issueService: IssueService,
    private readonly technicianService: TechnicianService,
    private readonly router: Router
  ) {

    // -------------------------------------------------------
    // ISSUES
    // -------------------------------------------------------

    this.subscriptions.add(

      this.issueService.issues$
        .subscribe({
          next: (list) => {

            this.issues = list;

            this.isLoading = false;
          },

          error: (error) => {

            console.error(
              'Error loading issues:',
              error
            );

            this.isLoading = false;

            this.errorMessage =
              'Unable to load reported issues.';
          },
        })
    );

    // -------------------------------------------------------
    // LOADING
    // -------------------------------------------------------



    // -------------------------------------------------------
    // ERROR
    // -------------------------------------------------------



    // -------------------------------------------------------
    // TECHNICIANS
    // -------------------------------------------------------

    this.subscriptions.add(

      this.technicianService.technicians$
        .subscribe(
          (list) => {
            this.technicians = list;
          }
        )
    );
  }

  // =========================================================
  // FILTER
  // =========================================================

  get filteredIssues(): Issue[] {

    const term =
      this.searchTerm
        .trim()
        .toLowerCase();

    return this.issues.filter(
      (issue) => {

        const statusMatch =
          this.statusFilter === 'All' ||
          issue.status === this.statusFilter;

        const categoryMatch =
          this.categoryFilter === 'All' ||
          issue.category === this.categoryFilter;

        const searchMatch =
          !term ||
          issue.ticketId
            .toLowerCase()
            .includes(term) ||

          issue.fullName
            .toLowerCase()
            .includes(term) ||

          issue.email
            .toLowerCase()
            .includes(term);

        return (
          statusMatch &&
          categoryMatch &&
          searchMatch
        );
      }
    );
  }

  // =========================================================
  // COUNTS
  // =========================================================

  get counts() {

    return {

      total:
      this.issues.length,

      open:
      this.issues.filter(
        (issue) =>
          issue.status === 'Open'
      ).length,

      inProgress:
      this.issues.filter(
        (issue) =>
          issue.status === 'In Progress'
      ).length,

      resolved:
      this.issues.filter(
        (issue) =>
          issue.status === 'Resolved'
      ).length,
    };
  }

  // =========================================================
  // VIEW
  // =========================================================

  viewIssue(
    issue: Issue
  ): void {

    this.selectedIssue = issue;

    const matchedTechnician =
      this.technicians.find(
        (tech) =>
          tech.email === issue.assignedTechnicianEmail
      );

    this.selectedTechnicianId =
      matchedTechnician?.id ?? '';
  }

  closeView(): void {

    this.selectedIssue = null;

    this.selectedTechnicianId = '';
  }

  // =========================================================
  // ASSIGN TECHNICIAN
  // =========================================================

  async assignTechnician(
    issue: Issue
  ): Promise<void> {

    const technician =
      this.technicians.find(
        (tech) =>
          tech.id === this.selectedTechnicianId
      );

    if (!technician) {
      return;
    }

    try {

      await this.issueService.update(
        issue.id,
        {
          assignedTechnician: technician.name,
          assignedTechnicianEmail: technician.email,
        }
      );

      if (this.selectedIssue?.id === issue.id) {

        this.selectedIssue = {
          ...this.selectedIssue,
          assignedTechnician: technician.name,
          assignedTechnicianEmail: technician.email,
        };
      }

    } catch (error) {

      console.error(
        'Failed to assign technician:',
        error
      );

      this.errorMessage =
        'Unable to assign this issue to a technician.';
    }
  }

  // =========================================================
  // MESSAGE LINK (mailto)
  // =========================================================

  messageLink(
    issue: Issue
  ): string {

    if (!issue.assignedTechnicianEmail) {
      return '';
    }

    const subject =
      encodeURIComponent(
        `ICT issue ${issue.ticketId}: ${issue.category}`
      );

    const body =
      encodeURIComponent(
        `Hi ${issue.assignedTechnician ?? ''},\n\n` +
        `Please look into the following issue:\n\n` +
        `Ticket: ${issue.ticketId}\n` +
        `Reporter: ${issue.fullName} (${issue.email})\n` +
        `Priority: ${issue.priority}\n` +
        `Status: ${issue.status}\n` +
        `Description: ${issue.description}\n\n` +
        `Thanks.`
      );

    return `mailto:${issue.assignedTechnicianEmail}?subject=${subject}&body=${body}`;
  }

  // =========================================================
  // ADD
  // =========================================================

  addIssue(): void {

    this.router.navigate([
      '/admin/issues/new',
    ]);
  }

  // =========================================================
  // EDIT
  // =========================================================

  editIssue(
    id: string
  ): void {

    this.router.navigate([
      '/admin/issues',
      id,
      'edit',
    ]);
  }

  // =========================================================
  // DELETE
  // =========================================================

  async deleteIssue(
    id: string
  ): Promise<void> {

    const confirmed =
      confirm(
        'Delete this issue permanently? This cannot be undone.'
      );

    if (!confirmed) {
      return;
    }

    try {

      await this.issueService.delete(id);

      if (
        this.selectedIssue?.id === id
      ) {

        this.selectedIssue = null;
      }

    } catch (error) {

      console.error(
        'Failed to delete issue:',
        error
      );

      this.errorMessage =
        'Unable to delete this issue.';
    }
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
  // DESTROY
  // =========================================================

  ngOnDestroy(): void {

    this.subscriptions.unsubscribe();
  }
}
