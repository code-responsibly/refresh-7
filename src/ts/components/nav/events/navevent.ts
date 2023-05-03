/**
 * required data structure needed to properly extend CustomEvent.
 * Takes a custom subclassed interface of CustomEventDetail excluding
 * the details object as no arguments are passed on dispatched events.
 */
interface NavEventInit extends CustomEventInit<NavEventDetail> {
  bubbles?: boolean;
  cancelable?: boolean;
  composed?: boolean;
  detail: NavEventDetail;
}

interface NavEventDetail {
  isNavOpen: boolean;
}

/**
 * Custom Event Class For Main Nav.
 * A Proper Example to extend Custom Event to dispatch Events with instantiable
 * custom types. Meant to meet strict ES6 rules.
 */
export class NavEvent extends CustomEvent<NavEventDetail> {
  // Dispatchable Event Type
  static readonly OPEN_MENU = 'nav-menu-opened';
  protected init: NavEventInit;

  /**
   * Instantiate like CustomEvent
   * @param typeName the type name should be the reasonly properties
   * in this class.
   * @param init The Expected subclass of CustomEventInit to pass
   *  paremeters around.
   */
  constructor(typeName: string, init: NavEventInit) {
    super(typeName, init);
    this.init = init;
  }
}
