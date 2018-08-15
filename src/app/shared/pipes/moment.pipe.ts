import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe( { name: 'moment' } )
export class MomentPipe implements PipeTransform {
  transform( value: string, format: string ): string {
    if ( moment( value ).isValid() ) {
      return moment( value ).format( format );
    } else {
      console.log( `Invalid date: ${value}` );
      return value;
    }
  }
}
