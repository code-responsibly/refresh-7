import { TCoreContainer } from '@base/constants/types';
/**
 * A CoreElement Class is defined as one or more containers with key
 * modular functionality that all compoents can subclass and share
 * commonality.
 */
export declare class CoreElement extends EventTarget {
    belongsToSeries: boolean;
    protected _container: TCoreContainer;
    protected seriesKey: string;
    protected mobileClickListeners: Function[];
    protected mobileMouseLeaveListeners: Function[];
    private mobileReadyElements;
    /**
     * subclassing EventTarget.
     * @param elementID the indentifier to search for marking the top-most
     * container which indicates to the app is a valid section.
     */
    constructor(elementID?: string);
    /**
     * gets a complex data structure of TCoreContainer which contains
     * head:HTMLElement, children: HTMLElement[].
     */
    get container(): TCoreContainer;
    /**
     * Sets the complex data structure or takes a string that gets passed to
     * handle setting up container as a proper data type of TCoreContainer.
     */
    set container(val: TCoreContainer | string);
    /**
     * Checks to see if a string is a valid class or id in the HTML.
     * @param searchKey the expected selector that belongs to an element tag.
     * @returns the searchKey with the correct selector prefix if it is
     * valid within the HTML.
     */
    getValidSelector(searchKey: string): string | undefined;
    /**
     * Checks to see if a string is a valid class or id in the HTML.
     * @param searchKey the expected class or id that belongs to an element tag.
     * @returns true if the selector is valid in the HTML.
     */
    doesSelectorQualify(searchKey: string): boolean;
    /**
     * Checks the string for proper formatting of a css selector and then tests
     * to see if the key exists in the HTML as a proper identifier of a single
     * or series of elements.
     * @param searchKey the expected class or id that belongs to an element tag.
     * @returns all occurrences, if any, of TCoreContainer that includes a
     * single occurence(TCoreContainer.head) or multiple occurrences
     * (TCoreContainer.children).
     *
     * ! Head will always be assigned the first occurence whether it is
     * ! at the top-most containet level or the first child that has the
     * ! classname or id attribute.
     */
    protected getQualifiedSelector(searchKey: string): TCoreContainer | null;
    /**
     * Converts TCoreContainer: head, children[] as an array series of
     * HTMLElement
     * @returns a easy to access stack to iterate over all containers that share
     * the same key instead of using head / children accessors.
     */
    protected getAllContainers(): HTMLElement[];
    /**
     * Allows for mobile to experience the desktop hover states when the user
     * touches the element. Adds the appropriate interaction listeners assigned
     * to any container that have the class attribute of 'mobile-ready'.
     *
     * ! mobile-ready is one of two site-wide class names that extend beyond
     * ! styling and determine functionality.
     */
    protected applyMobileHoverClickListeners(): void;
    /**
     * Removes listeners that enable the mobile experience of users touch
     * enabling the hover states assigned to any container that has the class
     * attribute of 'mobile-ready'.
     *
     * ! mobile-ready is one of two site-wide class names that extend beyond
     * ! styling and determine functionality.
     */
    protected removeMobileHoverClickListeners(): void;
    /**
     * Uses a partial  match to search for a potential class name. If found,
     * removes the class name from the elements classlist.
     * @param element element to test the search against
     * @param prefix the partial matich of the class name we're looking for
     */
    protected removeClassByPrefix(element: HTMLElement, prefix: string): void;
    /**
     * The handler toggles mobile-click which is tied to our hover states in
     * CSS. This is to mimic the functionality of mouse_over and mouse_leave on
     * mobile devices.
     * @param event MouseEvent.CLICK
     */
    protected mobileClickHandler(event: MouseEvent): void;
    /**
     * The handler remove the mobile-click class to mimic the mouse_leave
     * or 'hover off' functionality available on desktop.
     * @param event MouseEvent.MOUSE_LEAVE
     */
    protected mobileMouseLeaveHandler(event: MouseEvent): void;
}
