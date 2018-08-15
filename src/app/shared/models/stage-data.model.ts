import {Channel} from './channel.model';

export interface ChannelPlotKeyValue {
  prop_name: string;
  value: any;
}

export interface StageData {
  current_time: number;
  elapsed_minutes: number;
  channels: ChannelPlotKeyValue[];
}
