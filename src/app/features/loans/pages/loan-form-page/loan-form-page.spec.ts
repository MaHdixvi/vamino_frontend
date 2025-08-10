import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanFormPage } from './loan-form-page';

describe('LoanFormPage', () => {
  let component: LoanFormPage;
  let fixture: ComponentFixture<LoanFormPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanFormPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
