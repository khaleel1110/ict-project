import { Component, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NgbDropdown, NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
} from '@ng-bootstrap/ng-bootstrap';

import {
  Auth,
  getIdToken,
  User,
  user,
} from '@angular/fire/auth';

import {Router, RouterLink} from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'yex-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    RouterLink,
    NgbDropdownItem,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnDestroy {

  private readonly router = inject(Router);
  private readonly auth = inject(Auth);

  user$ = user(this.auth);

  userSubscription?: Subscription;

  userX: User | null = null;

  constructor() {

    this.userSubscription = this.user$.subscribe(
      async (aUser: User | null) => {

        this.userX = aUser;

        if (aUser) {

          localStorage.setItem(
            'currentUserId',
            aUser.uid
          );

          try {

            const idToken = await getIdToken(
              aUser,
              true
            );

            localStorage.setItem(
              'currentFirebaseUserIdToken',
              idToken
            );

          } catch (error) {

            console.error(
              'Unable to refresh Firebase ID token:',
              error
            );

          }

        }

      }
    );
  }


  /**
   * Log the administrator out and
   * return to the admin login page.
   */
  async logOut(): Promise<void> {

    try {

      await this.auth.signOut();

      // Remove locally stored authentication data.
      localStorage.removeItem('currentUserId');
      localStorage.removeItem(
        'currentFirebaseUserIdToken'
      );

      // Return to admin login.
      await this.router.navigate(
        ['/admin/login'],
        {
          replaceUrl: true,
        }
      );

    } catch (error) {

      console.error(
        'Logout failed:',
        error
      );

    }

  }


  ngOnDestroy(): void {

    this.userSubscription?.unsubscribe();

  }

}

