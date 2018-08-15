import { Pipe, PipeTransform } from '@angular/core';
import * as numeral from 'numeral';

@Pipe({
  name: 'scientificNotation'
})
export class ScientificNotationPipe implements PipeTransform {

  transform( value: number,  exponent: number, numberFormat: string): string  {
    const expo = (v, exp) =>  {
      return Number.parseFloat(v).toExponential(exp);
    };

    return value < 0.01 ? expo(value, exponent) : numeral( value ).format( numberFormat );
  }
}
