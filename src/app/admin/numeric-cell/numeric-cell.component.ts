import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';

@Component({
  selector: 'app-numeric-cell',
  templateUrl: './numeric-cell.component.html',
  styleUrls: ['./numeric-cell.component.scss']
})
export class NumericCellComponent implements ICellRendererAngularComp {
  @ViewChild('numeric') eInput: ElementRef;
  constructor() { }

  static isCharNumeric(charStr): boolean {
    return /\d/.test(charStr);
  }

  agInit(params: any): void {
    if (NumericCellComponent.isCharNumeric(params.charPress)) {
      this.eInput.nativeElement.value = params.charPress;
    } else {
      if (params.value !== undefined && params.value !== null) {
        this.eInput.nativeElement.value = params.value;
      }
    }
  }

  afterGuiAttached(): void {
    this.eInput.nativeElement.focus();
  }
  refresh(): boolean {
    return false;
  }
  getValue(): any {
    return this.eInput.nativeElement.value;
  }
  isPopup(): boolean {
    return false;
  }
  focusIn(): void {
    this.eInput.nativeElement.focus();
    this.eInput.nativeElement.select();
  }
  focusOut(): void {

  }
  destroy(): void { }

}
