import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ConfirmationModalComponent} from '../components/confirmation-modal/confirmation-modal.component';
import {MatDialog} from '@angular/material';

@Injectable()
export class ConfirmationService {

  constructor(public dialog: MatDialog) {}

  confirm(msg: string = 'Are you sure?', titleMsg: string = 'Confirmation'): Observable<boolean> {
    const cfg = {
      data: {
        confirmationMsg: msg,
        titleMsg: titleMsg
      }
    };
    return this.dialog.open(ConfirmationModalComponent, cfg).afterClosed();
  }
}
