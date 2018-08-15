
import {switchMap, map, take, filter} from 'rxjs/operators';
import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {PumpScheduleService} from '../../shared/services/pump-schedule.service';
import {PumpSchedule, Schedule, Validation} from '../../shared/models/pump-schedule.model';
import {ActivatedRoute} from '@angular/router';
import {ColDef, ColumnApi, GridApi} from 'ag-grid';
import {DeleteButtonComponent} from '../delete-button/delete-button.component';
import {ConfirmationService} from '../../shared/services/confirmation.service';
import {NumericCellComponent} from '../numeric-cell/numeric-cell.component';
import {ToasterService} from 'angular2-toaster';
import * as _ from 'lodash';

@Component({
  selector: 'app-manage-pump-schedules',
  templateUrl: './manage-pump-schedules.component.html',
  styleUrls: ['./manage-pump-schedules.component.scss']
})
export class ManagePumpSchedulesComponent implements OnInit {
  @ViewChild('pumpScheduleName') pumpScheduleName: ElementRef;
  @Input() userCanEdit = false;
  @Input() set theme(theme: string) {
    this.currentTheme = theme;

    if (this.gridApi) {
      setTimeout(() => {
        this.gridApi.hideOverlay();
        this.gridApi.resetRowHeights();
        this.gridApi.redrawRows();
        this.gridApi.refreshHeader();
        this.gridApi.refreshToolPanel();
      });
    }
  }

  currentTheme = 'dark-theme';
  currentAsset: string;
  gridApi: GridApi;
  columnApi: ColumnApi;
  context;
  frameworkComponents;
  emptyPumpSchedule: PumpSchedule = {
    archived: false,
    asset: '',
    name: '',
    schedule: [null]
  };
  pumpSchedules: PumpSchedule[] = [];
  originalPumpSchedule: PumpSchedule;
  selectedPumpSchedule: PumpSchedule = this.emptyPumpSchedule;
  selectedSchedule: Schedule[] = [null];
  editMode = false;
  newPumpSchedule = false;
  scheduleErrors: any[] = [];
  errorMessage = 'Out of range.';
  psNameEmpty = false;
  psNameDuplicated = false;
  isDirty = false;
  miniNumOfSteps = 3;

  columnDefs = [
    { headerName: 'Step', field: 'step_num', editable: false, rowDrag: false, width: 75 },
    { headerName: 'Fluid Name', field: 'fluid_name', editable: false },
    { headerName: 'Gel Wt.', field: 'gel_weight', cellEditor: 'numericCellEditor', type: 'numericColumn', editable: false,
      cellStyle: (params) => {
        return {
          backgroundColor: this.rangeToColor(params, [0, Number.MAX_VALUE])
        };
      } },
    { headerName: 'Prop. Conc.', field: 'proppant_conc', cellEditor: 'numericCellEditor', type: 'numericColumn', editable: false,
      cellStyle: (params) => {
        return {
          backgroundColor: this.rangeToColor(params, [0, 10])
        };
      },
      headerTooltip: 'Header tool Tip...',
      tooltipField: 'Cell tooltip',
      tooltip: function() {
        return 'errorMessage';
      }
    },
    { headerName: 'Prop. Name', field: 'proppant_name', editable: false },
    { headerName: 'Pump Rate', field: 'pump_rate', cellEditor: 'numericCellEditor', type: 'numericColumn', editable: false,
      cellStyle: (params) => {
        return {
          backgroundColor: this.requiredToColor(params, [0, 100])
        };
      }},
    { headerName: 'Step Volume (Gal)', field: 'step_volume_gal', cellEditor: 'numericCellEditor', type: 'numericColumn', editable: false,
      cellStyle: (params) => {
        return {
          backgroundColor: this.requiredToColor(params, [0, Number.MAX_VALUE])
        };
      }},
    { headerName: 'Barrels', field: 'barrels', editable: false, valueGetter: 'data.step_volume_gal / 42', valueFormatter: ManagePumpSchedulesComponent.formatNumber, width: 100},
    { headerName: 'Comments', field: 'step_comments', editable: false, width: 300
    },
  ];

  constructor(private pumpScheduleSvc: PumpScheduleService,
              private route: ActivatedRoute,
              private activatedRoute: ActivatedRoute,
              private confirmSvc: ConfirmationService,
              private toasterSvc: ToasterService) {

  }

  static formatNumber(param): string {
    return Math.floor(param.value).toString();
  }

  static addDeleteRow(): any {
    return { headerName: 'Delete', field: 'delete_row', cellRenderer: 'deleteButton', editable: false, width: 85  };
  }

  static updateStepNum(schedule: Schedule[]): Schedule[] {
    return schedule
      .map((c, idx) => {
        c.step_num = `${idx + 1}`;
        return c;
      });
  }

  ngOnInit() {
    this.route.params.pipe(
      map(params => params.asset))
      .subscribe(asset => {
        this.pumpScheduleSvc.getPumpSchedules(asset).pipe(
          take(1))
          .subscribe(data => {
          this.pumpSchedules = data;
        });
      });

    this.currentAsset = this.activatedRoute.snapshot.params.asset;
    this.context = { componentParent: this };
    this.frameworkComponents = {
      deleteButton: DeleteButtonComponent,
      numericCellEditor: NumericCellComponent
    };
  }

  onPumpScheduleChange(): void {
    this.originalPumpSchedule = _.cloneDeep(this.selectedPumpSchedule);
    this.selectedSchedule = this.selectedPumpSchedule.schedule;
    this.newPumpSchedule = false;
  }
  checkArchivedState(archived: boolean): void {
    this.isDirty = true;
    this.updatechartMode(true);
  }
  addNewPumpSchedule(): void {
    this.selectedPumpSchedule = this.emptyPumpSchedule;
    this.newPumpSchedule = true;
    delete this.scheduleErrors;
    this.scheduleErrors = [];

    this.editPumpSchedule();

    this.pumpScheduleName.nativeElement.value = '';

    this.selectedSchedule = [];
    this.gridApi.setRowData(this.selectedSchedule);
    let i = 0;
    while (i < this.miniNumOfSteps) {
      this.addNewScheduleStep(this.selectedSchedule);
      i++;
    }
  }

  editPumpSchedule(edit: boolean = true): void {
    if (!edit && this.isDirty) {
      this.undoChanges();
      return;
    }
    this.updatechartMode(edit);
  }
  getPumpScheduleState(): boolean {
    return this.selectedPumpSchedule.hasOwnProperty('id');
  }
  updatechartMode(edit: boolean): void {
    this.editMode = edit;

    const columnDefs = this.setRowEditMode(this.columnDefs, edit)
      .filter(c => c.field !== 'delete_row');

    if (edit) {
      columnDefs.push(ManagePumpSchedulesComponent.addDeleteRow());
    }

    this.gridApi.setColumnDefs(columnDefs);
    this.gridApi.sizeColumnsToFit();
  }

  addNewScheduleStep(selectedSchedule): void {
    const step: Schedule = <Schedule> { step_num: `${this.gridApi.getDisplayedRowCount() + 1}` };

    selectedSchedule.push(step);
    this.gridApi.updateRowData({ add: [step] });
    this.isDirty = true;
  }

  undoChanges(): void {
    this.confirmSvc.confirm('There are unsaved changes. Are you sure you want to stop editing?', 'Cancel Changes').pipe(
      take(1),
      filter(v => v))
      .subscribe(() => {
        this.selectedSchedule = [];
        if (!this.newPumpSchedule) {
          this.selectedPumpSchedule = _.cloneDeep(this.originalPumpSchedule);
          this.selectedSchedule = this.selectedPumpSchedule.schedule;
          this.pumpScheduleName.nativeElement.value = this.selectedPumpSchedule.name;
        }
        this.clearGrid(this.selectedSchedule);
        this.updatechartMode(false);
        this.toasterSvc.pop('success', '', 'All updates have been canceled.');
      });
  }

  clearGrid(schedule: Schedule | any): void {
    this.gridApi.setRowData(schedule);
    this.isDirty = false;
    this.newPumpSchedule = false;
    this.psNameEmpty = false;
    this.psNameDuplicated = false;
  }

  setRowEditMode(columnDefs: any[], edit: boolean = true): ColDef[] {
    return columnDefs
      .map(c => {
        switch (c.field) {
          case 'step_num':
          case 'barrels':
          case 'delete_row':
            c.editable = false;
            break;
          default:
            c.editable = edit;
        }
        if (c.hasOwnProperty('rowDrag')) {
          c.rowDrag = edit;
        }
        return c;
      });
  }

  deleteStep({rowNumber}): void {
    this.confirmSvc.confirm(`Are you sure you want to delete this step number ${rowNumber + 1}?`, 'Delete Schedule Step').pipe(
      take(1),
      filter(result => result))
      .subscribe(() => {
        this.gridApi.updateRowData({ remove: this.gridApi.getSelectedRows() });
        this.checkErrorsBeforeDelete(this.gridApi, this.scheduleErrors, rowNumber);

        this.selectedSchedule.splice(rowNumber, 1);
        this.gridApi.setRowData(ManagePumpSchedulesComponent.updateStepNum(this.selectedSchedule));
        this.isDirty = true;
      });
  }

  checkErrorsBeforeDelete(gridApi, scheduleErrors: any[], rowNumber: number) {
    gridApi.forEachNode((row) => {
      switch (row.field) {
        case 'step_num':
        case 'barrels':
        case 'delete_row':
        case 'fluid_name':
        case 'proppant_name':
        case 'step_comments':
          break;
        default:
          if (scheduleErrors[row.field]) {
            scheduleErrors = this.removeScheduleErrors(scheduleErrors, row.field, rowNumber);
          }
      }
    });
  }

  rangeToColor(param, range?: Number[]): string {
    const {value, node: { rowIndex }, colDef: { field: colID } } = param;
    if (value === undefined || value >= range[0] && value <= range[1]) {
      return this.updateScheduleErrors(rowIndex, colID, false);
    }
    return this.updateScheduleErrors(rowIndex, colID, true, '#ffd242');
  }

  requiredToColor(param, range?: Number[]): string {
    const {value, node: { rowIndex }, colDef: { field: colID } } = param;
    if (value === '' || value === null || value === undefined) {
      return this.updateScheduleErrors(rowIndex, colID, true);
    }

    if (range) {
      return this.rangeToColor(param, range);
    }
    return this.updateScheduleErrors(rowIndex, colID, false);
  }

  updateScheduleErrors(row: number, column: string, hasError: boolean, color = '#ffaaaa'): string {
    if (hasError) {
      if (!this.scheduleErrors[column]) {
        this.scheduleErrors[column] = [];
      }
      this.scheduleErrors[column][row] = hasError;
      return color;
    }
    this.scheduleErrors = this.removeScheduleErrors(this.scheduleErrors, column, row);
    return '';
  }

  removeScheduleErrors(scheduleErrors, column: string, row: number): Schedule[] {
    if (scheduleErrors[column]) {
      delete scheduleErrors[column][row];
      if (scheduleErrors[column].length === 0) {
        delete scheduleErrors[column];
      }
      const schedules: any[] = [];
      Object.keys(scheduleErrors).map(s => {
        if (scheduleErrors[s].join('').toString().length > 1) {
          schedules[s] = scheduleErrors[s];
        }
      });
      return schedules;
    }
    return scheduleErrors;
  }

  getGridValues(gridApi): Schedule[] {
    const schedule: Schedule[] = [];
    gridApi.forEachNode((row) => {
      switch (row.field) {
        case 'step_num':
        case 'barrels':
        case 'delete_row':
          break;
        default:
          schedule.push(row.data);
      }
    });
    return schedule;
  }

  checkForDuplicateOrEmptyName(psName: string): string {
    if ( !this.editMode || !this.newPumpSchedule) { return psName; }
    this.psNameEmpty = psName.length === 0;
    this.psNameDuplicated = this.pumpSchedules.some( ps =>  ps.name.toLowerCase() === psName.toLowerCase() );
    return psName;
  }

  updateFormState(evt): void {
    console.log(evt);
    this.isDirty = true;
  }

  savePumpSchedule(): void {
    const schedule: Schedule[] = this.getGridValues(this.gridApi);
    const ps: PumpSchedule = { archived: this.newPumpSchedule ? false : this.selectedPumpSchedule.archived,
                               asset: this.newPumpSchedule ? this.currentAsset : this.selectedPumpSchedule.asset,
                               name: this.newPumpSchedule ? this.checkForDuplicateOrEmptyName(this.pumpScheduleName.nativeElement.value).toLowerCase() : this.pumpScheduleName.nativeElement.value.toLowerCase(),
                               id: this.newPumpSchedule ? '' : this.selectedPumpSchedule.id,
                               schedule
                             };
    if (this.newPumpSchedule) {
      this.addPumpSchedule(ps);
      return;
    }
    // Update the selected pump schedule
    this.pumpScheduleSvc.updatePumpSchedule(ps).pipe(
      take(1))
      .subscribe((v: Validation) => {
        if (!v.valid) {
          this.createValidationToaster(v.errors);
          return;
        }
        this.toasterSvc.pop('success', '', 'Pump Schedule Successfully Saved.');
        this.pumpSchedules = this.pumpSchedules.map(s => {
          if (s.id === v.obj.id) {
            s = v.obj;
          }
          return s;
        });
        this.gridApi.setRowData(v.obj.schedule);
        this.editMode = false;
        this.isDirty = false;
      });
  }

  addPumpSchedule(ps: PumpSchedule): void {
    this.pumpScheduleSvc.addPumpSchedule(ps).pipe(
      take(1))
      .subscribe((v: Validation) => {
        if (!v.valid) {
          this.createValidationToaster(v.errors);
          return;
        }
        this.toasterSvc.pop('success', '', 'Pump Schedule Successfully Created.');
        this.pumpSchedules.push(v.obj);
        this.gridApi.setRowData(v.obj.schedule);
        this.newPumpSchedule = this.editMode = this.isDirty = false;
      });
  }

  deletePumpSchedule(selectedPumpSchedule: PumpSchedule): void {
    this.confirmSvc.confirm('Are you sure you want to delete this pump schedule?', 'Delete Pump Schedule').pipe(
      filter(v => v),
      take(1),
      switchMap(() => this.pumpScheduleSvc.deletePumpSchedule(selectedPumpSchedule.asset, selectedPumpSchedule.id).pipe(take(1))))
      .subscribe((ps) => {
        this.pumpSchedules = ps;
        this.pumpScheduleName.nativeElement.value = '';
        delete this.originalPumpSchedule;
        this.selectedPumpSchedule = this.emptyPumpSchedule;
        this.clearGrid([]);
        this.toasterSvc.pop('success', '', 'Pump Schedule Successfully Deleted.');
      });
  }

  createValidationToaster(errors: string[]): void {
    errors.forEach(e => {
      this.toasterSvc.pop('error', 'Validation Error', e);
    });
  }

  hasErrors(scheduleErrors: any[]): boolean {
    return this.checkForDuplicateOrEmptyName(this.pumpScheduleName.nativeElement.value).length === 0 || Object.keys(scheduleErrors).length > 0;
  }

  onCellClicked({colDef: { editable }}): void {
    if (this.editMode && !editable) {
      this.gridApi.tabToNextCell();
    }
  }
  setGridState(evt): void {
    console.log(evt);
    this.isDirty = true;
  }

  onRowDragEnd({ overIndex, node: { data: { step_num }}}) {
    this.selectedSchedule.splice(overIndex, 0, this.selectedSchedule.splice(Number(step_num) - 1, 1)[0]);
    this.gridApi.setRowData(ManagePumpSchedulesComponent.updateStepNum(this.selectedSchedule));
  }

  onGridReady(evt: any): void {
    this.gridApi = evt.api;
    this.columnApi = evt.columnApi;
    this.columnApi.setColumnVisible('delete_row', false);
    this.gridApi.setRowData([]);
    evt.api.sizeColumnsToFit();
  }
}
