import { EventEmitter, Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {finalize} from 'rxjs/operators';


@Injectable()
export class LoadingIndicatorInterceptor implements HttpInterceptor {

  constructor(private loadingIndicatorService: LoadingIndicatorService) {}

  public intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // emit onStarted event before request execution
    this.loadingIndicatorService.onStarted(req);

    return next
      .handle(req)
      // emit onFinished event after request execution
      .pipe(
        finalize(
          () => this.loadingIndicatorService.onFinished(req)
        )
      );
  }

}

@Injectable()
export class LoadingIndicatorService {

  public onLoadingChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Stores all currently active requests
   */
  private requests: HttpRequest<any>[] = [];

  /**
   * Adds request to the storage and notifies observers
   */
  public onStarted(req: HttpRequest<any>): void {
    this.requests.push(req);
    this.notify();
  }

  /**
   * Removes request from the storage and notifies observers
   */
  public onFinished(req: HttpRequest<any>): void {
    const index = this.requests.indexOf(req);
    if (index !== -1) {
      this.requests.splice(index, 1);
    }
    this.notify();
  }

  /**
   * Notifies observers about whether there are any requests on fly
   */
  private notify(): void {
    this.onLoadingChanged.emit(this.requests.length !== 0);
  }

}
