// dashboard-widgets.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-widgets',
  templateUrl: './dashboard-widgets.html',
  imports:[CommonModule],
  styleUrls: ['./dashboard-widgets.css'],
})
export class DashboardWidgets {
  // داده‌های ساختگی برای ویجت‌ها
  widgets = [
    {
      title: 'Total Sales',
      value: '$50,000',
      trend: 'positive',
      trendValue: '▲ 10%',
      description: 'Increase from last month',
    },
    {
      title: 'New Users',
      value: '250',
      trend: 'positive',
      trendValue: '▲ 5%',
      description: 'More than last month',
    },
    {
      title: 'User Feedback',
      value: '4.7/5',
      trend: 'neutral',
      trendValue: '▶ 0%',
      description: 'No change this month',
    },
    {
      title: 'Open Tasks',
      value: '15',
      trend: 'negative',
      trendValue: '▼ 8%',
      description: 'Decrease from last week',
    },
  ];
}
