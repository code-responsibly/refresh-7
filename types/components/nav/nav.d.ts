import { Component } from '@base/component';
import { SectionKeys } from '@base/constants/types';
/**
 * The Main Menu of the site including the info boxes surrounding the nav.
 *
 * <nav>
 *   <div class='nav-info-area nav-info-box-styling'>..</div>
 *   <div class='nav-info-desc nav-info-box-styling'>..</div>
 *   <div class='cr-menu'>..</div>
 *  </nav>
 */
export declare class Nav extends Component {
    isNavOpen: boolean;
    private lastDisplayState;
    private info_box_left;
    private info_box_right;
    private bodyTag;
    /**
     * subclassing Component -> CoreElement.
     * @param elementID the indentifier to search for marking the main container
     * of the component. If an elementID is not passed in, we fallback on a
     * default value from or nav-defined data structure.
     */
    constructor(elementId?: string);
    /**
     * Checks to see the nav is closed, and if so, opens the nav and notifies
     * the main app the nav has opened.
     */
    open(): void;
    /**
     * Checks to see the nav is open, and if so, closes the nav and notifies
     * the main app the nav has opened.
     */
    close(): void;
    /**
     * Adds the active state to a nav item since deep linking url can be updated
     * by other means besides selecting items in the nav, such as by user scroll
     * and other elements in different sections.
     * @param id the search key to test against the href tag of the the nav items.
     */
    updateActiveState(id: SectionKeys): void;
    /**
     * Checks for the href tag that matches a section id attribute and forces
     * the MouseEvent click functionality to mimic the user click of a nav item.
     * @param id the search key to test against the href tag of the the nav items.
     */
    forceClickEvent(id: SectionKeys): void;
    /**
     * Updates the nav based on whether we're on desktop or mobile and if
     * the nav is open or not. On mobile, the nav is fullscreen and we prevent
     * scrolling while the nav is open.
     * If the nav is closed on mobile or the new state is desktop, we allow
     * scrolling.
     */
    updateToLayout(): void;
    /**
     * if the hero has shrunk, we want the left info box on the nav to scoot
     * over. If the hero is large, we want the left info box to move back to
     * its original position.
     * @param heroState the state of whether the hero is large or shrunken.
     */
    adjustForHero(heroState: string): void;
    /**
     * Method to handle all functionality needed to appropriately initialized
     * the component. For Nav, adds a doc-level Mouse Click listener to close
     * the nav when the user clicks anywhere on the site.
     */
    private init;
    /**
     * Handler to toggle the menu open or closed when the user clicks the nav
     * hamburger.
     * @param event MouseEvent.CLICK
     */
    private onBurgerClickHandler;
    /**
     * Handler for the doc-level Mouse Click listener that closes the nav
     * if it is open if the user clicks anywhere else besides the burger.
     * @param event MouseEvent.CLICK
     */
    private onClickWhileMenuOpenHandler;
}
