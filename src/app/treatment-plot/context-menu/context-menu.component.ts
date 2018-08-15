import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {ContextMenu} from 'primeng/primeng';
import {ChartRef} from '../../shared/models/chart-ref.model';
import {AddCommentComponent} from './add-comment/add-comment.component';
declare let Plotly: any;

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss'],
})
export class ContextMenuComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('menu') contextMenu: ContextMenu;

  @Input() plot: ChartRef;
  @Input() userCanEdit = false;

  @Output() addComment: EventEmitter<any> = new EventEmitter<any>();
  @Output() stageStartChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() stageEndChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() pumpScheduleStartChanged: EventEmitter<any> = new EventEmitter<any>();

  menuItems: any = [];

  currentData: number;

  constructor() { }

  ngOnInit() {
    this.menuItems = [
      {
        label: 'Export as png',
        icon: 'fa-image',
        command: () => {
          this.downloadImg('png', 'treatment-plot');
        }
      },
      ...this.addEditOptions(this.userCanEdit)
    ];
  }

  ngOnDestroy(): void {
    this.plot.chart.removeEventListener('contextmenu', this.openCtxMenu);
  }

  ngAfterViewInit(): void {
    this.plot.chart.addEventListener('contextmenu', this.openCtxMenu);
  }

  addEditOptions(userCanEdit: boolean = false): any[] {
    if (userCanEdit) {
      return [
        {separator: true},
        {
          label: '', // elapsed minutes... dynamically calculated
          icon: 'fa-clock-o',
          items: [
            {
              label: 'Set as Stage Start',
              command: () => {
                this.stageStartChanged.emit({idx: this.currentData});
              },
              icon: 'fa-flag'
            },
            {
              label: 'Set as Stage End',
              command: () => {
                this.stageEndChanged.emit({idx: this.currentData});
              },
              icon: 'fa-flag-checkered'
            },
            {
              label: 'Set as Pump Schedule Start',
              command: () => {
                this.pumpScheduleStartChanged.emit({idx: this.currentData});
              },
              icon: 'fa-calendar'
            },
            {
              label: 'Add Comment',
              command: () => {
                this.addComment.emit({idx: this.currentData});
              },
              icon: 'fa-comment'
            },
          ],
        }
      ];
    } else {
      return [];
    }
  }

  openCtxMenu = (evt: any): void => {
    evt.preventDefault();

    if (this.plot.chart && this.plot.chart._hoverdata && this.plot.chart._hoverdata.length) {
      this.currentData = this.plot.chart._hoverdata[0].pointIndex;
      if (this.userCanEdit) {
        this.menuItems[2].disabled = false;
        this.menuItems[2].label = `Actions for Minute: ${this.plot.chart._hoverdata[0].x}`;
      }

    } else {
      if (this.userCanEdit) {
        this.menuItems[2].disabled = true;
        this.menuItems[2].label = 'Actions for Minute: 0';
      }

    }
    this.contextMenu.toggle(evt);
  }


  downloadImg(format: 'png' | 'jpeg', filename: string): void {
    Plotly.toImage(this.plot.chart, { format }).then(img => {
      const link = document.createElement('a');
      link.setAttribute('href', img);
      link.setAttribute('download', `${filename}.${format}`);
      link.click();
    });
  }
}


/*
{separator: true},
      {
        label: '', // elapsed minutes... dynamically calculated
          icon: 'fa-clock-o',
        items: [
        {
          label: 'Set as Stage Start',
          command: () => {
            this.stageStartChanged.emit({idx: this.currentData});
          },
          icon: 'fa-flag'
        },
        {
          label: 'Set as Stage End',
          command: () => {
            this.stageEndChanged.emit({idx: this.currentData});
          },
          icon: 'fa-flag-checkered'
        },
        {
          label: 'Set as Pump Schedule Start',
          command: () => {
            this.pumpScheduleStartChanged.emit({idx: this.currentData});
          },
          icon: 'fa-calendar'
        },
        {
          label: 'Add Comment',
          command: () => {
            this.addComment.emit({idx: this.currentData});
          },
          icon: 'fa-comment'
        },
      ],
      }
 */
