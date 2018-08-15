
import {take, takeUntil} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import {CombinedCost, FixedCost, VariableCost} from '../../shared/models/cost.model';
import {CostService} from '../../shared/services/cost.service';
import {UserPreferencesService} from '../../shared/services/user-preferences.service';
import {Subject} from 'rxjs';
import {CombinedCostService} from './services/combined-cost.service';
import {ActivatedRoute} from '@angular/router';
import {RouterUtilsService} from '../../shared/services/router-utils.service';
import {ToasterService} from 'angular2-toaster';
import {AppConstantsService} from '../../app.constants.service';

@Component({
  selector: 'app-combined-cost',
  templateUrl: './combined-cost.component.html',
  styleUrls: ['./combined-cost.component.scss'],
  providers: [/*CombinedCostService*/]
})
export class CombinedCostComponent implements OnInit {
  private unsubscribe = new Subject<void>();
  currentTheme = 'dark-theme';
  costResultsData: CombinedCost = {};
  combinedCostChanges: any = {};
  isDirty = false;
  editableFieldTextColor = '#000';
  editableFieldBgColor = '#ffff77';
  userCanEdit = false;

  fixedCostDef: any[]  = [
    { headerName: 'Description', field: 'description', width: 225, editable: false},
    { headerName: 'Base Cost', field: 'base_cost', type: 'numericColumn', valueFormatter: (params) => `$${this.numberFormatter(params)} / ${params.data.item_uom}`, editable: false },
    { headerName: 'Quantity', field: 'quantity', type: 'numericColumn',
      valueFormatter: (params) => `${this.numberFormatter(params)} / ${params.data.item_uom}`,
      editable:  (params) => params.data.multiplier_type === 'USER_DEFINED' && this.userCanEdit,
      cellStyle: (params) => {
        return {
          color: (params.data.multiplier_type === 'USER_DEFINED' && this.userCanEdit) ? this.editableFieldTextColor : '',
          backgroundColor: (params.data.multiplier_type === 'USER_DEFINED' && this.userCanEdit) ? this.editableFieldBgColor : ''
        };
      } },
    { headerName: 'Total Cost', field: 'total_cost', type: 'numericColumn', valueFormatter: (params) => '$' + this.numberFormatter(params), editable: false },
  ];
  fixedCostData: FixedCost[] = this.costResultsData.fixed_costs;

  variableCostDef: any[]  = [
    { headerName: 'Description', field: 'description', width: 225, editable: false},
    { headerName: 'Base Cost', field: 'base_cost', type: 'numericColumn', valueFormatter: (params) => `$${this.numberFormatter(params)} / ${params.data.item_uom}`, editable: false },
    { headerName: 'Quantity', field: 'quantity', type: 'numericColumn',
      valueFormatter: (params) => `${this.numberFormatter(params)} / ${params.data.item_uom}`,
      cellStyle: (params) => {
        return {
          color: (params.data.multiplier_type === 'USER_DEFINED' && this.userCanEdit) ? this.editableFieldTextColor : '',
          backgroundColor: (params.data.multiplier_type === 'USER_DEFINED' && this.userCanEdit) ? this.editableFieldBgColor : ''
        };
      },
      editable: (params) => params.data.multiplier_type === 'USER_DEFINED' && this.userCanEdit },
    { headerName: 'Total Cost', field: 'total_cost', type: 'numericColumn', valueFormatter: (params) => '$' + this.numberFormatter(params), editable: false },
    { headerName: 'Assigned Channel', field: 'assigned_channel',
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: (params) => {
      const values = params.data.assigned_channel_list;
        return {
          values
        };
      },
      cellStyle: (params) => {
        return {
          color: (params.data.multiplier_type === 'CHANNEL' && this.userCanEdit) ? this.editableFieldTextColor : '',
          backgroundColor: (params.data.multiplier_type === 'CHANNEL' && this.userCanEdit) ? this.editableFieldBgColor : ''
        };
      }, editable: (params) => params.data.multiplier_type === 'CHANNEL' && this.userCanEdit},
    { headerName: 'Ratio', field: 'ratio', type: 'numericColumn',
      valueFormatter: (params) => `${this.numberFormatter(params)} / ${params.data.data_source_units}`,
      cellStyle: (params) => {
        return {
          color: (params.data.multiplier_type === 'RATIO'  && this.userCanEdit) ? this.editableFieldTextColor : '',
          backgroundColor: (params.data.multiplier_type === 'RATIO' && this.userCanEdit) ? this.editableFieldBgColor : ''
        };
      },
      editable: (params) => params.data.multiplier_type === 'RATIO' && this.userCanEdit },
  ];

  variableCostData: VariableCost[] = this.costResultsData.variable_costs;

  currentAsset: string;
  currentWellApi: string;
  currentStageNumber: number;

  static formatValue(decimalPlaces: string): string {
    decimalPlaces = decimalPlaces || '0';
    return `1.${decimalPlaces}-${decimalPlaces}`;
  }

  constructor(private userPref: UserPreferencesService,
              private activatedRoute: ActivatedRoute,
              private costService: CombinedCostService,
              private routeUtils: RouterUtilsService,
              private toasterSvc: ToasterService,
              private appConstantsService: AppConstantsService) {

  }

  ngOnInit() {
    this.userPref.theme$.asObservable()
      .pipe(
        takeUntil(this.unsubscribe)
      )
      .subscribe(t => {
        this.currentTheme = t;
      });

    this.appConstantsService.userRole$.pipe(
      take(1))
      .subscribe(e => {
        this.userCanEdit = e !== 'visitor';
      });

    // this.userCanEdit = !(this.appConstantsService.userRole === 'visitor');
    console.log('Current user role: ', this.appConstantsService.userRole, this.userCanEdit);
    this.initParams();
  }

  initParams(): void {
    const params = this.routeUtils.getFullTreeParams(this.activatedRoute);
    this.currentAsset = params.asset;
    this.currentWellApi = params.well;
    this.currentStageNumber = parseInt(params.stage, 10);
    this.getCostResults();
  }

  getCostResults(): void {
    this.costService.getCostResultsData(this.currentWellApi, this.currentStageNumber).pipe(
      take(1))
      .subscribe((costResults: CombinedCost) => {
        this.costResultsData = costResults;
        this.fixedCostData = costResults.fixed_costs;
        this.variableCostData = costResults.variable_costs;
      });
  }

  saveCombinedCost(): void {
    this.costService.updateCombinedCost([...this.associativeToIndexArray(this.combinedCostChanges)]).pipe(
      take(1))
      .subscribe((v: CombinedCost) => {
        this.isDirty = false;
        this.toasterSvc.pop('success', '', 'Cost Tables Successfully Saved.');
      });
  }

  onCellValueChanged({oldValue, newValue, data}) {
    const {description} = data;
    if (parseFloat(oldValue) !== parseFloat(newValue)) {
      if (oldValue === null) {
        if (newValue !== '')  {
          this.combinedCostChanges[description] = data;
        }
      } else {
        this.combinedCostChanges[description] = data;
      }
    }
    if ( Object.keys(this.combinedCostChanges).length > 0) {
      this.isDirty = true;
    }
    this.isDirty = true;
  }

  numberFormatter(params) {
    return `${Number(params.value).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`;
  }

  associativeToIndexArray(a: any): any[] {
    const temp: any[] = [];
    for (const item in a) {
      if (a.hasOwnProperty(item)) {
        temp.push(a[item]);
      }
    }
    return temp;
  }
}
