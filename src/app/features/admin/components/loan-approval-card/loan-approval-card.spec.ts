import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanApprovalCard } from './loan-approval-card';

describe('LoanApprovalCard', () => {
  let component: LoanApprovalCard;
  let fixture: ComponentFixture<LoanApprovalCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanApprovalCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanApprovalCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
