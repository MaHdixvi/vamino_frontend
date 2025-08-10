import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallmentTable } from './installment-table';

describe('InstallmentTable', () => {
  let component: InstallmentTable;
  let fixture: ComponentFixture<InstallmentTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstallmentTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstallmentTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
