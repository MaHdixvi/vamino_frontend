// app.routes.ts
import { Routes } from '@angular/router';


// Guards
import { authGuard } from './core/guards/auth.guard';
// import { roleGuard } from './core/guards/role.guard';
import { LoginComponent, RegisterComponent } from './features/auth/components';
import { DashboardPageComponent } from './features/dashboard/pages';
import { LoanDetailsPage, LoanFormPage, LoanListPage } from './features/loans/pages';
import { NotificationPage } from './features/notifications/pages';
import { EditProfilePage, ProfilePage } from './features/profile/pages';
import { ForgotPasswordPage } from './features/auth/pages';
import { ProfileEditComponent } from './features/profile/components';

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
  {
    path: 'auth/forgot-password',
    component: ForgotPasswordPage,
  },

  // Protected Routes (require authentication)
  {
    path: '',
    component: DashboardPageComponent,
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
    path: 'loan/add',
    component: LoanFormPage,
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
{ path: 'profile/edit', component: ProfileEditComponent }
,
  // Fallback Route
  {
    path: '**',
    redirectTo: '',
  },
];
