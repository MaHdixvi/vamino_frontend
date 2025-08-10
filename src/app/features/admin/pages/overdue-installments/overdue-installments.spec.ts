import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverdueInstallments } from './overdue-installments';

describe('OverdueInstallments', () => {
  let component: OverdueInstallments;
  let fixture: ComponentFixture<OverdueInstallments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverdueInstallments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverdueInstallments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
