import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-dashboard-widgets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-widgets.html',
  styleUrls: ['./dashboard-widgets.css'],
})
export class DashboardWidgets {
  widgets = [
    {
      title: 'Total Sales',
      value: '$50,000',
      trend: 'positive',
      trendValue: '10%',
      description: 'Increase from last month',
    },
    {
      title: 'New Users',
      value: '250',
      trend: 'positive',
      trendValue: '5%',
      description: 'More than last month',
    },
    {
      title: 'User Feedback',
      value: '4.7/5',
      trend: 'neutral',
      trendValue: '0%',
      description: 'No change this month',
    },
    {
      title: 'Open Tasks',
      value: '15',
      trend: 'negative',
      trendValue: '8%',
      description: 'Decrease from last week',
    },
  ];
}
