import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailsPage } from './ticket-details-page';

describe('TicketDetailsPage', () => {
  let component: TicketDetailsPage;
  let fixture: ComponentFixture<TicketDetailsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketDetailsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
