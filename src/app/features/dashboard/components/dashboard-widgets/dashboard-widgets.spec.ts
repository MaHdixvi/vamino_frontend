import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardWidgets } from './dashboard-widgets';

describe('DashboardWidgets', () => {
  let component: DashboardWidgets;
  let fixture: ComponentFixture<DashboardWidgets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardWidgets]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardWidgets);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
