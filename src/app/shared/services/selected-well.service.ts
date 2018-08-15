import { Injectable, Input } from '@angular/core';
import { BehaviorSubject ,  Observable } from 'rxjs';





/**
 * The service enables subscribing to a Well and
 * setting a well selection from any component in the application.
 */
@Injectable()
export class SelectedWellService {
  private _selectedWell: BehaviorSubject<any>;
  public selecteWellObservable: Observable<any>;

  constructor() {
    this._selectedWell = new BehaviorSubject( null );
    this.selecteWellObservable = this._selectedWell.asObservable();
  }

  /**
   * Gets the selected well received from the last (or initial) value
   * @returns {any}
   */
  get selectedWell(): any {
    return this._selectedWell.getValue();
  }

  @Input()
  set selectedWell( well: any ) {
    if (well != null && well.hasOwnProperty('wins')) {
      // Emits the selected well
      this._selectedWell.next( well );
    }
  }

}
