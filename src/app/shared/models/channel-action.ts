import {Channel} from './channel.model';

export interface ChannelAction {
  type: String;
  channel: Channel;
}

export interface ChannelOptions {
  type: String;
  channel: Channel;
}
