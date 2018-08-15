import {Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Chart} from 'chart.js';

import {DashGraphDataPoint} from '../shared/dash-graph.model';
import {MonthlyGraphService} from './monthly-graph.service';
import {UserPreferencesService} from '../../shared/services/user-preferences.service';

@Component({
  selector: 'app-monthly-graph',
  templateUrl: './monthly-graph.component.html',
  styleUrls: ['./monthly-graph.component.scss'],
  providers: [ MonthlyGraphService ],
})
export class MonthlyGraphComponent implements OnInit, OnDestroy, OnChanges {

  @ViewChild('chart') chartElem: ElementRef;

  @Input() data: DashGraphDataPoint[];
  @Input() metric = 'Y';
  @Input() color = '#33f144';

  chart: Chart;
  private theme: string;

  constructor(private monthlyGraphService: MonthlyGraphService, private userPrefSvc: UserPreferencesService) {
  }

  ngOnInit(): void {
    this.userPrefSvc.theme$.subscribe((theme) => {
      this.theme = theme;
      this.ngOnChanges();
    });
  }

  ngOnDestroy(): void {
    this.monthlyGraphService.purge();
  }

  ngOnChanges(): void {
    this.monthlyGraphService.createGraph(
      this.chartElem.nativeElement,
      this.color,
      '#626f86', // this.theme === 'dark-theme' ? 'white' : 'black',
      this.data,
      this.metric
    );
  }
}
