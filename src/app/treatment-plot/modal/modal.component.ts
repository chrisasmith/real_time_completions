
import {take} from 'rxjs/operators';
import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {Channel} from '../../shared/models/channel.model';
import {UserPreferencesService} from '../../shared/services/user-preferences.service';
import {ChannelPreferences} from '../../shared/models/channel-preferences.model';

import {ToasterService} from 'angular2-toaster';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import * as _ from 'lodash';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  // channel: Channel;

  @Input() set info(info) {
    /*this.channel = Object.assign({}, info);
    this.channel.hide_trace = !!this.channel.hide_trace;*/
  }

  @Output() closeModal: EventEmitter<any> = new EventEmitter<any>();
  @Output() applyChanges: EventEmitter<any> = new EventEmitter<any>();
  @Output() toggleLine: EventEmitter<any> = new EventEmitter<any>();

  showLine = true;
  channel: Channel;

  constructor(
    private preferencesService: UserPreferencesService,
    private toasterSvc: ToasterService,
    private dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) channel: Channel) {
    this.channel = _.cloneDeep(channel);
  }

  ngOnInit() {

  }

  savePreferences() {
    this.preferencesService.setChannelPreferences(this.channel as ChannelPreferences).pipe(
      take(1))
      .subscribe(() => {
        this.toasterSvc.pop('success', 'Preferences Successfully Saved');
        this.applyClicked();
      });
  }

  applyClicked() {
    this.applyChanges.emit({type: 'apply', channel: Object.assign({}, this.channel)});
    this.closeClicked();
  }

  closeClicked() {
    // this.closeModal.emit({type: 'close', channel: {}});
    this.dialogRef.close({ type: 'close', channel: {}});
  }

  onToggleLine() {
    this.channel.hide_trace = !this.channel.hide_trace;
    this.toggleLine.emit({
      type: 'hide-line',
      channel: this.channel,
      action: this.channel.hide_trace
    });
  }
}
