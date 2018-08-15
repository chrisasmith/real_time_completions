export interface Well {
  _id?: string;
  api_no_10?: string;
  name?: string;
  active: boolean;
  wins_no?: string;
  cmpl_no?: string;
  asset_name?: string;
  formation?: string;
  afe_no?: string;
  surface_latitude?: number;
  surface_longitude: number;
  county?: string;
  state?: string;
  pad_name?: string;
  start_date?: string;
  end_date?: string;
}

export interface ActiveWell {
  api: number;
  stage: number;
  wellData: Well;
}
