import {Component, OnDestroy, OnInit} from '@angular/core';
import {AAETDataImage} from './AAET-data-image';
import {AppComponent} from '../app.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: [ './home.component.scss' ],
})

export class HomeComponent implements OnInit, OnDestroy {
  public dataImage: string;

  constructor(public appComponent: AppComponent) {
  }

  ngOnInit() {
    this.dataImage = AAETDataImage;
  }

  ngOnDestroy() {
  }

  public trackByFn( index ): number {
    return index;
  }
}

