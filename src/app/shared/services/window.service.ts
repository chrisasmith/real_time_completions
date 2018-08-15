export class WindowService {
  // Works on all browsers
  static fireResizeEventOnWindow() {
    const evt = document.createEvent( 'HTMLEvents' );
    evt.initEvent( 'resize', true, false );
    window.dispatchEvent( evt );
  }

  // Modern (None IE)
  static dispatchResizeEventOnWindow() {
    window.dispatchEvent( new Event( 'resize' ) );
  }

  static scrollToBottom() {
    const documentHeight = document.documentElement.offsetHeight;
    const viewportHeight = window.innerHeight;
    window.scrollTo(0, documentHeight - viewportHeight);
  }
}
