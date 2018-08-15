import {take, takeUntil} from 'rxjs/operators';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {DashboardDataService} from './dashboard-data.service';
import {DashGraphDataPoint} from './shared/dash-graph.model';
import {ActivatedRoute, Router} from '@angular/router';
import {Well} from '../shared/models/well.model';

import {Subject} from 'rxjs';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [ DashboardDataService ]
})
export class DashboardComponent implements OnInit, OnDestroy {
  public wellCount: DashGraphDataPoint[];
  public stageCount: DashGraphDataPoint[];
  public ytdWells: number;
  public ytdStages: number;
  public wellLocations: any = [];

  private unsubscribe: Subject<void> = new Subject<void>();

  constructor(private dataService: DashboardDataService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.pipe(
      takeUntil(this.unsubscribe)
    ).subscribe(params => this.populateDashboardData(params.asset));
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  populateDashboardData(asset: string): void {
    this.dataService.getWellCount(asset).pipe(
      take(1))
      .subscribe((data) => {
        this.ytdWells = data.reduce((acc, curr) => acc += curr.y, 0);
        this.wellCount = data;
      });
    this.dataService.getStageCount(asset).pipe(
      take(1))
      .subscribe((data) => {
        this.ytdStages = data.reduce((acc, curr) => acc += curr.y, 0);
        this.stageCount = data;
      });
    this.dataService.getWellLocations(asset).pipe(
      take(1))
      .subscribe((data) => {
        this.wellLocations = data.wells;
      });
  }

  wellSelected(well: Well): void {
    const asset = this.route.snapshot.params.asset;
    this.router.navigate([ asset, 'treatment-plot', well.api_no_10 ]);
  }
}
