
import {map, filter} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, RouterEvent} from '@angular/router';
import {Observable} from 'rxjs';

@Injectable()
export class RouterUtilsService {

  constructor(private route: ActivatedRoute,
              private router: Router) {}

  getParamStream(): Observable<any> {
    return this.router.events.pipe(
      filter((evt: RouterEvent) => evt instanceof NavigationEnd),
      map(() => this.getFullTreeParams(this.route)));
  }

  getFullTreeParams(route: ActivatedRoute, params = {}) {
    if (route) {
      params = {...params, ...route.snapshot.params};
    }
    if (route.children.length) {
      return route.children
        .map(child => this.getFullTreeParams(child, params))
        .reduce((acc, el) => ({...acc, ...el}), {});
    }
    return params;
  }

  resolveRouteString(routeStr: string, paramMap: any): string {
    const parts = routeStr.split('/');
    if (!paramMap) {
      paramMap = this.getFullTreeParams(this.route.root);
    }
    const keys = Object.keys(paramMap);
    return parts.map((el) => {
      const stripped = el.replace(':', '');
      if (keys.indexOf(stripped) > -1) {
        return paramMap[stripped];
      } else {
        return el;
      }
    }).join('/');
  }
}
