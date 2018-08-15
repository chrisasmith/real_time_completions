
import {of as observableOf,  Observable } from 'rxjs';

import {take, filter, mergeMap} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthenticationService } from '@apc-ng/core';


@Injectable()
export class AuthGuard implements CanActivate {

  constructor( private authenticationService: AuthenticationService ) {

  }

  canActivate(): Observable<boolean> {
    return this.authenticationService.getAuthEvents().pipe(
      mergeMap(
        event => {
          if ( !event.expired && !event.failed ) {
            return observableOf( true );
          }

          return observableOf( false );
        } ),
      filter( event => event === true ),
      take( 1 ));
  }
}
