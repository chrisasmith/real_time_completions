import * as numeral from 'numeral';

export class NumeralHelperService {

  static numberCellFormatter( data ) {
    return numeral( data.value ).format( '0,0.00' );
  }

  static format( value, format ) {
    return numeral( value ).format( format );
  }
}
