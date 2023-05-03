/**
 * required data structure needed to properly extend CustomEvent. 
 * Takes a custom subclassed interface of CustomEventDetail excluding
 * the details object as no arguments are passed on dispatched events.
 */
interface NestedScrollEventInit
  extends CustomEventInit<NestedScrollEventDetail> {
  bubbles?: boolean;
  cancelable?: boolean;
  composed?: boolean;
  detail: NestedScrollEventDetail;
}

interface NestedScrollEventDetail {
  offset: number;
  percentage: number;
  totalPages: number;
  currentPage: number;
}

/**
 * Custom Event Class For Scroll Components. A Proper Example to extend Custom 
 * Event to dispatch Events with instantiable custom types.
 * Meant to meet strict ES6 rules.
 */
export class NestedScrollEvent extends CustomEvent<NestedScrollEventDetail> {

  // Dispatchable Event Type
  static readonly UPDATE = 'scroll-update';
  protected init: NestedScrollEventInit;

  /**
   * Instantiate like CustomEvent
   * @param typeName the type name should be the reasonly properties 
   * in this class.
   * @param init The Expected subclass of CustomEventInit to pass
   *  paremeters around.
   */
  constructor(typeName: string, init: NestedScrollEventInit) {
    super(typeName, init);
  }
}