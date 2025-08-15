import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Chart, ChartConfiguration, registerables, TooltipItem } from 'chart.js';
import { CommonModule, DatePipe } from '@angular/common';
import gsap from 'gsap';
import { InstallmentDto } from 'app/core/models/installment.model';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-charts',
  templateUrl: './dashboard-charts.html',
  imports: [CommonModule],
  styleUrls: ['./dashboard-charts.css'],
  providers: [DatePipe],
})
export class DashboardChartsComponent implements AfterViewInit, OnChanges {
  @ViewChild('monthlyBarChart') monthlyBarChart?: ElementRef<HTMLCanvasElement>;
  @ViewChild('statusPieChart') statusPieChart?: ElementRef<HTMLCanvasElement>;
  @Input() installments: InstallmentDto[] = [];

  monthlyChart?: Chart;
  statusChart?: Chart;
  loading = true;
  noDataMessage = false;
  private initialized = false;

  constructor(private datePipe: DatePipe) {}

  ngAfterViewInit() {
    this.initialized = true;
    this.checkDataAndInitCharts();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['installments'] && this.initialized) {
      this.checkDataAndInitCharts();
    }
  }

  ngOnDestroy() {
    this.destroyCharts();
  }

  checkDataAndInitCharts() {
    if (!this.installments || this.installments.length === 0) {
      this.noDataMessage = true;
      this.loading = false;
      this.destroyCharts();
      return;
    }

    this.noDataMessage = false;

    // Check if chart elements are available
    if (
      !this.monthlyBarChart?.nativeElement ||
      !this.statusPieChart?.nativeElement
    ) {
      setTimeout(() => this.checkDataAndInitCharts(), 100);
      return;
    }

    if (this.monthlyChart && this.statusChart) {
      this.updateCharts();
    } else {
      this.initCharts();
    }
  }

  initCharts() {
    if (
      !this.monthlyBarChart?.nativeElement ||
      !this.statusPieChart?.nativeElement
    ) {
      return;
    }

    this.loading = true;
    this.destroyCharts();

    try {
      this.createMonthlyChart();
      this.createStatusChart();
      this.animateCharts();
    } catch (error) {
      console.error('Error initializing charts:', error);
    } finally {
      this.loading = false;
    }
  }

  updateCharts() {
    if (!this.monthlyChart || !this.statusChart) {
      this.initCharts();
      return;
    }

    const monthlyData = this.prepareMonthlyData();
    const statusData = this.prepareStatusData();

    try {
      this.monthlyChart.data.labels = monthlyData.labels;
      this.monthlyChart.data.datasets[0].data = monthlyData.amounts;
      this.monthlyChart.update();

      this.statusChart.data.labels = statusData.labels;
      this.statusChart.data.datasets[0].data = statusData.counts;
      this.statusChart.update();
    } catch (error) {
      console.error('Error updating charts:', error);
    }
  }

  destroyCharts() {
    try {
      if (this.monthlyChart) {
        this.monthlyChart.destroy();
        this.monthlyChart = undefined;
      }
      if (this.statusChart) {
        this.statusChart.destroy();
        this.statusChart = undefined;
      }
    } catch (error) {
      console.error('Error destroying charts:', error);
    }
  }

  createMonthlyChart() {
    if (!this.monthlyBarChart?.nativeElement) {
      throw new Error('Monthly chart canvas element not found');
    }

    const ctx = this.monthlyBarChart.nativeElement.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get 2D context for monthly chart');
    }

    const data = this.prepareMonthlyData();
    const gradient = ctx.createLinearGradient(
      0,
      0,
      0,
      this.monthlyBarChart.nativeElement.height
    );
    gradient.addColorStop(0, '#4e73df');
    gradient.addColorStop(1, '#224abe');

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [
          {
            label: 'مبلغ اقساط (تومان)',
            data: data.amounts,
            backgroundColor: gradient,
            borderColor: '#4e73df',
            borderWidth: 1,
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            rtl: true,
            labels: {
              font: {
                family: 'Vazir, Tahoma, sans-serif',
              },
            },
          },
          tooltip: {
            rtl: true,
            callbacks: {
              label: (context: TooltipItem<'bar'>) => {
                const label = context.dataset.label || '';
                const value = context.parsed.y;
                return `${label}: ${value.toLocaleString('fa-IR')}`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => {
                if (typeof value === 'number') {
                  return value.toLocaleString('fa-IR');
                }
                return value;
              },
            },
          },
          x: {
            ticks: {
              font: {
                family: 'Vazir, Tahoma, sans-serif',
              },
            },
          },
        },
      },
    };

    this.monthlyChart = new Chart(ctx, config);
  }

  createStatusChart() {
    if (!this.statusPieChart?.nativeElement) {
      throw new Error('Status chart canvas element not found');
    }

    const ctx = this.statusPieChart.nativeElement.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get 2D context for status chart');
    }

    const data = this.prepareStatusData();
    const backgroundColors = [
      'rgba(75, 192, 192, 0.7)',
      'rgba(255, 206, 86, 0.7)',
      'rgba(255, 99, 132, 0.7)',
    ];

    const borderColors = [
      'rgba(75, 192, 192, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(255, 99, 132, 1)',
    ];

    const config: ChartConfiguration<'pie'> = {
      type: 'pie',
      data: {
        labels: data.labels,
        datasets: [
          {
            label: 'تعداد اقساط',
            data: data.counts,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            rtl: true,
            labels: {
              font: {
                family: 'Vazir, Tahoma, sans-serif',
              },
            },
          },
          tooltip: {
            rtl: true,
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.dataset.data.reduce(
                  (a: number, b: number) => a + b,
                  0
                );
                const percentage = Math.round((Number(value) / total) * 100);
                return `${label}: ${value} قسط (${percentage}%)`;
              },
            },
          },
        },
      },
    };

    this.statusChart = new Chart(ctx, config);
  }

  animateCharts() {
    try {
      if (this.monthlyBarChart?.nativeElement) {
        gsap.from(this.monthlyBarChart.nativeElement, {
          duration: 1,
          opacity: 0,
          y: 50,
          ease: 'power3.out',
        });
      }

      if (this.statusPieChart?.nativeElement) {
        gsap.from(this.statusPieChart.nativeElement, {
          duration: 1,
          opacity: 0,
          y: 50,
          delay: 0.3,
          ease: 'power3.out',
        });
      }
    } catch (error) {
      console.error('Error animating charts:', error);
    }
  }

  prepareMonthlyData(): { labels: string[]; amounts: number[] } {
    const groups: {
      month: number;
      year: number;
      label: string;
      amount: number;
    }[] = [];
    const persianMonths = [
      'فروردین',
      'اردیبهشت',
      'خرداد',
      'تیر',
      'مرداد',
      'شهریور',
      'مهر',
      'آبان',
      'آذر',
      'دی',
      'بهمن',
      'اسفند',
    ];

    this.installments.forEach((installment) => {
      const date = new Date(installment.dueDate);
      const month = date.getMonth(); // 0-11
      const year = date.getFullYear();
      const label = `${persianMonths[month]} ${year}`;

      let group = groups.find((g) => g.month === month && g.year === year);
      if (!group) {
        group = { month, year, label, amount: 0 };
        groups.push(group);
      }
      group.amount += installment.totalAmount;
    });

    // مرتب‌سازی: اول سال، بعد ماه
    groups.sort((a, b) => a.year - b.year || a.month - b.month);

    return {
      labels: groups.map((g) => g.label),
      amounts: groups.map((g) => Number(g.amount.toFixed(2))), // دو رقم اعشار
    };
  }

  prepareStatusData(): { labels: string[]; counts: number[] } {
    const statusCounts: { [key: string]: number } = {
      paid: 0,
      pending: 0,
      overdue: 0,
    };

    this.installments.forEach((installment) => {
      const status = installment.status.toLowerCase();
      if (statusCounts.hasOwnProperty(status)) {
        statusCounts[status]++;
      }
    });

    const persianStatus = {
      paid: 'پرداخت شده',
      pending: 'در انتظار',
      overdue: 'معوق',
    };

    return {
      labels: Object.keys(statusCounts).map(
        (key) => persianStatus[key as keyof typeof persianStatus]
      ),
      counts: Object.values(statusCounts),
    };
  }
}
