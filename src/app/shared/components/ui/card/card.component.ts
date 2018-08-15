import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { WindowService } from '../../../services/window.service';

@Component( {
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: [ './card.component.scss' ],
  encapsulation: ViewEncapsulation.Emulated
} )

export class CardComponent implements OnInit, AfterViewInit {

  @Input() cardHeight: string;
  @Input() showHeader = true;
  @Input() showFooter = true;
  @Input() justifyContent = 'center';
  @Input() flexHeader = true;
  @Input() headerBgColor = '';

  fullwidth = false;

  constructor( private elementRef: ElementRef ) {
  }

  ngOnInit() {

  }

  ngAfterViewInit() {

  }

  onExpand() {
    this.fullwidth = !this.fullwidth;

    const hostElem = this.elementRef.nativeElement;
    hostElem.parentNode.style.zIndex = this.fullwidth ? 99999999 : 'inherit';
    hostElem.parentNode.style.transition = 'width 0.5s, height 0.5s';
    hostElem.parentNode.parentNode.style.overflowY = this.fullwidth ? 'hidden' : 'auto';

    setTimeout( () => {
      WindowService.fireResizeEventOnWindow();
    }, 500 );
  }

}
