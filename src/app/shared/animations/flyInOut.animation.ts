import { animate, state, style, transition, trigger } from '@angular/animations';

export const flyInOutAnimation = trigger( 'flyInOutAnimation', [
  state( '*', style( {} ) ),
  transition( 'void => *', [
    style( { transform: 'translateX(-100%)' } ),
    animate( 300 )
  ] ),
  transition( '* => void',
    animate( 300,
      style( { transform: 'translateX(100%)' } ) )
  )
] );
