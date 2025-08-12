import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDetailsComponent } from './loan-details';

describe('LoanDetails', () => {
  let component: LoanDetailsComponent;
  let fixture: ComponentFixture<LoanDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
