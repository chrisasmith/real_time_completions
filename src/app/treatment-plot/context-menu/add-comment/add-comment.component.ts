import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import * as _ from 'lodash';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.scss']
})
export class AddCommentComponent implements OnInit {
  mode: 'edit' | 'add';
  commentData: any;

  constructor(@Inject(MAT_DIALOG_DATA) data: any) {
    this.commentData = _.cloneDeep(data);
  }

  ngOnInit() {
    this.mode = this.commentData.comment ? 'edit' : 'add';
  }
}
