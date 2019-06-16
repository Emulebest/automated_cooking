import {AfterContentInit, AfterViewChecked, AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';

import {Chart} from 'chart.js';
import {Metric} from '../_models/metric';
import {StatisticsService} from '../_services/statistics.service';
import {interval, of, Subscription} from 'rxjs';
import {delay, startWith, switchMap, take} from 'rxjs/operators';

@Component({
  selector: 'app-device-statistics',
  templateUrl: './device-statistics.component.html',
  styleUrls: ['./device-statistics.component.scss']
})
export class DeviceStatisticsComponent implements OnInit, OnDestroy {

  @ViewChild('canvas') canvas: ElementRef;
  title = 'stats';
  data: Metric[];
  time = [];
  metric = [];
  chart: Chart;
  private subscription: Subscription;

  constructor(private statService: StatisticsService) {
  }

  ngOnInit() {

    this.statService.initStatProcess().subscribe(res => {
    }, e => {
    });
    this.statService.getStats().subscribe(metrics => {
      console.log(metrics);
      metrics.forEach(metric => {
        console.log(metric);
        if (this.time.length > 20) {
          this.time.shift();
        }
        if (this.metric.length > 20) {
          this.metric.shift();
        }
        this.time.push(new Date(metric.dt).getMinutes());
        this.metric.push(metric.value);
      });
      console.log(this.time);
      console.log(this.metric);
      interval(2000).pipe(take(2)).subscribe(() => {
        this.chart = new Chart('canvas', {
          type: 'line',
          data: {
            labels: this.time,
            datasets: [
              {
                data: this.metric,
                borderColor: '#3cba9f',
                fill: false
              }
            ]
          },
          options: {
            legend: {
              display: false
            },
            scales: {
              xAxes: [{
                display: true
              }],
              yAxes: [{
                display: true
              }],
            }
          }
        });
      });
    });
    this.subscription = interval(10000).pipe(switchMap(() => this.statService.getLatestStat())).subscribe(metrics => {
      const metric = metrics[0];
      let updTime = false;
      let updVal = false;
      if (metric) {
        if (this.time.length > 20) {
          this.time.shift();
        }
        if (this.metric.length > 20) {
          this.metric.shift();
        }
        if (this.time[this.time.length - 1] !== new Date(metric.dt)) {
          this.time.push(new Date(metric.dt).getMinutes());
          updTime = true;
        }
        if (this.metric[this.metric.length - 1] !== metric.value) {
          this.metric.push(metric.value);
          updVal = true;
        }
        if (updTime && updVal) {
          this.chart.update();
        }
      }
    });


  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
