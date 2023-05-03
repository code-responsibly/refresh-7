import { ScrollComponent } from '@base/scrollcomponent';
/**
 * PrincipleItems are siblings to the parent component that share the same tag
 * structure. Checks for when a single element enters into the viewport via
 * IntersectionObserver, and animates in various elements that make up a single
 * Principle Item.
 */
export declare class PrincipleItems extends ScrollComponent {
    private svgs;
    /**
     * subclassing ScrollComponent -> Component -> CoreElement.
     * @param elementID the indentifier to search for marking the main container
     * of the component.
     */
    constructor(elementID?: string);
    /**
     * Animates any necessary elements.
     * @todo interface this method (implments IPrincipleItem)
     */
    intro(): void;
    /**
     * Handle all functionality needed to appropriately initialized the
     * component. For PrincipeItems, we fetch all SVGs and set the correct
     * size after the font is applied to the text tag.
     * !SVG  width and height attributes cannot be predetermined in
     * !the HTML due to the font / bounding box varying for each text tag.
     * !Obviously, every svg tag should alwyas have a width/height attribute.
     */
    protected init(): void;
    /**
     * The handler that checks for when an entry enters into the viewport at
     * 20% visibility. Animates in the Index Number, the Title, and Copy that
     * make up the elements of a Single Principle Item.
     * @param entries A series of items the IntersectionObserver is aware of.
     * @param observer the IntersectionObserver that chekcs for entries entering
     * into the viewport.
     */
    protected observerCallbackHandler(entries: IntersectionObserverEntry[], observer: IntersectionObserver): void;
    /**
     * Aligns SVGs to the baseline by setting the appropriate width and height
     * on every svg tag after the font renders the text tag.
     *
     * !SVGs are used for the index number of the principle in view.  The width
     * ! and height are different for every SVG. We figure it out after it's
     * ! been applied due to font of SVG varying the the width and height.
     */
    protected repositionSVGTextBox(): void;
}
