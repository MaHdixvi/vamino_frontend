// auth/components/register/register.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { RegisterComponent } from './register';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockAuthService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockAuthService = {
      register: jest.fn(),
    };
    mockRouter = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [FormsModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.register and navigate on successful registration', () => {
    mockAuthService.register.mockReturnValue(of({}));
    component.username = 'testUser';
    component.email = 'test@example.com';
    component.password = 'password123';
    component.confirmPassword = 'password123';

    component.register();

    expect(mockAuthService.register).toHaveBeenCalledWith(
      'testUser',
      'test@example.com',
      'password123'
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('should set an error message if passwords do not match', () => {
    component.password = 'password123';
    component.confirmPassword = 'differentPassword';

    component.register();

    expect(component.errorMessage).toBe('Passwords do not match');
  });

  it('should set an error message if registration fails', () => {
    mockAuthService.register.mockReturnValue(throwError('Registration failed'));
    component.username = 'testUser';
    component.email = 'test@example.com';
    component.password = 'password123';
    component.confirmPassword = 'password123';

    component.register();

    expect(component.errorMessage).toBe(
      'Registration failed. Please try again.'
    );
  });
});
