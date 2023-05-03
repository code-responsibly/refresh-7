import { Component } from '@base/component';
/**
 * Fuzzy Cursor is a custom cursor component where the element attaches itself
 * to the mouse cursor whenever the user hovers over any anchor elements or
 * elements with nested anchors.
 */
export declare class FuzzyCursor extends Component {
    private cursorInitialized;
    private mouseX;
    private mouseY;
    /**
     * subclassing Component -> CoreElement.
     * @param elementID the indentifier to search for marking the main container
     * of the component.
     */
    constructor(elementID: string);
    /**
     * Check whether or not the cursor has been assigned listeners, is
     * visible, etc.
     * @returns true if the cursor is available
     */
    isCursorInitialized(): boolean;
    /**
     * Alloows the styled custor element to animate at 60fps to the coordinates
     * of the mouse pointer.
     */
    animate(): void;
    /**
     * Initialized the cursor on the method request for the cursor element
     * to display.
     * @param mouseX the horzontal axis the cursor element should appear.
     * @param mouseY the verical axis the cursor element should appear.
     */
    show(mouseX: number, mouseY: number): void;
    /**
     * De-Initializes the cursor and hides it from view.
     */
    hide(): void;
    /**
     * Initializes component by fetching, calculating what's necessary up front.
     * Finds and keeps reference to all anchor tags in the HTML documnet.
     */
    private init;
    /**
     * Applys listeners to all anchor links located in the HTML doc so that
     * the cursor-dedicated element can appear or disappear based on the hover
     * state of any individual link.
     */
    protected applyListeners(): void;
    /**
     * Adds the necesary styled class to the cursor element from when the cursor is over
     * an anchor tag.
     * @param event Mouse Over Event for when the user hovers any and all links.
     */
    private onLinkMouseOverHandler;
    /**
     * Removes the necesary styled class to the cursor element from when the cursor
     * has left an anchor tag.
     * @param event Mouse Out Event for when the user hovers any and all links.
     */
    private onLinkMouseOutHandler;
}
