export interface BasicChannel {
  channel_name?: string;
  plot_min?: number;
  plot_max?: number;
  proper_name?: string;
  default_color?: string;
  default?: boolean;
  show_in_channel_list?: boolean;
  unit?: string;
  decimal_precision?: string;
  data_source?: string;
}

export interface Channel extends BasicChannel {
  value?: string;
  points?: GraphCoordinates;
  hide_trace?: boolean;
  threshold?: GraphCoordinates;
  pump_schedule?: GraphCoordinates;
  show_max_pressure: boolean;
}

export interface GraphCoordinates {
  visible?: boolean;
  x: number[];
  y: number[];
}

export interface ChannelList {
  updateXRange: boolean;
  channels: Channel[];
}
