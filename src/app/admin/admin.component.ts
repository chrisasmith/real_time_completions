import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UserPreferencesService} from '../shared/services/user-preferences.service';
import {Subject, BehaviorSubject, Observable} from 'rxjs';
import {AppConstantsService} from '../app.constants.service';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit, OnDestroy {
  @ViewChild('manageChannels') manageChannels;
  private unsubscribe = new Subject<void>();
  currentTheme = 'dark-theme';

  userCanEdit$: Observable<string>;

  constructor(private userPref: UserPreferencesService,
              private appConstantsService: AppConstantsService) {
    userPref.theme$.asObservable()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(t => {
        this.currentTheme = t;
      });

  }

  ngOnInit(): void {
    this.userCanEdit$ = this.appConstantsService.userRole$;
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
