import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatBadgeModule,
  MatButtonModule,
  MatCheckboxModule, MatChipsModule, MatDialogModule,
  MatDividerModule, MatExpansionModule, MatFormFieldModule,
  MatIconModule,
  MatInputModule, MatMenuModule, MatSelectModule,
  MatTabsModule, MatToolbarModule,
  MatTooltipModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,

    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    MatToolbarModule,
    MatExpansionModule,
    MatInputModule,
    MatCheckboxModule,
    MatDialogModule,
    MatTabsModule,
    MatDividerModule,
    MatBadgeModule,
    MatChipsModule,
  ],
  exports: [
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    MatToolbarModule,
    MatExpansionModule,
    MatInputModule,
    MatCheckboxModule,
    MatDialogModule,
    MatTabsModule,
    MatDividerModule,
    MatBadgeModule,
    MatChipsModule

  ],
  declarations: []
})
export class MaterialModule { }
