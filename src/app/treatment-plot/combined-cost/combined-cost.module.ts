import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CombinedCostComponent} from './combined-cost.component';
import {CostTableComponent} from './cost-table/cost-table.component';
import {MatDivider} from '@angular/material';
import {SharedModule} from '../../shared/shared.module';
import {NumericCellComponent} from '../../admin/numeric-cell/numeric-cell.component';
import {AgGridModule} from 'ag-grid-angular';
import {CombinedCostService} from './services/combined-cost.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AgGridModule.withComponents([NumericCellComponent]),
  ],
  declarations: [
    CombinedCostComponent,
    CostTableComponent
  ],
  entryComponents: [
    CombinedCostComponent,
    CostTableComponent,
    MatDivider

  ],
  exports: [
    SharedModule,
    AgGridModule
  ],
  providers: [
    CombinedCostService,
  ]
})
export class CombinedCostModule { }
