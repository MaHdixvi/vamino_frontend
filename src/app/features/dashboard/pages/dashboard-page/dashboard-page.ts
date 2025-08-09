import { Component } from '@angular/core';
import { DashboardHeaderComponent, DashboardWidgets } from "../../components";

@Component({
  selector: 'app-dashboard-page',
  imports: [DashboardHeaderComponent, DashboardWidgets],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css'
})
export class DashboardPage {

}
