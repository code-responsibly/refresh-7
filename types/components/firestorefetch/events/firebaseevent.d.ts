/**
 * required data structure needed to properly extend CustomEvent.
 * Takes a custom subclassed interface of CustomEventDetail excluding
 * the details object as no arguments are passed on dispatched events.
 */
interface FirebaseEventInit extends CustomEventInit<FirebaseEventDetail> {
    bubbles?: boolean;
    cancelable?: boolean;
    composed?: boolean;
    detail?: FirebaseEventDetail;
}
interface FirebaseEventDetail {
    record: string | number;
}
/**
 * CustomEvent Class For FirebaseEvent. A Proper Example to extend Custom
 * Event to dispatch Events with instantiable custom types.
 * Meant to meet strict ES6 rules.
 */
export declare class FirebaseEvent extends CustomEvent<FirebaseEventDetail> {
    static readonly RECORD_FETCHED = "firebase-record-fetched";
    static readonly RECORD_UPDATED = "firebase-record-updated";
    static readonly AUTHENTICATED = "firebase-authenticated";
    /**
     * Instantiate similarily to CustomEvent
     * @param typeName the type name should be the reasonly properties
     * in this class.
     * @param init optional. Takes the subclass of CustomEventInit to meet
     * the super class constructor defition.
     */
    constructor(typeName: string, init?: FirebaseEventInit);
}
export {};
