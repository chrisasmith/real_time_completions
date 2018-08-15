import { Component, Input } from '@angular/core';

@Component( {
  selector: 'app-anchor-icon',
  templateUrl: 'anchor-icon.component.html',
  styleUrls: [ './anchor-icon.component.scss' ]
} )

export class AnchorIconComponent {
  @Input() attrId: string;
  @Input() icon: string;
}
