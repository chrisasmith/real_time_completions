
import {take} from 'rxjs/operators';
import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ChannelsService} from '../../shared/services/channels.service';
import {BasicChannel, Channel} from '../../shared/models/channel.model';
import {Subject} from 'rxjs';
import {ColumnApi, GridApi} from 'ag-grid';
import {NumericCellComponent} from '../numeric-cell/numeric-cell.component';
import {DeleteButtonComponent} from '../delete-button/delete-button.component';
import {Schedule, Validation} from '../../shared/models/pump-schedule.model';
import {ColorPickerComponent} from '../color-picker/color-picker.component';
import * as _ from 'lodash';
import {ToasterService} from 'angular2-toaster';

@Component({
  selector: 'app-manage-channels',
  templateUrl: './manage-channels.component.html',
  styleUrls: ['./manage-channels.component.scss']
})
export class ManageChannelsComponent implements OnInit, OnDestroy {
  @ViewChild('filterTextBox') filterTextBox: ElementRef;
  private unsubscribe = new Subject<void>();
  _userCanEdit = false;
  @Input() set userCanEdit(editable: boolean) {
    this._userCanEdit = editable;
    this.setChannelsDef(editable);
  }
  @Input() set tabactive(active: boolean) {
    if (active) {
      this.gridApi.sizeColumnsToFit();
    }
  }
  @Input() set theme(theme: string) {
    this.currentTheme = theme;

    if (this.gridApi) {
      setTimeout(() => {
        this.gridApi.sizeColumnsToFit();
        this.gridApi.hideOverlay();
        this.gridApi.resetRowHeights();
        this.gridApi.redrawRows();
        this.gridApi.refreshHeader();
        this.gridApi.refreshToolPanel();
      });
    }
  }
  channels: BasicChannel[] = [];
  currentTheme = 'dark-theme';
  gridApi: GridApi;
  columnApi: ColumnApi;
  context;
  frameworkComponents;
  gridErrors: any[] = [];
  channelChanges: any = {};
  getRowNodeId;

  isDirty = false;

  defaultColDef;
  channelsDef  = [];
  filterApplied = false;

  constructor(private channelsSrv: ChannelsService,
              private toasterSvc: ToasterService) {
  }

  ngOnInit() {
    this.context = { componentParent: this };

    this.frameworkComponents = {
      numericCellEditor: NumericCellComponent,
      colorPickerCellEditor: ColorPickerComponent
    };
    this.getRowNodeId = (data) => data.channel_name;

    this.getChannels();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  setChannelsDef(userCanEdit: boolean = false): void {
    this.defaultColDef = {
      suppressMenu: true,
      editable: userCanEdit
    };
    this.channelsDef  = [
      { headerName: 'Channel Name', field: 'channel_name', width: 250, editable: false},
      { headerName: 'Proper Name', field: 'proper_name',
        getQuickFilterText: function(params) {
          return params.value.name;
        }, width: 250, editable: userCanEdit},
      { headerName: 'Default Color', field: 'default_color',
        cellRendererSelector: () => {
          if (userCanEdit) {
            return {
              component: 'colorPickerCellEditor'
            };
          } else {
            return null;
          }
        }, width: 120, editable: false,
        cellStyle: (params) => {
          return {
            color: params.value,
            backgroundColor: params.value
          };
        }},
      { headerName: 'Plot Min', field: 'plot_min', cellEditor: 'numericCellEditor', type: 'numericColumn', width: 100,
        cellStyle: (params) => {
          return {
            backgroundColor: this.rangeToColor(params, [0, Number.MAX_VALUE])
          };
        }, editable: userCanEdit},
      { headerName: 'Plot Max', field: 'plot_max', cellEditor: 'numericCellEditor', type: 'numericColumn', width: 100,
        cellStyle: (params) => {
          return {
            backgroundColor: this.rangeToColor(params, [0, Number.MAX_VALUE])
          };
        }, editable: userCanEdit},
      { headerName: 'Unit', field: 'unit', width: 80,
        cellStyle: (params) => {
          return {
            backgroundColor: this.requiredToColor(params)
          };
        }, editable: userCanEdit},
      { headerName: 'Decimal Precision', field: 'decimal_precision', cellEditor: 'numericCellEditor', type: 'numericColumn', width: 150,
        cellStyle: (params) => {
          return {
            backgroundColor: this.rangeToColor(params, [0, 5])
          };
        }, editable: userCanEdit },
      { headerName: 'Default', field: 'default', width: 120,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: [true, false]
        }, editable: userCanEdit},
      { headerName: 'Show in List', field: 'show_in_channel_list', width: 120,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: [true, false]
        }, editable: userCanEdit},
      { headerName: 'Data Source', field: 'data_source', editable: false}
    ];
  }

  cellValueChanged({oldValue, newValue, data}) {
    const {channel_name} = data;
    if (oldValue !== newValue) {
      if (oldValue === null) {
        if (newValue !== '')  {
          this.channelChanges[channel_name] = data;
        }
      } else {
        this.channelChanges[channel_name] = data;
      }
    }
    if ( Object.keys(this.channelChanges).length > 0) {
      this.isDirty = true;
    }
  }

  saveChannels(): void {
    this.channelsSrv.updateRawChannels([...this.associativeToIndexArray(this.channelChanges)]).pipe(
      take(1))
      .subscribe((v: Validation) => {
        if (!v.valid) {
          // ERRORS
          return;
        }
        this.channelsSrv.channels = [];
        this.channels = v.obj;
        this.isDirty = false;
        this.toasterSvc.pop('success', '', 'Channels Successfully Saved.');
      });
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

  onFilterTextBoxChanged(ele: KeyboardEvent) {
    const input = (<HTMLInputElement>ele.target);
    this.applyFilter(input.value, input.value.length > 0);
  }

  clearFilter(): void {
    this.filterTextBox.nativeElement.value = '';
    this.applyFilter();
  }

  applyFilter(filterBY: string = '', filtered: boolean = false): void {
    this.gridApi.setQuickFilter(filterBY);
    this.filterApplied = filtered;
  }

  setColor({channel_name, rowNumber, columnName, newColor}): void {
    const rowNode = this.gridApi.getRowNode(channel_name);
    rowNode.setDataValue('default_color', newColor);
  }
  rangeToColor(param, range?: Number[]): string {
    const {value, node: { rowIndex }, colDef: { field: colID } } = param;
    if (value === undefined || value >= range[0] && value <= range[1]) {
      return this.updateErrors(rowIndex, colID, false);
    }
    return this.updateErrors(rowIndex, colID, true, '#ffd242');
  }

  requiredToColor(param, range?: Number[]): string {
    const {value, node: { rowIndex }, colDef: { field: colID } } = param;
    if (value === '' || value === null || value === undefined) {
      return this.updateErrors(rowIndex, colID, true);
    }

    if (range) {
      return this.rangeToColor(param, range);
    }
    return this.updateErrors(rowIndex, colID, false);
  }

  updateErrors(row: number, column: string, hasError: boolean, color = '#ffaaaa'): string {
    if (hasError) {
      if (!this.gridErrors[column]) {
        this.gridErrors[column] = [];
      }
      this.gridErrors[column][row] = hasError;
      return color;
    }
    this.gridErrors = this.removeErrors(this.gridErrors, column, row);
    return '';
  }

  removeErrors(errors, column: string, row: number): BasicChannel[] {
    if (errors[column]) {
      delete errors[column][row];
      if (errors[column].length === 0) {
        delete errors[column];
      }
      const channels: any[] = [];
      Object.keys(errors).map(s => {
        if (errors[s].join('').toString().length > 1) {
          channels[s] = errors[s];
        }
      });
      return channels;
    }
    return errors;
  }

  getChannels(): void {
   this.channelsSrv.getRawChannels().pipe(
     take(1))
      .subscribe((c: BasicChannel[]) => {
        this.channels = c;
      });
  }

  onGridReady(evt: any): void {
    this.gridApi = evt.api;
    this.columnApi = evt.columnApi;
    this.gridApi.setRowData(this.channels);
    evt.api.sizeColumnsToFit();
  }
}
