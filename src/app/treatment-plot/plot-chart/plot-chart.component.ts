
import {timer as observableTimer, Observable, Subscription} from 'rxjs';
import {
  Component, ElementRef, HostListener, Input, Output, OnDestroy, OnInit, ViewChild, EventEmitter, NgZone,
  ChangeDetectionStrategy
} from '@angular/core';
import {Channel} from '../../shared/models/channel.model';
import {ChartRef} from '../../shared/models/chart-ref.model';
import {StageComment} from '../../shared/models/stage-comment.model';
import {PlotChartService} from './services/plot-chart.service';
import {ChannelsService} from '../../shared/services/channels.service';
declare let Plotly: any;
import * as _ from 'lodash';

@Component({
  selector: 'app-plot-chart',
  templateUrl: './plot-chart.component.html',
  styleUrls: ['./plot-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ PlotChartService ]
})
export class PlotChartComponent implements OnInit, OnDestroy, ChartRef {
  public chart;

  private dataForChart: any;

  private readonly TICK_FONT_SIZE = 16;
  private readonly TITLE_FONT_SIZE = 16;

  private layout: any = {
    size: 18,
    showlegend: false,
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    margin: {
      t: 50,
    },
    autosize: true,
    xaxis: {
      title: 'ELAPSED MINUTES',
      size: 18,
      titlefont: {
        color: '#626f86',
        size: this.TITLE_FONT_SIZE,
      },
      tickfont: {
        color: '#626f86',
        size: this.TICK_FONT_SIZE,
      },
      anchor: 'free',
      showgrid: false,
      zeroline: true,
      domain: [0, 1],
      range: [0, this.max],
      autorange: false,
    },
  };

  private chartConfig = {
    showLink: false,
    editable: false,
    displayModeBar: false,
    displaylogo: false,
    doubleClick: false
  };

  private _max: number;
  private _comments: StageComment[] = [];
  private _showComments = false;
  private _showHoverData = true;

  @ViewChild('tchart') chartElem: ElementRef;
  @Input() options: any = {};
  @Input() set max(val: number) {
    this._max = val;
    if (val) {
      this.buildStartAndEndLines();
    }
  }
  get max(): number {
    return this._max;
  }
  plottedChannels: Channel[] = [];
  @Input() set _plottedChannels(channels) {
    if (channels) {
      this.plottedChannels = channels.channels;
      this.drawChart(channels.channels, channels.updateXRange);
    }
  }

  @Input() set liveData(data) {
    if (this.plottedChannels.length) {
      this.batchExtendPlotTrace(data);
    }
  }

  @Input() set updates(update) {
    if (update) {
      this.updateTrace(update);
    }
  }
  @Input() set currentYAxis(yaxis: string) {
    if (this.chart) {
      this.hideAllYAxis();
      this.chart.layout[yaxis].visible = true;
      this.chart.layout[yaxis].fixedrange = false;
      this.ngZone.runOutsideAngular(() => Plotly.redraw(this.chart));
    }
  }

  @Input() set comments(comments: StageComment[]) {
    this._comments = comments || [];
    if (this.showComments) {
      this.buildComments(this._comments.map((comment: StageComment) => comment.elapsed_minutes));
    }
  }

  get comments(): StageComment[] {
    return this._comments;
  }

  @Input() set showComments(shouldShow: boolean) {
    this._showComments = shouldShow;
    const comments = shouldShow ? this.comments.map((comment: StageComment) => comment.elapsed_minutes) : [];
    this.buildComments(comments);
  }

  get showComments(): boolean {
    return this._showComments;
  }

  private _showMaxPressure: boolean;
  @Input() set showMaxPressure(shouldShow: boolean) {
    this._showMaxPressure = shouldShow;
  }

  get showMaxPressure(): boolean {
    return this._showMaxPressure;
  }

  @Input() set showHoverData(val: boolean) {
    this._showHoverData = val;
    Plotly.restyle(this.chart, { hoverinfo: val ? 'all' : 'none' });
  }

  get showHoverData(): boolean {
    return this._showHoverData;
  }

  @Input() showCursorXLine: boolean;
  @Input() showCursorYLine: boolean;
  private _active = true;
  @Input() set active(active: boolean) {
    this._active = active;
    this.buildStartAndEndLines();
  }

  @Output() commentClicked: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    private chartService: PlotChartService,
    private channelService: ChannelsService,
    private ngZone: NgZone) { }

  ngOnInit(): void {
    this.addPlotEventListeners();
  }

  ngOnDestroy() {
    this.removePlotEventListeners();
  }

  addPlotEventListeners(): void {
    this.chart.on('plotly_clickannotation', (data) => {
      this.ngZone.run(() => this.selectComment(data.index));
    });
    this.ngZone.runOutsideAngular(() => {
      this.chart.on('plotly_afterplot', () => {
        this.chartService.renderIcons();
      });
      this.chart.on('plotly_relayout', () => {
        this.chartService.renderIcons();
      });
      this.chart.on('plotly_doubleclick', () => {
        this.updateXaxisDomain(!this.layout.xaxis.autorange);
      });
      this.chart.addEventListener('mousemove', this.addHoverLines);
      this.chart.addEventListener('mouseout', this.removeHoverLines);
    });
  }

  removePlotEventListeners(): void {
    this.chart.removeEventListener('mousemove', this.addHoverLines);
    this.chart.removeEventListener('mouseout', this.removeHoverLines);
  }

  addHoverLines = (data: MouseEvent): void => {
    const chartBounds = Plotly.d3
      .select(this.chart)
      .select('.cartesianlayer')
      .node()
      .getBBox();

    if (this.showCursorXLine) {
      this.drawSolidLine('mousexline', data.layerX, 0, data.layerX, chartBounds.height);
    }
    if (this.showCursorYLine) {
      this.drawSolidLine('mouseyline', 0, data.layerY, chartBounds.width, data.layerY);
    }
  }

  removeHoverLines = (): void => {
    Plotly.d3.select('.mousexline').remove();
    Plotly.d3.select('.mouseyline').remove();
  }

  drawSolidLine(name: string, x1, y1, x2, y2) {
    const exists: boolean = !!Plotly.d3.select(this.chart).select(`.${name}`).node();
    if (!exists) {
      Plotly.d3.select(this.chart)
        .select('.cartesianlayer')
        .append('line')
        .attr('class', name)
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .style('stroke', '#626f86')
        .style('stroke-width', '0.5');
    } else {
      Plotly.d3.select(this.chart)
        .select(`.${name}`)
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .style('stroke', '#626f86')
        .style('stroke-width', '0.5');
    }
  }

  selectComment(idx: number, relative: boolean = false): void {
    const self = this;
    if (relative) {
      idx = this.chartService.getIndexRelativeToAllMarkers(idx, 'comment');
    }
    if (this.chartService.getTypeByIndex(idx) === 'comment') {
      Plotly.d3.selectAll('.annotation').datum(function (el, i) {
        const node = Plotly.d3.select(this).select('text');
        if (i === idx) {
          node.style('fill', 'rgb(222, 153, 26)');
          if (!relative) {
            self.commentClicked.emit(self.chartService.getIndexRelativeToType(idx, 'comment'));
          }
        } else {
          if (self.chartService.getTypeByIndex(i) === 'comment') {
            node.style('fill', 'rgb(55, 128, 191)');
          }
        }
      });
    }
  }

  buildComments(xVals: number[]): void {
    this.chartService.createMarkers(xVals, 'rgb(55, 128, 191)', 'comment');
    this.ngZone.runOutsideAngular(() => this.chartService.relayout(this.chart));
  }

  buildStartAndEndLines(): void {
    // start flag
    this.chartService.createMarkers([0], '#22f184', 'start');
    // end flag
    if (!this._active && this.max) {
      this.chartService.createMarkers([this.max], '#bf1727', 'end');
    } else {
      this.chartService.removeMarkersByType('end');
    }
    this.ngZone.runOutsideAngular(() => this.chartService.relayout(this.chart));
  }

  toggleShowHide(): void {
    this.chart.data.forEach(t => {
      if (t.rtcType === 'threshold') {
        t.visible = this.channelService.channelObj[t.id].threshold.visible;
      } else if (t.rtcType === 'pumpSchedule') {
        t.visible = this.channelService.channelObj[t.id].pump_schedule.visible;
      } else {
        t.visible = this.channelService.channelObj[t.id].points.visible;
      }
    });
    this.updateXaxisDomain();
  }

  updateXaxisDomain(autorange: boolean = false): void {
    let xMaxRange: number;
    if (this._active) {
      xMaxRange = this.max < 200 ? 240 : this.max;
    } else {
      xMaxRange = this.max;
    }
    this.ngZone.runOutsideAngular(() => {
      Plotly.relayout(
        this.chart,
        {
          xaxis: {
            title: 'ELAPSED MINUTES',
            size: 18,
            titlefont: {
              color: '#626f86',
              size: this.TITLE_FONT_SIZE,
            },
            tickfont: {
              color: '#626f86',
              size: this.TICK_FONT_SIZE,
            },
            anchor: 'free',
            showgrid: false,
            zeroline: true,
            domain: [0, 1],
            range: [0, xMaxRange],
            autorange,
          },
        }
      );
    });
  }

  @HostListener('window:resize')
  onResize() {
    if (this.chart) {
      Plotly.Plots.resize(this.chart);
    }
  }

  private drawChart(channels: Channel[], updateXRange: boolean = true): void {
    this.chart = this.chartElem.nativeElement;
    const channelData = this.createDataObjForChart(channels, 'points');
    const thresholdData = this.createDataObjForChart(channels, 'threshold').filter(el => el);
    const psData = this.createDataObjForChart(channels, 'pump_schedule').filter(el => el);
    this.dataForChart = [ ...channelData, ...thresholdData, ...psData ];
    this.createGraph(updateXRange);
  }

  private createGraph(updateXRange: boolean): void {
    this.ngZone.runOutsideAngular(() => Plotly.react(this.chart,  this.dataForChart,  this.layout, this.chartConfig));
    if (updateXRange) {
      this.updateXaxisDomain();
    } else {
      Plotly.relayout(this.chart, {});
    }
  }
  private createDataObjForChart(channels: Channel[], prop: string): any {
    return channels.map(
      (channel, idx) => {
        // Update the layout object
        this.createTraceLayoutForChannel(channel, idx);
        this.plottedChannels[idx].value = !channel.points.y.length ? '0' : String(channel.points.y[channel.points.y.length - 1]);
        return this.createTraceForChannel(channel, idx, prop);
      }
    );
  }

  private createTraceLayoutForChannel(channel: Channel, idx: number): void {
    const isFirst = idx < 1;
    const axis = isFirst ? 'yaxis' : `yaxis${idx + 1}`;
    this.layout[axis] = {
      title: channel.proper_name.toUpperCase(),
      titlefont: {size: this.TITLE_FONT_SIZE, color: channel.default_color},
      tickfont: {size: this.TICK_FONT_SIZE, color: channel.default_color},
      range: [channel.plot_min, channel.plot_max],
      visible: isFirst,
      fixedrange: !isFirst,
      position: 0,
      zeroline: true,
      showgrid: false,
    };

    if (!isFirst) {
      this.layout[axis].anchor = 'free';
      this.layout[axis].overlaying = 'y';
      this.layout[axis].side = 'left';
    }
  }

  private createTraceForChannel(channel: Channel, idx: number, prop: string = 'points'): any {
    if (!channel[prop]) { return null; }

    const trace: any = {
      x: channel[prop].x,
      y: channel[prop].y,
      hoverinfo: this.showHoverData  ? 'all' : 'none',
      id: channel.channel_name,
      name: channel.proper_name,
      type: 'linear',
      visible: channel[prop].visible,
      line: {
        color: channel.default_color
      }
    };

    if (idx > 0) {
      trace.yaxis = 'y' + (idx + 1);
    }
    if (!channel[prop].x.length && !channel[prop].y.length) {
      // delete trace.x;
      // delete trace.y;
    }
    if (prop === 'threshold') {
      trace.line.dash = 'dash';
      trace.rtcType = 'threshold';
    }

    if (prop === 'pump_schedule') {
      trace.line.dash = 'dot';
      trace.rtcType = 'pumpSchedule';
    }
    return trace;
  }

  private updateTrace(properties: Channel): void {
    const traceColors: any = {};
    let idx: number;
    let lineColor: string;
    this.plottedChannels.forEach(
      (pchannel, index) => {
        /**
         * copy properties from settings modal's copy of the channel
         * to the actual channel.  We don't want to copy the actual
         * points arrays here or they will lose referential integrity
         */
        if (pchannel.proper_name === properties.proper_name) {
          pchannel.default = properties.default;
          pchannel.plot_max = properties.plot_max;
          pchannel.plot_min = properties.plot_min;
          pchannel.default_color = properties.default_color;
          idx = index;
          lineColor = properties.default_color;
          const axis = index < 1 ? 'yaxis' : `yaxis${index + 1}`;
          this.layout[axis] =  Object.assign(this.layout[axis], {
            titlefont: {size: this.TITLE_FONT_SIZE, color: properties.default_color},
            tickfont: {size: this.TICK_FONT_SIZE, color: properties.default_color},
            range: [properties.plot_min, properties.plot_max],
          });
        }
      }
    );

    if (idx && lineColor) {
      Plotly.restyle(this.chart, { 'line.color': lineColor }, [idx]);
      Plotly.relayout(this.chart, {});
    }
  }

  private hideAllYAxis(): void {
    for (const axis of Object.keys(this.layout)) {
      if (!axis.toString().indexOf('yaxis')) {
        this.chart.layout[axis].visible = false;
        this.chart.layout[axis].fixedrange = true;
      }
    }
    Plotly.redraw(this.chart);
    // Plotly.relayout(this.chart, this.chart.layout);
  }
  private extendPlotTrace(data): void {
    if (!data) { return; }
    const x = data.elapsed_minutes;
    data.channels.forEach(d =>  {
      if (this.channelService.channelObj[d.prop_name]) {
        this.channelService.channelObj[d.prop_name].points.x.push(x);
        this.channelService.channelObj[d.prop_name].points.y.push(d.value);
      }
    });

    const newValues = {
      x: [],
      y: []
    };
    this.chart.data.forEach(channel => {
      const val: any = _.find(data.channels, { prop_name: channel.id});
      const newY = val ? parseInt(val.value, 10) : 0;
      newValues.x.push([x]);
      newValues.y.push([newY]);
      this.channelService.channelObj[channel.id].value = newY;
    });
    Plotly.extendTraces(
      this.chart,
      newValues,
      Array.from(
        {length: this.chart.data.length},
        (v, k) => k
      )
    );
  }

  private batchExtendPlotTrace(dataArr): void {
    for (let i = 0; i < dataArr.length; i++) {
      const el = dataArr[i];
      const x = el.elapsed_minutes;
      for (let ii = 0; ii < el.channels.length; ii++) {
        const d = el.channels[ii];
        if (this.channelService.channelObj[d.prop_name]) {
          this.channelService.channelObj[d.prop_name].points.x.push(x);
          this.channelService.channelObj[d.prop_name].points.y.push(d.value);
          this.channelService.channelObj[d.prop_name].value = d.value;
        }
      }
    }
    Plotly.extendTraces(this.chart, { x: [], y: [] }, []);
  }
}
