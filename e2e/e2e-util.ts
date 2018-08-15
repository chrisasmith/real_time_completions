import { browser } from 'protractor';

export class E2EUtils {
  static disableCSSAnimations(): void {
    browser.executeScript(() => {
      const css = `* {
            -webkit-transition-duration: 0s !important;
            transition-duration: 0s !important;
            -webkit-animation-duration: 0s !important;
            animation-duration: 0s !important;
        }`;
        const head = document.head || document.getElementsByTagName('head')[0];
        const style = document.createElement('style');

       style.type = 'text/css';
       style.appendChild(document.createTextNode(css));
       head.appendChild(style);
    });
  }
}

