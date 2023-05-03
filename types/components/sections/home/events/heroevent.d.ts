/**
 * required data structure needed to properly extend CustomEvent.
 * Takes a custom subclassed interface of CustomEventDetail excluding
 * the details object as no arguments are passed on dispatched events.
 */
interface HeroEventInit extends CustomEventInit<HeroEventDetail> {
    bubbles?: boolean;
    cancelable?: boolean;
    composed?: boolean;
    detail: HeroEventDetail;
}
interface HeroEventDetail {
    state: string;
}
/**
 * Custom Event Class For The Home section.
 * A Proper Example to extend Custom Event to dispatch Events with instantiable
 * custom types. Meant to meet strict ES6 rules.
 */
export declare class HeroEvent extends CustomEvent<HeroEventDetail> {
    static readonly HERO_SHRUNK = "shrunk-event";
    static readonly HERO_ENLARGE = "enlarge-event";
    static readonly HERO_ANIMATED = "hero-animation-event";
    /**
     * Instantiate similarily to CustomEvent
     * @param typeName the type name should be the reasonly properties
     * in this class.
     * @param init optional. Takes the subclass of CustomEventInit to meet
     * the super class constructor defition.
     */
    constructor(typeName: string, init?: HeroEventInit);
}
export {};
