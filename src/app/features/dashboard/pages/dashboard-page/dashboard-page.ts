import { Component } from '@angular/core';
import { DashboardHeaderComponent, DashboardWidgets, DashboardChartsComponent } from "../../components";

@Component({
  selector: 'app-dashboard-page',
  imports: [DashboardHeaderComponent, DashboardWidgets, DashboardChartsComponent],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css'
})
export class DashboardPage {

}
