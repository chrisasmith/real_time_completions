import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BugReporterComponent} from './bug-reporter.component';
import {RouterModule, Routes} from '@angular/router';
import {FeedbackModule} from 'apc-feedback';


const routes: Routes = [
  {
    path: ':asset/bug',
    component: BugReporterComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    FeedbackModule,
    CommonModule
  ],
  declarations: [
    BugReporterComponent
  ],
  exports: [
    FeedbackModule,
    BugReporterComponent
  ]
})
export class BugReporterModule { }
