import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import {DashboardDataService} from './dashboard-data.service';
import {MonthlyGraphComponent} from './monthly-graph/monthly-graph.component';
import {MonthlyGraphService} from './monthly-graph/monthly-graph.service';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    DashboardComponent,
    MonthlyGraphComponent
  ],
  exports: [
    DashboardComponent,
  ],
  providers: [
    DashboardDataService,
    MonthlyGraphService
  ]
})
export class DashboardModule { }
