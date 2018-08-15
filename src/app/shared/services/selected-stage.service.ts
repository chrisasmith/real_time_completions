import {Injectable, Input} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable()
export class SelectedStageService {

  private _selectedStage: BehaviorSubject<any>;
  public selectedStageObservable: Observable<any>;

  constructor() {
    this._selectedStage = new BehaviorSubject( null );
    this.selectedStageObservable = this._selectedStage.asObservable();
  }

  /**
   * Gets the selected well received from the last (or initial) value
   * @returns {any}
   */
  get selectedStage(): any {
    return this._selectedStage.getValue();
  }

  @Input()
  set selectedStage( stage: any ) {
    if (stage != null && stage.hasOwnProperty('wins')) {
      // Emits the selected well
      this._selectedStage.next( stage );
    }
  }

}
