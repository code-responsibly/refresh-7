/**
 * required data structure needed to properly extend CustomEvent. 
 * Takes a custom subclassed interface of CustomEventDetail excluding
 * the details object as no arguments are passed on dispatched events.
 */
interface SiteEventInit extends CustomEventInit {
  bubbles?: boolean;
  cancelable?: boolean;
  composed?: boolean;
}

/**
 * Custom Event Class For Top Level Site Application. A Proper Example 
 * to extend Custom Event to dispatch Events with instantiable custom types.
 * Meant to meet strict ES6 rules.
 */
export class SiteEvent extends CustomEvent<SiteEventInit> {

  // Dispatchable Event Type
  static readonly TRACK_CLICK = 'site-link-clicked';
  static readonly SECTION_OUTRO = 'section-outro';
  static readonly SECTION_INTRO = 'section-intro';

  protected init: SiteEventInit;

  /**
   * Instantiate similarily to CustomEvent
   * @param typeName the type name should be the reasonly properties 
   * in this class.
   * @param init optional. Takes the subclass of CustomEventInit to meet
   * the super class constructor defition.
   */
  constructor(typeName: string, init?: SiteEventInit) {
    super(typeName, init);
    if (init) {
      this.init = init;
    }
  }
}
