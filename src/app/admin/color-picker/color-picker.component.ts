import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NumericCellComponent} from '../numeric-cell/numeric-cell.component';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements OnInit {
  @ViewChild('picker') picker: ElementRef;
  params; any;
  linkColor: string;
  constructor() { }

  ngOnInit() {
  }
  agInit(params: any): void {
    this.params = params;
   this.picker.nativeElement.value = this.linkColor = params.value;
    // this.linkColor = params.value;
  }

  setColor(evt): void {
    this.params.context.componentParent.setColor({channel_name: this.params.node.data.channel_name, rowNumber: this.params.node.rowIndex, columnName: this.params.colDef.field, newColor: evt.target.value});
  }

  refresh(): boolean {
    return false;
  }
  destroy(): void { }
}
