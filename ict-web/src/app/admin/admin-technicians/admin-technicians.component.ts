import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';

import { TechnicianService } from '../../services/technician.service';
import { Technician } from '../../models/technician.model';

@Component({
  selector: 'app-admin-technicians',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-technicians.component.html',
  styleUrl: './admin-technicians.component.scss',
})
export class AdminTechniciansComponent {
  private readonly technicianService = inject(TechnicianService);
  private readonly fb = inject(FormBuilder);

  readonly technicians$: Observable<Technician[]> =
    this.technicianService.technicians$;

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    department: [''],
  });

  isSaving = false;
  errorMessage = '';

  // =========================================================
  // ADD
  // =========================================================

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    try {
      await this.technicianService.create(this.form.getRawValue());
      this.form.reset();
    } catch (error) {
      console.error('Failed to add technician:', error);
      this.errorMessage = 'Unable to add this technician.';
    } finally {
      this.isSaving = false;
    }
  }

  // =========================================================
  // REMOVE
  // =========================================================

  async remove(technician: Technician): Promise<void> {
    const confirmed = confirm(
      `Remove ${technician.name} from the technician list? Issues already assigned to them keep their name, but you won't be able to re-select them.`
    );

    if (!confirmed) {
      return;
    }

    try {
      await this.technicianService.delete(technician.id);
    } catch (error) {
      console.error('Failed to remove technician:', error);
      this.errorMessage = 'Unable to remove this technician.';
    }
  }
}
