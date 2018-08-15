export interface StageComment {
  api: string;
  stage_number: number;
  timestamp: string;
  create_timestamp?: string;
  elapsed_minutes?: number;
  comment: string;
  user?: string;
  userId?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
}
