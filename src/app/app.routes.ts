// app.routes.ts
import { Routes } from '@angular/router';


// Guards
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { LoginComponent, RegisterComponent } from './features/auth/components';
import { DashboardPage } from './features/dashboard/pages';
import { LoanDetailsPage, LoanListPage } from './features/loans/pages';
import { NotificationPage } from './features/notifications/pages';
import { EditProfilePage, ProfilePage } from './features/profile/pages';

export const routes: Routes = [
  // Public Routes
  {
    path: 'auth/login',
    component: LoginComponent,
  },
  {
    path: 'auth/register',
    component: RegisterComponent,
  },

  // Protected Routes (require authentication)
  {
    path: '',
    component: DashboardPage,
    canActivate: [authGuard],
  },
  {
    path: 'loans',
    component: LoanListPage,
    canActivate: [authGuard],
  },
  {
    path: 'loans/:id',
    component: LoanDetailsPage,
    canActivate: [authGuard],
  },
  {
    path: 'notifications',
    component: NotificationPage,
    canActivate: [authGuard],
  },
  {
    path: 'profile',
    component: ProfilePage,
    canActivate: [authGuard],
  },
  {
    path: 'profile/edit',
    component: EditProfilePage,
    canActivate: [authGuard],
  },

  // Fallback Route
  {
    path: '**',
    redirectTo: '',
  },
];
