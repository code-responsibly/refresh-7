import { CoreElement } from '@base/coreelement';
import { TCoreContainer } from '@base/constants/types';
/**
 * A Component Class is defined as one or more containers with key
 * modular functionality that all compoents can subclass and share
 * commonality.
 */
export declare class Component extends CoreElement {
    protected _links: HTMLAnchorElement[];
    protected linklisteners: Function[];
    private collectionID;
    private toggleGrouping;
    /**
     * subclassing CoreElement -> EventTarget.
     * @param elementID the indentifier to search for marking the main container
     * of the component.
     */
    constructor(elementID?: string);
    /**
     * gets a complex data structure of TCoreContainer which contains
     * head:HTMLElement, children: HTMLElement[].
     */
    get container(): TCoreContainer;
    /**
     * Sets the complex data structure or takes a string that gets passed to the
     * superclass setter that handles defining the TCoreContainer.
     */
    set container(val: TCoreContainer | string);
    /**
     * returns any links identified at the component level.
     */
    get links(): HTMLAnchorElement[];
    /**
     * Looks for all the anchor elements in a collection, stores them for later
     * references, and applys necessary listeners to all anchor tags dound.
     * @param collectionID the parent tag that has a collection of anchor tags.
     * @param allowActiveStateToggle if set true, will pass the active class to
     * any future selected item, and remove the active class if exists on any
     * anchor elements within the same collection.
     */
    protected setLinks(collectionID: string, allowActiveStateToggle?: boolean): void;
    /**
     * Looks at collection of nested links by tag type and sets the active class
     * to the selected HTMLAchnorElement.
     * @param parentLinkID the tag name that includes a collection of children
     * anchor tags
     * @param selected the selected item within the collection.
     * @returns null if a collection has not be set
     */
    protected setActiveForSelected(parentLinkID: string, selected: HTMLAnchorElement): void;
    /**
     * Removes anty pre-existing link listeners and re-applies listeners.
     * Ideally, this is for when a new collection is being addressed.
     */
    protected applyListeners(): void;
    /**
     * Adds listeners if HTMLAnchorElements are set.
     * @param collectionID the parent tag that has a collection of children
     * anchor tags.
     * @returns null if there are no links found or collection tag of possible
     * children anchor tags was not set.
     */
    private applyLinkListeners;
    /**
     * Removes any listeners at the component element.
     */
    protected removeListeners(): void;
    /**
     * Removes any existing listeners attached to links belonging to a collection
     * @returns null if there are no listeners
     */
    private removeLinkListeners;
    /**
     * Checks an HTMLAnchorElement to see if the class attribute has passed a
     * special class to force prevent-default action.
     * !There are only two special classes  typescript checks for to determine
     * !extended functionality: 'prevent-default' and 'mobile-ready'.
     * @param link the Anchor Element to check if 'prevent-default' is assigned.
     * @returns true if the special class of prevent-default exists.
     */
    protected checkForPreventDefaultClass(link: HTMLAnchorElement): boolean;
    /**
     * the handler for when an anchor tag is selected. Checks to see if
     * preventDefault exists at the class attribute level of the element or if
     * the parameter forces preventDefault, then dispatches an event to notify
     * the parent class that a selection has been made within the instaniated
     * component.
     * @param event MouseEvent.CLICK
     * @param parentLinkID the parent tag that has a collection of anchor tags.
     * @param preventDefault if the selected anchor element should prevent
     * default action.
     */
    protected activeLinkHandler(event: MouseEvent, parentLinkID: string, preventDefault?: boolean): void;
}
