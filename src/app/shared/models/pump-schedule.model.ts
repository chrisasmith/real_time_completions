export interface Schedule {
  fluid_name?: string;
  gel_weight?: string;
  proppant_conc?: string;
  proppant_name?: string;
  pump_rate?: string;
  pump_schedule_name?: string;
  step_comments?: string;
  step_num?: string;
  step_volume_gal?: string;
}

export interface Validation {
  valid: boolean;
  errors: string[];
  obj: any;
}

export interface PumpSchedule {
  archived?: boolean;
  asset?: string;
  created_by?: string;
  created_date?: string;
  name?: string;
  id?: string;
  schedule?: Schedule[];
}
