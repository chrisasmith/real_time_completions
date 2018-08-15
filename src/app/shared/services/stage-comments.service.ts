import { Injectable } from '@angular/core';
import {ApiConstants} from './api-constants.service';
import {StageComment} from '../models/stage-comment.model';
import {AuthHttpClient} from '@apc-ng/core/lib';
import {Observable} from 'rxjs';

@Injectable()
export class StageCommentsService {

  constructor(private http: AuthHttpClient) { }

  getComments(api: string, stage: number): Observable<StageComment[]> {
    return this.http.get(`${ApiConstants.COMMENTS_API}/${api}/${stage}`);
  }

  addComment(comment: StageComment): Observable<StageComment[]> {
    return this.http.post(ApiConstants.COMMENTS_API, comment);
  }

  deleteComment(comment: StageComment): Observable<StageComment[]> {
    return this.http.delete(`${ApiConstants.COMMENTS_API}/${comment.api}/${comment.stage_number}/${comment.timestamp}`);
  }
}
