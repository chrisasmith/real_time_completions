import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Channel} from '../../shared/models/channel.model';
import {ArrayToObjectService} from '../../shared/services/array-to-object.service';
import {ChannelAction} from '../../shared/models/channel-action';


@Component({
  selector: 'app-channels-list',
  templateUrl: './channels-list.component.html',
  styleUrls: ['./channels-list.component.scss']
})
export class ChannelsListComponent implements OnInit {
  @Input() plottedChannels: Channel[] = [];

  @Input() set availableStageChannels(channels: Channel[]) {
    this._availableStageChannels = this.checkForDuplicate(channels, this.plottedChannels);
    this.defaultFullChannelsList = this.checkForDuplicate(this.defaultFullChannelsList, channels); // this._availableStageChannels);
  }
  get availableStageChannels(): Channel[] {
    return  this._availableStageChannels;
  }

  @Input() defaultFullChannelsList: any[] = [];

  @Output() channelChanged: EventEmitter<ChannelAction> = new EventEmitter<ChannelAction>();

  public _availableStageChannels: any[] = [];


  constructor(private array2Obj: ArrayToObjectService) {
  }

  ngOnInit(): void { }

  public removeFromPlottedChannels({target}, idx: number, channel): void {
    this.channelChanged.emit({type: 'remove', channel});
    this.isPartOfAvailableChannels(channel);
  }

  public addToPlottedChannels({target}, idx: number, channel: any) {
    this.channelChanged.emit({type: 'add', channel});
    this.availableStageChannels.splice(idx, 1);
  }

  public addNoDataChannel({target}, idx: number, channel: any) {
    this.channelChanged.emit({type: 'add', channel});
    this.defaultFullChannelsList.splice(idx, 1);
  }

  private checkForDuplicate(availableChannels = [], defaultPlotChannels = [], key: string = 'channel_name') {
    const plotChannels = this.array2Obj.convert(key, defaultPlotChannels);
    return availableChannels.filter(
      channel => {
        if (!plotChannels.hasOwnProperty(channel[key])) {
          return channel;
        }
      }
    );
  }
  private isPartOfAvailableChannels(channel) {
    if (channel.points.x && channel.points.x.length) {
      this.availableStageChannels.push(channel);
    } else {
      this.defaultFullChannelsList.push(channel);
    }
  }
}
