// features/dashboard/components/dashboard-header/dashboard-header.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { DashboardHeaderComponent } from './dashboard-header';
import { AuthService } from '../../../../core/services';

describe('DashboardHeaderComponent', () => {
  let component: DashboardHeaderComponent;
  let fixture: ComponentFixture<DashboardHeaderComponent>;
  let mockAuthService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockAuthService = {
      logout: jest.fn().mockReturnValue(of({})),
    };
    mockRouter = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [DashboardHeaderComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardHeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct title', () => {
    const compiled = fixture.nativeElement;
    const titleElement = compiled.querySelector('.header-left h1');
    expect(titleElement.textContent).toContain('Dashboard');
  });

  it('should call logout method when logout button is clicked', () => {
    spyOn(component, 'logout');
    const compiled = fixture.nativeElement;
    const logoutButton = compiled.querySelector('.logout-button');

    logoutButton.click();
    expect(component.logout).toHaveBeenCalled();
  });

  it('should call authService.logout and navigate on logout', () => {
    component.logout();
    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
  });
});
