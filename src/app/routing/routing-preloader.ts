
import {of as observableOf,  Observable } from 'rxjs';
import { PreloadingStrategy, Route } from '@angular/router';

export class RoutingPreloader implements PreloadingStrategy {
  preload( route: Route, load: Function ): Observable<any> {
    return route.data && route.data.preload ? load() : observableOf( null );
  }
}
