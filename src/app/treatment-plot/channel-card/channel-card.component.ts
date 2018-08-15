import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {Channel} from '../../shared/models/channel.model';
import {LoadingIndicatorService} from '../../shared/services/loading-indicator.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-channel-card',
  templateUrl: './channel-card.component.html',
  styleUrls: ['./channel-card.component.scss']
})
export class ChannelCardComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() info: Channel;
  @Input() isActive = false;
  @Output() optionsEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() toggleLine: EventEmitter<any> = new EventEmitter<any>();

  showLine = true;
  isLoading = false;
  isLoadingSub: Subscription;

  @ViewChild('value') private valueEl: ElementRef;
  @ViewChild('valueDeltaEl') private valueDeltaEl: ElementRef;

  private mutationObs: MutationObserver;

  constructor(private loadingService: LoadingIndicatorService) {
    this.isLoadingSub = loadingService.onLoadingChanged.subscribe(isLoading => this.isLoading = isLoading);
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.observeValueChanges();
  }

  ngOnDestroy(): void {
    this.isLoadingSub.unsubscribe();
  }

  animationEnd() {
    this.valueDeltaEl.nativeElement.style.opacity = 0;
  }

  channelOptions(channel: Channel, evt: MouseEvent) {
    evt.stopImmediatePropagation();
    evt.stopPropagation();
    this.optionsEvent.emit({type: 'open', channel });
  }

  formatValue(decimalPlaces: string): string {
    decimalPlaces = decimalPlaces || '0';
     return `1.${decimalPlaces}-${decimalPlaces}`;
  }

  onToggleLine(evt) {
    evt.stopPropagation();
    this.toggleLine.emit({
      type: 'hide-line',
      channel: this.info,
      action: this.info.points.visible
    });
  }

  private observeValueChanges() {
   const node = this.valueEl.nativeElement;
    this.mutationObs = new MutationObserver(mut => {
      mut.forEach(m => this.calculateDelta(m));
    });
    this.mutationObs.observe(node, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true,
      characterDataOldValue: true
    });
  }

  private calculateDelta(m: MutationRecord) {
    this.valueDeltaEl.nativeElement.style.opacity = 1;
    this.valueDeltaEl.nativeElement.innerHTML = '';
    const oldVal = parseFloat(m.oldValue.replace(',', ''));
    const newVal = parseFloat(m.target.nodeValue.replace(',', ''));
    const val = newVal - oldVal;
    const valueDelta = val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2);
    const flashClass = newVal > oldVal ? 'increase-animation' : 'decrease-animation';
    this.valueDeltaEl.nativeElement.innerHTML = `<span class="delta-box ${flashClass}">${valueDelta}</span>`;
  }
}
