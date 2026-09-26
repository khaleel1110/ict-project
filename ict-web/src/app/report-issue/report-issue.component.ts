
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {RouterLink, RouterLinkActive} from '@angular/router';

import { IssueService } from '../services/issue.service';
import { Issue } from '../models/issue.model';

@Component({
  selector: 'app-report-issue',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    RouterLinkActive,
  ],

  templateUrl:
    './report-issue.component.html',
})
export class ReportIssueComponent {

  // =========================================================
  // FORM
  // =========================================================

  issueForm: FormGroup;

  // =========================================================
  // STATE
  // =========================================================

  isSubmitting = false;

  submittedIssue: Issue | null = null;

  submitError = '';

  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
    private readonly fb: FormBuilder,
    private readonly issueService: IssueService
  ) {

    this.issueForm =
      this.fb.group({

        // -----------------------------------------------------
        // FIRST NAME
        // -----------------------------------------------------

        firstName: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
          ],
        ],

        // -----------------------------------------------------
        // LAST NAME
        // -----------------------------------------------------

        lastName: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
          ],
        ],

        // -----------------------------------------------------
        // EMAIL
        // -----------------------------------------------------

        email: [
          '',
          [
            Validators.required,
            Validators.email,
          ],
        ],

        // -----------------------------------------------------
        // PHONE
        // -----------------------------------------------------

        phone: [
          '',
          [
            Validators.pattern(
              /^(\+234|0)[789][01]\d{8}$/
            ),
          ],
        ],

        // -----------------------------------------------------
        // DEPARTMENT
        // -----------------------------------------------------

        department: [''],

        // -----------------------------------------------------
        // CATEGORY
        // -----------------------------------------------------

        category: [
          '',
          Validators.required,
        ],

        // -----------------------------------------------------
        // PRIORITY
        // -----------------------------------------------------

        priority: [
          'Medium',
          Validators.required,
        ],

        // -----------------------------------------------------
        // DESCRIPTION
        // -----------------------------------------------------

        description: [
          '',
          [
            Validators.required,
            Validators.minLength(10),
          ],
        ],
      });
  }

  // =========================================================
  // SUBMIT ISSUE
  // =========================================================

  async handleSubmit(): Promise<void> {

    // -------------------------------------------------------
    // VALIDATE FORM
    // -------------------------------------------------------

    if (this.issueForm.invalid) {

      this.issueForm.markAllAsTouched();

      return;
    }

    // -------------------------------------------------------
    // START SUBMISSION
    // -------------------------------------------------------

    this.isSubmitting = true;

    this.submitError = '';

    const value =
      this.issueForm.getRawValue();

    try {

      // -----------------------------------------------------
      // CREATE ISSUE
      // -----------------------------------------------------

      const issue =
        await this.issueService.create({

          fullName:
            `${value.firstName} ${value.lastName}`
              .trim(),

          email:
            String(value.email)
              .trim()
              .toLowerCase(),

          phone:
            value.phone?.trim() ?? '',

          department:
            value.department?.trim() ?? '',

          category:
            value.category,

          priority:
            value.priority,

          description:
            value.description?.trim() ?? '',
        });

      // -----------------------------------------------------
      // SAVE CREATED ISSUE
      // -----------------------------------------------------

      this.submittedIssue = issue;

      // -----------------------------------------------------
      // RESET FORM
      // -----------------------------------------------------

      this.issueForm.reset({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        department: '',
        category: '',
        priority: 'Medium',
        description: '',
      });

      // -----------------------------------------------------
      // LOG SUCCESS
      // -----------------------------------------------------

      console.log(
        'Report submitted successfully:',
        issue
      );

    } catch (error) {

      // -----------------------------------------------------
      // HANDLE ERROR
      // -----------------------------------------------------

      console.error(
        'Failed to submit issue:',
        error
      );

      this.submitError =
        'Something went wrong while submitting your complaint. Please try again.';

    } finally {

      // -----------------------------------------------------
      // STOP LOADING
      // -----------------------------------------------------

      this.isSubmitting = false;
    }
  }

  // =========================================================
  // REPORT ANOTHER ISSUE
  // =========================================================

  reportAnother(): void {

    this.submittedIssue = null;

    this.submitError = '';

    this.issueForm.reset({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      department: '',
      category: '',
      priority: 'Medium',
      description: '',
    });

    // Remove validation states
    this.issueForm.markAsPristine();
    this.issueForm.markAsUntouched();
  }
}

