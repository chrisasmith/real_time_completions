import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ChannelsService} from '../shared/services/channels.service';

@Injectable()
export class ChannelsResolver {
  constructor(private channelService: ChannelsService) {}
  resolve(): Observable<any> | Promise<any> | any {
    return this.channelService.getChannels();
  }
}
