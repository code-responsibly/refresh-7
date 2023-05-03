/**
 * required data structure needed to properly extend CustomEvent.
 * Takes a custom subclassed interface of CustomEventDetail excluding
 * the details object as no arguments are passed on dispatched events.
 */
interface ThemeEventInit extends CustomEventInit {
    bubbles?: boolean;
    cancelable?: boolean;
    composed?: boolean;
}
/**
 * Custom Event Class For The Theme Manager to notify the main app of updates.
 * A Proper Example to extend Custom Event to dispatch Events with instantiable
 * custom types. Meant to meet strict ES6 rules.
 */
export declare class ThemeEvent extends CustomEvent<ThemeEventInit> {
    static readonly UPDATE = "theme-applied";
    static readonly RANDOM_THEMES_SET = "random-themes-set";
    static readonly RANDOM_THEMES_SET_COMPLETE = "random-theme-set-complete";
    protected init: ThemeEventInit;
    /**
     * Instantiate similarily to CustomEvent
     * @param typeName the type name should be the reasonly properties
     * in this class.
     * @param init optional. Takes the subclass of CustomEventInit to meet
     * the super class constructor defition.
     */
    constructor(typeName: string, init?: ThemeEventInit);
}
export {};
