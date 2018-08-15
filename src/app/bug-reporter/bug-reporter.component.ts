import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FeedbackService} from 'apc-feedback';

@Component({
  selector: 'app-bug-reporter',
  templateUrl: './bug-reporter.component.html',
  styleUrls: ['./bug-reporter.component.scss']
})
export class BugReporterComponent implements OnInit {
  currentTheme = 'dark-theme';
  constructor(private httpClient: HttpClient, private feedbackService: FeedbackService) { }

  ngOnInit() {
    this.feedbackService.openFeedback({
      serverUrl: 'http://houaaetd003.anadarko.com:8090',
      appName: 'Real Time Drilling',
      displayName: 'RTC',
      versionNumber: '0.0.1',
      wikiLink: 'http://sp/corpaffair/apphelp/rtc/Pages/default.aspx',
      httpClient: this.httpClient,
      userName: ''
    });

  }

}
