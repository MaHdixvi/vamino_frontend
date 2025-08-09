// features/auth/components/pages/forgot-password-page/forgot-password-page.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ForgotPasswordPage } from './forgot-password-page';
import { AuthService } from '../../services';

describe('ForgotPasswordPageComponent', () => {
  let component: ForgotPasswordPage;
  let fixture: ComponentFixture<ForgotPasswordPage>;
  let mockAuthService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockAuthService = {
      sendPasswordResetEmail: jest.fn(),
    };
    mockRouter = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [ForgotPasswordPage],
      imports: [FormsModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.sendPasswordResetEmail and show success message on successful request', () => {
    mockAuthService.sendPasswordResetEmail.mockReturnValue(of({}));
    component.email = 'test@example.com';
    component.sendResetLink();

    expect(mockAuthService.sendPasswordResetEmail).toHaveBeenCalledWith(
      'test@example.com'
    );
    expect(component.successMessage).toBe(
      'A password reset link has been sent to your email.'
    );
    expect(component.errorMessage).toBe('');
  });

  it('should set an error message if sending the reset link fails', () => {
    mockAuthService.sendPasswordResetEmail.mockReturnValue(
      throwError('Failed to send reset link')
    );
    component.email = 'test@example.com';

    component.sendResetLink();

    expect(component.errorMessage).toBe(
      'Failed to send reset link. Please try again.'
    );
    expect(component.successMessage).toBe('');
  });

  it('should set an error message if email is not provided', () => {
    component.sendResetLink();

    expect(component.errorMessage).toBe('Please enter your email address.');
    expect(component.successMessage).toBe('');
  });
});
