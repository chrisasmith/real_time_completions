import {environment} from '../../../environments/environment';

export const ApiConstants = {
  CHANNELS_API: `${environment.api}/channels/details`,
  BASIN_API: '',
  WELLS_API: `${environment.api}/wells`,
  STAGES_API: `${environment.api}/stages/list`,
  STAGE_PLOT_API: `${environment.api}/stages`,
  DASHBOARD_WELLS_API: `${environment.api}/dashboard/wells`,
  DASHBOARD_STAGES_API: `${environment.api}/dashboard/stages`,
  DASHBOARD_WELL_LOCATIONS_API: `${environment.api}/dashboard/locations`,
  ASSET_API: `${environment.api}/assets`,
  PREFERENCES_API: `${environment.api}/user-preferences`,
  COMMENTS_API: `${environment.api}/stages/comments`,
  PUMPSCHEDULE_API: `${environment.api}/pump-schedules`,
  COST_RESULTS: `${environment.api}/cost-results`,

  APP_VERSION: '1.0.0'
};
