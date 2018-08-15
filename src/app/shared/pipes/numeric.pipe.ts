import { Pipe, PipeTransform } from '@angular/core';
import * as numeral from 'numeral';

@Pipe( { name: 'numeric' } )
export class NumericPipe implements PipeTransform {
  transform( value: string, format: string ): string {
    return numeral( value ).format( format );
  }
}
