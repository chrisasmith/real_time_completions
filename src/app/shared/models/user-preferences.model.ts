import {ChannelPreferences} from './channel-preferences.model';

export class UserPreferences {
  color?: string;
  theme?: string;
  channelPreferences?: { [name: string]: ChannelPreferences };
}
