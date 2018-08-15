import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import {Moment} from 'moment';

export class DateHelperService {
  // Moment
  static momentFormat( date, format: string = 'L' ) {
    if ( moment( date ).isValid() ) {
      return moment( date.value ).format( format );
    } else {
      console.log( `Invalid date: ${date}` );
      return date;
    }
  }

  // Angular
  static transformDate( date: Date, inputFormat: string ): string {
    const datePipe = new DatePipe( 'en-US' );
    const transformedDate = datePipe.transform( date, inputFormat );
    return transformedDate;
  }

  static doDateRangesOverlap (aStart: Moment, aEnd: Moment, bStart: Moment, bEnd: Moment): boolean {
    return aStart.isSameOrBefore(bEnd) && aEnd.isSameOrAfter(bStart);
  }
}
