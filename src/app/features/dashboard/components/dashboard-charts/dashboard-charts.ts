// dashboard-charts.component.ts
import { Component } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-dashboard-charts',
  templateUrl: './dashboard-charts.html',
  imports: [BaseChartDirective],
  styleUrls: ['./dashboard-charts.css'],
})
export class DashboardCharts {
  // Example data for a bar chart
  barChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Sales',
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: '#007bff',
        borderColor: '#007bff',
        borderWidth: 1,
      },
    ],
  };

  // Example options for the bar chart
  barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Example data for a pie chart
  pieChartData = {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ['#dc3545', '#007bff', '#ffc107'],
        hoverBackgroundColor: ['#c82333', '#0056b3', '#e0a800'],
      },
    ],
  };

  // Example options for the pie chart
  pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };
}
