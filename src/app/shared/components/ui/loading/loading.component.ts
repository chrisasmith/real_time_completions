import {Component, OnDestroy} from '@angular/core';
import {LoadingIndicatorService} from '../../../services/loading-indicator.service';
import {Subscription} from 'rxjs';

@Component( {
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: [ './loading.component.scss' ]
} )
export class LoadingComponent implements OnDestroy {

  loading = false;
  loadSub: Subscription;

  constructor(public loadingIndicatorService: LoadingIndicatorService) {
    this.loadSub = loadingIndicatorService
      .onLoadingChanged
      .subscribe( isLoading => {
        setTimeout(() => this.loading = isLoading);
      });
  }

  ngOnDestroy(): void {
    this.loadSub.unsubscribe();
  }
}
