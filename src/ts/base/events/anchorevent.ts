import { SectionKeys } from '@base/constants/types';

/**
 * required data structure needed to properly extend CustomEvent. 
 * Takes a custom subclassed interface of CustomEventDetail excluding
 * the details object as no arguments are passed on dispatched events.
 */
interface AnchorEventInit extends CustomEventInit<AnchorEventDetail> {
  bubbles?: boolean;
  cancelable?: boolean;
  composed?: boolean;
  detail: AnchorEventDetail;
}

interface AnchorEventDetail {
  sectionRequested: SectionKeys;
}

/**
 * CustomEvent Class For Anchor Tag. A Proper Example to extend Custom 
 * Event to dispatch Events with instantiable custom types.
 * Meant to meet strict ES6 rules.
 */
export class AnchorEvent extends CustomEvent<AnchorEventDetail> {
  
  // Dispatchable Event Type
  static readonly NOTIFY_SELECTION = 'anchor-item-selected';
  protected init: AnchorEventInit;

  /**
   * Instantiate similarily to CustomEvent
   * @param typeName the type name should be the reasonly properties 
   * in this class.
   * @param init The Expected subclass of CustomEventInit to pass
   *  paremeters around.
   */
  constructor(typeName: string, init: AnchorEventInit) {
    super(typeName, init);
    this.init = init;
  }
}