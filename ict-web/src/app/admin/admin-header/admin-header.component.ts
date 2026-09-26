import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { User } from '@angular/fire/auth';
import { Observable } from 'rxjs';

import {
  NgbDropdown,
  NgbDropdownAnchor,
  NgbDropdownMenu,
  NgbDropdownItem,
} from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '../../services/auth.service';
import {UserProfileComponent} from '../user-profile/user-profile.component';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NgbDropdown,
    NgbDropdownAnchor,
    NgbDropdownMenu,
    NgbDropdownItem,
    UserProfileComponent,
  ],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.scss',
})
export class AdminHeaderComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly user$: Observable<User | null> = this.auth.user$;

  async logout(): Promise<void> {
    await this.auth.logout();
    await this.router.navigate(['/admin/login']);
  }
}
