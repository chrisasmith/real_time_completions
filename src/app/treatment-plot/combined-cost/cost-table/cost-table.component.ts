import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ColumnApi, GridApi} from 'ag-grid';

@Component({
  selector: 'app-cost-table',
  templateUrl: './cost-table.component.html',
  styleUrls: ['./cost-table.component.scss']
})
export class CostTableComponent implements OnInit {
  gridApi: GridApi;
  columnApi: ColumnApi;
  context;
  frameworkComponents;
  columnDefs: any[];
  rowData: any[];
  defaultColDef: { suppressMenu?: boolean; editable?: boolean } = { };

  @Input() currentTheme = 'dark-theme';
  @Input() set setDefaultColDefs(defs: any) {
    this.defaultColDef = defs;
  }
  @Input() set setColumnDefs(defs: any[]) {
    this.columnDefs = defs;
  }
  @Input() set setRowData(data: any[]) {
    this.rowData = data;
  }

  @Output() cellValueChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() rowValueChanged: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  changedCellValue({oldValue, rowIndex, newValue, data, column: { colId: columnId }}): void {
    this.cellValueChanged.emit({ rowIndex, columnId, oldValue, newValue, data });
  }

  changedRowValue(evt): void {
    this.rowValueChanged.emit({ row: evt });
  }

  onGridReady(evt: any): void {
    this.gridApi = evt.api;
    this.columnApi = evt.columnApi;
    this.gridApi.setRowData(this.rowData);
    evt.api.sizeColumnsToFit();
  }

}
