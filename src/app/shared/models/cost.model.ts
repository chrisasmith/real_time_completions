export interface FixedCost {
  base_cost?: number;
  description?: string;
  quantity?: number;
  total_cost?: number;
  item_uom?: string;
  multiplier_type?: string;
  data_source_units?: string;
}

export interface VariableCost extends FixedCost {
  ratio: number;
  assigned_channel?: string;
  assigned_channel_list?: [null];
}

export interface CombinedCost {
  fixed_costs?: FixedCost[];
  variable_costs?: VariableCost[];
}
