
import {of as observableOf, BehaviorSubject, Observable, Subject} from 'rxjs';
import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Channel} from '../../models/channel.model';
import {takeUntil} from 'rxjs/operators';


@Component({
  selector: 'app-horizontal-scroller',
  templateUrl: './horizontal-scroller.component.html',
  styleUrls: ['./horizontal-scroller.component.css']
})
export class HorizontalScrollerComponent implements OnInit, OnDestroy {

  pnProductNav: HTMLElement;
  pnProductNavContents: HTMLElement;
  scrollAxisBy: number;
  contentLeftEdge = 0;
  contentRightEdge = 0;
  overflowDirection: string;

  private unsubscribe = new Subject<void>();
  private _overflowDirection: BehaviorSubject<string>;

  @ViewChild('scrollContainer') scrollContainer: ElementRef;
  @ViewChild('scrollContainerContent', { read: ElementRef }) scrollContainerContent: ElementRef;
  @ViewChild('contentItem') contentItem: ElementRef;
  @ViewChild('advanceLt') advanceLt: ElementRef;
  @ViewChild('advanceRt') advanceRt: ElementRef;

  @Input() _itemsToScroll: Channel[];

  @Input() set itemsToScroll(channels: Channel[]) {
    if (channels) {
      this._itemsToScroll = channels;
      this.overflowDirection = this.determineOverflow(this.scrollContainerContent.nativeElement, this.scrollContainer.nativeElement);
      if (this.pnProductNavContents) {
        this.transitionContent('right');
      }
    }
  }
  constructor() {
  }

  ngOnInit() {
    this.pnProductNavContents = this.scrollContainerContent.nativeElement;
    this.pnProductNav = this.scrollContainer.nativeElement;
    this.transitionContent('right');
    this.getPlottedItems()
      .pipe(
        takeUntil(this.unsubscribe)
      )
      .subscribe(channel => {
        this.overflowDirection = this.determineOverflow(this.scrollContainerContent.nativeElement, this.scrollContainer.nativeElement);
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
  getPlottedItems() {
    return observableOf(this._itemsToScroll);
  }

  advancerLeft(): void {
    this.scrollAxisBy =  (this.pnProductNav.scrollLeft <= 150) ? this.pnProductNav.scrollLeft : 150;
    this.transitionContent('left');
  }

  advancerRight(): void {
    this.scrollAxisBy =  ((this.contentRightEdge - this.pnProductNav.scrollLeft) <= 150) ? (this.contentRightEdge - this.pnProductNav.scrollLeft) : 150;
    this.transitionContent('right');
  }

  transitionContent(navBarTravelDirection: string = 'right'): void {
    this.pnProductNavContents.classList.add('scroll-content-no-transition');
    this.pnProductNav.setAttribute('data-overflowing', this.determineOverflow(this.pnProductNavContents, this.pnProductNav));
    if (navBarTravelDirection === 'left') {
      this.pnProductNav.scrollLeft = this.pnProductNav.scrollLeft - this.scrollAxisBy;
    } else {
      this.pnProductNav.scrollLeft = this.pnProductNav.scrollLeft + this.scrollAxisBy;
    }

    this.overflowDirection = this.determineOverflow(this.scrollContainerContent.nativeElement, this.scrollContainer.nativeElement);
  }

  determineOverflow(content, container): string {
    this.contentLeftEdge = 0;
    this.contentRightEdge = (container.scrollWidth - container.clientWidth);
    if (container.scrollLeft > this.contentLeftEdge && container.scrollLeft < this.contentRightEdge) {
      return 'both';
    } else if (container.scrollLeft > this.contentLeftEdge) {
      return 'left';
    } else if (container.scrollLeft < this.contentRightEdge) {
      return 'right';
    } else {
      return 'none';
    }
  }
}
