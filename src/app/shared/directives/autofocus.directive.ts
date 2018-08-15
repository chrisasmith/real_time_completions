import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive( {
  selector: '[appAutofocus]'
} )
export class AutofocusDirective implements OnInit {
  private _autofocus;

  constructor( private elementRef: ElementRef ) {}

  ngOnInit() {
    if ( this._autofocus || typeof this._autofocus === 'undefined' ) {
      setTimeout(() => this.elementRef.nativeElement.focus());
    }
  }

  @Input()
  set appAutofocus(condition: boolean) {
    this._autofocus = !!condition;
  }

  get appAutofocus(): boolean {
    return this._autofocus;
  }

}
