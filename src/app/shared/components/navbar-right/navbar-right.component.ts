import {AfterViewChecked, ChangeDetectorRef, Component, ElementRef, HostBinding, Input, OnInit} from '@angular/core';
import {ConfirmationService} from 'primeng/primeng';

@Component({
  selector: 'app-navbar-right',
  templateUrl: './navbar-right.component.html',
  styleUrls: [ './navbar-right.component.scss' ]
})
export class NavbarRightComponent implements OnInit, AfterViewChecked {
  public pin: boolean;
  public expanded: boolean;
  public showToolbar: boolean;
  @HostBinding( 'class.ipso-navbar-right' ) public additionNavbar = 'true';
  @HostBinding( 'class.open' ) public open: boolean;

  @Input() isVisible = true;
  @Input() openIcon = 'fa-bars';
  @Input() closedIcon = 'fa-times';
  @Input() tooltipText = 'Toggle Menu';
  @Input() invalidStageDetails = false;

  constructor(private elementRef: ElementRef,
              private confirmationService: ConfirmationService,
              private cdr: ChangeDetectorRef) {
    this.pin = false;
    this.open = false;
    // this.expanded = this.coreService.isGroupManagerOpen;
  }

  ngOnInit(): void {
    this.showToolbar = false;
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }
  public get navbarIsOpen(): boolean {
    return this.open;
  }

  public openNavbarRight( event? ): void {
    if (event) {
      event.preventDefault();
    }
    this.open = !this.open;
    if (this.open) {

    }
  }
}
