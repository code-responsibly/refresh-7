import { Section } from '@base/section';
/**
 * Sports Science section of Code Responsibly. Section can be components or
 * contain multiple components.
 * !Sections are qualified by having an id attribute at the parent level or
 * !the first child occurence of the id attribute.
 *
 * <section id='sports-science-analytics'>
 *   ..
 * </section>
 */
export declare class SportsScience extends Section {
    readonly DESKTOP_SCROLL_THRESHOLD: number;
    readonly MOBILE_SCROLL_THRESHOLD: number;
    private burger;
    private bodyTag;
    private htmlTag;
    private sectionScrollIndicator;
    private snapSection;
    private containerScrollListener;
    private containerTouchStartListener;
    private containerTouchMoveListener;
    private panelInView;
    private totalSnapHeight;
    private userTouchY;
    private scrollThreshold;
    /**
     * subclassing Component -> CoreElement.
     * @param elementID the indentifier to search for marking the main container
     * of the component.
     */
    constructor(elementID: string);
    /**
     * sets the out-of-flow section properties so that it may
     * animate in accordingly.
     */
    intro(): void;
    /**
     * Upate the calculated total height of snap containers when necessary such
     * as when a resize happens
     */
    update(): void;
    /**
     * exits the out-of-flow section.
     */
    outro(): void;
    /**
     * Called once to hold onto elements the section needs to prevent
     * further dom calls that could result in repaint or reflow.
     */
    private preventRepaintReflow;
    /**
     * Adds listeners to all (or one) HTML Elements found in the component.
     */
    protected applyListeners(): void;
    /**
     * Calculates the total height of the items added to the snap container.
     * this.totalSnapHeight is used to know when we've scrolled past the max
     * and the out-of-flow section should outro.
     */
    private calculateSnapItems;
    /**
     * Cleans up desktop and mobile listeners initially set up to keep track
     * how far the user has scrolled through the section.
     */
    private cleanupListeners;
    /**
     * Checks to see if the user has exceeded the scrolling threshold after
     * the container scroll percentage has reached 100%.
     * @param event WEB_EVENT_TYPES.WHEEL = WheelEvent 'wheel'
     */
    private containerScrollHandler;
    /**
     * Checks to see when the user has began a touch on mobile
     * devices and stores the vertical positions.
     * @param event WEB_EVENT_TYPES.TOUCH_START = 'touchstart'
     */
    private containerTouchStartHandler;
    /**
     * Checks to see when the user has moved their touch interaction
     * across a moile device and mimics the deltaY provided by
     * window.scrollY.
     * ! Cannot use window.scrollY since the overlay of the section overflow
     * ! hidden on the body tag.
     * @param event WEB_EVENT_TYPES.TOUCH_MOVE = 'touchmove'
     */
    private containerTouchMoveHandler;
    /**
     * Checks to see if user has scrolled beyond the end of the section
     * by testing the scroll against a threshold. if the delta treshold is met,
     * the section outros.
     * @param mode
     * @param userScrollPoint
     */
    private requestOutro;
    /**
     * Handler that takes care of what happens after the section animates in or
     * out. If the section has completed animatining in, the wheel listener is
     * attached for scroll. If the secion has completed animating out, we allow
     * the page to be scrollable and notify the main app that a section has
     * outro'd.
     * @param event WEB_EVENT_TYPES.ANIMATION_ENDED = AnimationEvent 'animationend'
     */
    private panelAnimationHandler;
    /**
     * Allows the user to close the section instead of having to scroll
     * all the way to the very end of the section (where it would then
     * automatically outro.)
     * @param event The click event on the section's burger x menu.
     */
    private onBurgerClickHandler;
}
