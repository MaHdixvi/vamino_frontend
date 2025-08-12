import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import gsap from 'gsap';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-charts',
  templateUrl: './dashboard-charts.html',
  styleUrls: ['./dashboard-charts.css'],
})
export class DashboardChartsComponent implements AfterViewInit {
  @ViewChild('barCanvas', { static: false })
  barCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieCanvas', { static: false })
  pieCanvas!: ElementRef<HTMLCanvasElement>;

  barChartInstance!: Chart;
  pieChartInstance!: Chart;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    // setTimeout برای جلوگیری از خطای ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.barChartInstance = this.createBarChart(this.barCanvas.nativeElement);
      this.pieChartInstance = this.createPieChart(this.pieCanvas.nativeElement);

      this.cdr.detectChanges();

      this.animateCharts();
    });
  }

  // ساخت چارت ستونی با گرادیانت عمودی آبی تا فیروزه‌ای
  createBarChart(canvas: HTMLCanvasElement): Chart {
    const ctx = canvas.getContext('2d')!;

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#007bff'); // آبی تیره
    gradient.addColorStop(1, '#00d4ff'); // فیروزه‌ای روشن

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: [
          'فروردین',
          'اردیبهشت',
          'خرداد',
          'تیر',
          'مرداد',
          'شهریور',
          'مهر',
        ],
        datasets: [
          {
            label: 'فروش',
            data: [65, 59, 80, 81, 56, 55, 40],
            backgroundColor: gradient,
            borderColor: '#007bff',
            borderWidth: 1,
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        animation: {
          duration: 2000,
          easing: 'easeOutQuart',
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    };
    return new Chart(ctx, config);
  }

  // ساخت چارت دایره‌ای با گرادیانت برای هر بخش
  createPieChart(canvas: HTMLCanvasElement): Chart {
    const ctx = canvas.getContext('2d')!;

    // آرایه‌ای از دو رنگ برای گرادیانت هر بخش
    const colors = [
      ['#ff6384', '#ff9aa2'], // قرمز
      ['#36a2eb', '#a0d8f7'], // آبی
      ['#ffce56', '#fff1a8'], // زرد
    ];

    const config: ChartConfiguration<'pie'> = {
      type: 'pie',
      data: {
        labels: ['قرمز', 'آبی', 'زرد'],
        datasets: [
          {
            label: 'رای‌ها',
            data: [300, 50, 100],
            backgroundColor: (context) => {
              const chart = context.chart;
              const { ctx, chartArea } = chart;

              if (!chartArea) {
                return colors[context.dataIndex][0];
              }

              const gradient = ctx.createLinearGradient(
                0,
                chartArea.top,
                0,
                chartArea.bottom
              );
              gradient.addColorStop(0, colors[context.dataIndex][0]);
              gradient.addColorStop(1, colors[context.dataIndex][1]);

              return gradient;
            },
          },
        ],
      },
      options: {
        responsive: true,
        animation: {
          duration: 2000,
          easing: 'easeOutQuart',
        },
      },
    };

    return new Chart(ctx, config);
  }

  // انیمیشن‌های ورود با GSAP
  animateCharts() {
    gsap.from(this.barCanvas.nativeElement, {
      duration: 1,
      opacity: 0,
      y: 50,
      ease: 'power3.out',
    });
    gsap.from(this.pieCanvas.nativeElement, {
      duration: 1,
      opacity: 0,
      y: 50,
      delay: 0.3,
      ease: 'power3.out',
    });
  }
}
