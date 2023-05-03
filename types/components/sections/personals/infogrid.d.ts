import { ScrollComponent } from '@base/scrollcomponent';
/**
 * InfoGrid represents the grid items in The Personals section of the site.
 * Children of the parent component that share the same tag
 * structure. Checks for when a single element enters into the viewport via
 * IntersectionObserver, and animates in various elements that make up a single
 * Grid Item.
 */
export declare class InfoGrid extends ScrollComponent {
    /**
     * subclassing ScrollComponent -> Component -> CoreElement.
     * @param elementID the indentifier to search for marking the main container
     * of the component.
     */
    constructor(elementID: string);
    /**
     * Animates any necessary elements.
     * @todo interface this method (implments IPrincipleItem)
     */
    intro(): void;
    /**
     * The handler that checks for when an entry enters into the viewport at
     * 25% visibility. Loops through ever element
     * @param entries A series of items the IntersectionObserver is aware of.
     * @param observer the IntersectionObserver that chekcs for entries entering
     * into the viewport.
     */
    protected observerCallbackHandler(entries: IntersectionObserverEntry[], observer: IntersectionObserver): void;
}
