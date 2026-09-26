import {
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';

import {
  CommonModule,
  DatePipe,
} from '@angular/common';

import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { Subscription } from 'rxjs';

import {
  Issue,
  IssueActivity,
  IssueStatus,
} from '../../models/issue.model';

import {
  Technician,
} from '../../models/technician.model';

import {
  IssueService,
} from '../../services/issue.service';

import {
  TechnicianService,
} from '../../services/technician.service';
@Component({
  selector: 'app-admin-issues',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],

  templateUrl:
    './admin-issues.component.html',
  styleUrl:
    './admin-issues.component.scss',
})
export class AdminIssuesComponent
  implements OnInit, OnDestroy {

  // =========================================================
  // SERVICES
  // =========================================================

  private readonly fb =
    inject(FormBuilder);

  private readonly issueService =
    inject(IssueService);

  private readonly technicianService =
    inject(TechnicianService);

  // =========================================================
  // DATA
  // =========================================================

  issues: Issue[] = [];

  technicians: Technician[] = [];

  // =========================================================
  // MODAL
  // =========================================================

  selectedIssue: Issue | null = null;

  showIssueModal = false;

  isEditMode = false;

  editingIssueId: string | null = null;

  // =========================================================
  // LOADING
  // =========================================================

  isSaving = false;

  isAssigning = false;

  isAddingReport = false;

  isDeleting = false;

  // =========================================================
  // FILTERS
  // =========================================================

  searchTerm = '';

  statusFilter:
    | IssueStatus
    | 'All' = 'All';

  categoryFilter:
    | string
    | 'All' = 'All';

  // =========================================================
  // ASSIGNMENT
  // =========================================================

  selectedTechnicianId = '';

  // =========================================================
  // REPORT
  // =========================================================

  newReportMessage = '';

  // =========================================================
  // FORM
  // =========================================================

  form: FormGroup;

  // =========================================================
  // MESSAGES
  // =========================================================

  errorMessage = '';

  successMessage = '';

  // =========================================================
  // SUBSCRIPTIONS
  // =========================================================

  private issueSubscription?: Subscription;

  private technicianSubscription?: Subscription;

  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor() {
    this.form =
      this.fb.group({

        fullName: [
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

        phone: [
          '',
        ],

        department: [
          '',
        ],

        category: [
          'hardware',
          Validators.required,
        ],

        priority: [
          'Medium',
          Validators.required,
        ],

        status: [
          'Open',
          Validators.required,
        ],

        description: [
          '',
          Validators.required,
        ],

        adminNotes: [
          '',
        ],
      });
  }

  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {
    this.loadIssues();
    this.loadTechnicians();
  }

  // =========================================================
  // DESTROY
  // =========================================================

  ngOnDestroy(): void {
    this.issueSubscription?.unsubscribe();
    this.technicianSubscription?.unsubscribe();
  }

  // =========================================================
  // LOAD ISSUES
  // =========================================================

  private loadIssues(): void {
    this.issueSubscription =
      this.issueService
        .issues$
        .subscribe({

          next: (issues) => {

            this.issues =
              [...issues].sort(
                (a, b) =>
                  this.toMillis(
                    b.dateReported
                  ) -
                  this.toMillis(
                    a.dateReported
                  )
              );

            if (
              this.selectedIssue?.id
            ) {

              const updated =
                this.issues.find(
                  issue =>
                    issue.id ===
                    this.selectedIssue?.id
                );

              if (updated) {
                this.selectedIssue =
                  updated;
              }
            }
          },

          error: (error) => {

            console.error(
              'Failed to load issues:',
              error
            );

            this.errorMessage =
              'Unable to load issues. Please try again.';
          },
        });
  }

  // =========================================================
  // LOAD TECHNICIANS
  // =========================================================

  private loadTechnicians(): void {

    this.technicianSubscription =
      this.technicianService
        .technicians$
        .subscribe({

          next: (technicians) => {

            this.technicians =
              technicians.filter(
                technician =>
                  technician.active !== false
              );
          },

          error: (error) => {

            console.error(
              'Failed to load technicians:',
              error
            );
          },
        });
  }

  // =========================================================
  // FILTER
  // =========================================================

  get filteredIssues(): Issue[] {

    const search =
      this.searchTerm
        .trim()
        .toLowerCase();

    return this.issues.filter(
      issue => {

        const matchesSearch =
          !search ||

          issue.ticketId
            ?.toLowerCase()
            .includes(search) ||

          issue.fullName
            ?.toLowerCase()
            .includes(search) ||

          issue.email
            ?.toLowerCase()
            .includes(search) ||

          issue.description
            ?.toLowerCase()
            .includes(search);

        const matchesStatus =
          this.statusFilter === 'All' ||
          issue.status ===
          this.statusFilter;

        const matchesCategory =
          this.categoryFilter === 'All' ||
          issue.category ===
          this.categoryFilter;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesCategory
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
        issue =>
          issue.status === 'Open'
      ).length,

      assigned:
      this.issues.filter(
        issue =>
          issue.status === 'Assigned'
      ).length,

      inProgress:
      this.issues.filter(
        issue =>
          issue.status === 'In Progress'
      ).length,

      resolved:
      this.issues.filter(
        issue =>
          issue.status === 'Resolved'
      ).length,

      closed:
      this.issues.filter(
        issue =>
          issue.status === 'Closed'
      ).length,

      critical:
      this.issues.filter(
        issue =>
          issue.priority === 'Critical'
      ).length,

      unassigned:
      this.issues.filter(
        issue =>
          !issue.assignedTechnicianId
      ).length,
    };
  }

  // =========================================================
  // CREATE MODAL
  // =========================================================

  openCreateModal(): void {

    this.isEditMode = false;

    this.editingIssueId = null;

    this.errorMessage = '';

    this.successMessage = '';

    this.form.reset({

      fullName: '',

      email: '',

      phone: '',

      department: '',

      category: 'hardware',

      priority: 'Medium',

      status: 'Open',

      description: '',

      adminNotes: '',
    });

    this.showIssueModal = true;
  }

  // =========================================================
  // EDIT MODAL
  // =========================================================

  openEditModal(
    issue: Issue
  ): void {

    if (!issue.id) {
      return;
    }

    this.isEditMode = true;

    this.editingIssueId =
      issue.id;

    this.errorMessage = '';

    this.successMessage = '';

    this.form.patchValue({

      fullName:
      issue.fullName,

      email:
      issue.email,

      phone:
        issue.phone ?? '',

      department:
        issue.department ?? '',

      category:
      issue.category,

      priority:
      issue.priority,

      status:
      issue.status,

      description:
      issue.description,

      adminNotes:
        issue.adminNotes ?? '',
    });

    this.showIssueModal = true;
  }

  // =========================================================
  // CLOSE EDIT MODAL
  // =========================================================

  closeIssueModal(): void {

    if (this.isSaving) {
      return;
    }

    this.showIssueModal = false;
  }

  // =========================================================
  // SAVE ISSUE
  // =========================================================

  async saveIssue(): Promise<void> {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;
    }

    this.isSaving = true;

    this.errorMessage = '';

    try {

      const data =
        this.form.getRawValue();

      if (
        this.isEditMode &&
        this.editingIssueId
      ) {

        await this.issueService.update(
          this.editingIssueId,
          data
        );

        this.successMessage =
          'Issue updated successfully.';

      } else {

        await this.issueService.create(
          data
        );

        this.successMessage =
          'Issue created successfully.';
      }

      this.showIssueModal = false;

    } catch (error) {

      console.error(
        'Failed to save issue:',
        error
      );

      this.errorMessage =
        'Unable to save the issue. Please try again.';

    } finally {

      this.isSaving = false;
    }
  }

  // =========================================================
  // VIEW ISSUE
  // =========================================================

  viewIssue(
    issue: Issue
  ): void {

    this.selectedIssue = issue;

    this.selectedTechnicianId =
      issue.assignedTechnicianId ?? '';

    this.newReportMessage = '';

    this.errorMessage = '';
  }

  // =========================================================
  // CLOSE DETAILS
  // =========================================================

  closeView(): void {

    if (
      this.isAssigning ||
      this.isAddingReport
    ) {
      return;
    }

    this.selectedIssue = null;

    this.selectedTechnicianId = '';

    this.newReportMessage = '';
  }

  // =========================================================
  // ASSIGN TECHNICIAN
  // =========================================================

  async assignTechnician(
    issue: Issue
  ): Promise<void> {

    if (
      !issue.id ||
      !this.selectedTechnicianId
    ) {
      return;
    }

    const technician =
      this.technicians.find(
        tech =>
          tech.id ===
          this.selectedTechnicianId
      );

    if (!technician) {

      this.errorMessage =
        'Selected technician could not be found.';

      return;
    }

    this.isAssigning = true;

    this.errorMessage = '';

    try {

      await this.issueService.update(
        issue.id,
        {

          assignedTechnicianId:
          technician.id,

          assignedTechnician:
          technician.name,

          assignedTechnicianEmail:
          technician.email,

          status:
            'Assigned',
        }
      );

      const activity:
        IssueActivity = {

        id:
          this.generateActivityId(),

        type:
          'assignment',

        message:
          `Ticket assigned to ${technician.name}.`,

        technicianId:
        technician.id,

        technicianName:
        technician.name,

        createdBy:
          'ICT Administrator',

        createdAt:
          new Date(),
      };

      await this.issueService.addReport(
        issue.id,
        activity
      );

      this.selectedTechnicianId =
        technician.id;

    } catch (error) {

      console.error(
        'Failed to assign technician:',
        error
      );

      this.errorMessage =
        'Unable to assign technician. Please try again.';

    } finally {

      this.isAssigning = false;
    }
  }

  // =========================================================
  // CHANGE STATUS
  // =========================================================

  async changeStatus(
    issue: Issue,
    newStatus: IssueStatus
  ): Promise<void> {

    if (
      !issue.id ||
      issue.status === newStatus
    ) {
      return;
    }

    const previousStatus =
      issue.status;

    this.errorMessage = '';

    try {

      await this.issueService.update(
        issue.id,
        {
          status: newStatus,
        }
      );

      const activity:
        IssueActivity = {

        id:
          this.generateActivityId(),

        type:
          'status',

        message:
          `Status changed from ${previousStatus} to ${newStatus}.`,

        createdBy:
          'ICT Administrator',

        createdAt:
          new Date(),
      };

      await this.issueService.addReport(
        issue.id,
        activity
      );

    } catch (error) {

      console.error(
        'Failed to update status:',
        error
      );

      this.errorMessage =
        'Unable to update ticket status.';
    }
  }

  // =========================================================
  // ADD REPORT
  // =========================================================


// =========================================================
// ADD REPORT
// =========================================================

async addReport(
  issue: Issue
): Promise<void> {

  const message =
    this.newReportMessage.trim();

  if (
    !issue.id ||
    !message
  ) {
    return;
  }

  this.isAddingReport = true;

  this.errorMessage = '';

  try {

    // -------------------------------------------------------
    // CREATE BASE ACTIVITY
    // -------------------------------------------------------

    const activity: IssueActivity = {
      id:
        this.generateActivityId(),

      type:
        'report',

      message,

      createdBy:
        'ICT Administrator',

      createdAt:
        new Date(),
    };

    // -------------------------------------------------------
    // ONLY ADD TECHNICIAN DATA WHEN IT EXISTS
    // -------------------------------------------------------

    if (issue.assignedTechnicianId) {

      activity.technicianId =
        issue.assignedTechnicianId;
    }

    if (issue.assignedTechnician) {

      activity.technicianName =
        issue.assignedTechnician;
    }

    // -------------------------------------------------------
    // SAVE REPORT
    // -------------------------------------------------------

    await this.issueService.addReport(
      issue.id,
      activity
    );

    // -------------------------------------------------------
    // CLEAR TEXTAREA
    // -------------------------------------------------------

    this.newReportMessage = '';

    // -------------------------------------------------------
    // SUCCESS MESSAGE
    // -------------------------------------------------------

    this.successMessage =
      'Report added successfully.';

  } catch (error) {

    console.error(
      'Failed to add report:',
      error
    );

    this.errorMessage =
      'Unable to add the report. Please try again.';

  } finally {

    this.isAddingReport = false;
  }
}



  // =========================================================
  // DELETE
  // =========================================================

  async deleteIssue(
    id?: string
  ): Promise<void> {

    if (!id) {
      return;
    }

    const confirmed =
      window.confirm(
        'Are you sure you want to delete this issue? This action cannot be undone.'
      );

    if (!confirmed) {
      return;
    }

    this.isDeleting = true;

    this.errorMessage = '';

    try {

      await this.issueService.delete(
        id
      );

      if (
        this.selectedIssue?.id === id
      ) {

        this.closeView();
      }

    } catch (error) {

      console.error(
        'Failed to delete issue:',
        error
      );

      this.errorMessage =
        'Unable to delete this issue.';

    } finally {

      this.isDeleting = false;
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
        return 'bg-danger-subtle text-danger';

      case 'Assigned':
        return 'bg-primary-subtle text-primary';

      case 'In Progress':
        return 'bg-warning-subtle text-warning-emphasis';

      case 'Resolved':
        return 'bg-success-subtle text-success';

      case 'Closed':
        return 'bg-secondary-subtle text-secondary';

      default:
        return 'bg-light text-dark';
    }
  }

  // =========================================================
  // PRIORITY BADGE
  // =========================================================

  priorityBadgeClass(
    priority: string
  ): string {

    switch (priority) {

      case 'Critical':
        return 'bg-danger text-white';

      case 'High':
        return 'bg-danger-subtle text-danger';

      case 'Medium':
        return 'bg-warning-subtle text-warning-emphasis';

      case 'Low':
        return 'bg-success-subtle text-success';

      default:
        return 'bg-light text-dark';
    }
  }

  // =========================================================
  // ACTIVITY ICON
  // =========================================================

  activityIcon(
    type: string
  ): string {

    switch (type) {

      case 'assignment':
        return 'bi-person-check';

      case 'status':
        return 'bi-arrow-repeat';

      case 'report':
        return 'bi-wrench-adjustable';

      case 'note':
        return 'bi-sticky';

      default:
        return 'bi-clock-history';
    }
  }

  // =========================================================
  // MESSAGE TECHNICIAN
  // =========================================================

  messageLink(
    issue: Issue
  ): string {

    if (
      !issue.assignedTechnicianEmail
    ) {
      return '#';
    }

    const subject =
      encodeURIComponent(
        `ICT Support Ticket ${issue.ticketId}`
      );

    const body =
      encodeURIComponent(
        `Hello ${issue.assignedTechnician || 'Technician'},\n\n` +
        `Regarding ICT support ticket ${issue.ticketId}.\n\n` +
        `Reporter: ${issue.fullName}\n` +
        `Priority: ${issue.priority}\n` +
        `Status: ${issue.status}\n\n` +
        `Issue:\n${issue.description}\n\n` +
        `Thank you.`
      );

    return `mailto:${issue.assignedTechnicianEmail}?subject=${subject}&body=${body}`;
  }

  // =========================================================
  // DATE
  // =========================================================

// =========================================================
// DATE TO MILLISECONDS
// =========================================================

  private toMillis(
    value: unknown
  ): number {

    if (!value) {
      return 0;
    }

    // JavaScript Date
    if (value instanceof Date) {
      return value.getTime();
    }

    // Number timestamp
    if (typeof value === 'number') {
      return value;
    }

    // String date
    if (typeof value === 'string') {
      const parsed = Date.parse(value);

      return Number.isNaN(parsed)
        ? 0
        : parsed;
    }

    // Firestore Timestamp
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
// FORMAT DATE
// =========================================================

  formatDate(
    value: unknown,
    format = 'medium'
  ): string {

    const millis = this.toMillis(value);

    if (!millis) {
      return 'N/A';
    }

    const date = new Date(millis);

    return new Intl.DateTimeFormat(
      'en-NG',
      {
        dateStyle:
          format === 'medium'
            ? 'medium'
            : 'short',

        timeStyle:
          format === 'medium'
            ? 'short'
            : undefined,
      }
    ).format(date);
  }

  formatFirestoreDate(
    value: unknown
  ): Date | null {

    const millis = this.toMillis(value);

    return millis
      ? new Date(millis)
      : null;
  }


  // =========================================================
  // ACTIVITY ID
  // =========================================================

  private generateActivityId(): string {

    return `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 10)}`;
  }
}
