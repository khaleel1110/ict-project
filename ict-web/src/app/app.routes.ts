import { Routes } from '@angular/router';
import { ReportIssueComponent } from './report-issue/report-issue.component';
import { TrackStatusComponent } from './track-status/track-status.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { IssueListComponent } from './admin/issue-list/issue-list.component';

import { AdminTechniciansComponent } from './admin/admin-technicians/admin-technicians.component';
import { adminGuard } from './guards/admin.guard';
import { HomeComponent } from './home/home.component';
import {AdminIssuesComponent} from './admin/admin-issues/admin-issues.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'report-issue', component: ReportIssueComponent },
  { path: 'track', component: TrackStatusComponent },
  { path: 'admin/login', component: AdminLoginComponent },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    canActivateChild: [adminGuard],
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'issues', component: IssueListComponent },
      { path: 'issues/new', component: AdminIssuesComponent },
      { path: 'issues/:id/edit', component: AdminIssuesComponent },
      { path: 'technicians', component: AdminTechniciansComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '' },
];
