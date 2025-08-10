import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanApproval } from './loan-approval';

describe('LoanApproval', () => {
  let component: LoanApproval;
  let fixture: ComponentFixture<LoanApproval>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanApproval]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanApproval);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
