import { Component } from '@base/component';
/** The Main Hero in the Header section of the site. */
export declare class Hero extends Component {
    readonly SVG = "svg";
    maxHeight: number;
    isShrunk: boolean;
    private _isHeroIntroInProgress;
    private elements;
    private introSvgs;
    private svgIntroCompleteListener;
    private originalHeight;
    /**
     * subclassing Component -> CoreElement.
     * @param elementID the indentifier to search for marking the main container
     * of the component.
     */
    constructor(elementId: string);
    /**
     * method to handle all functionality needed to appropriately initialized
     * the component. For Hero, keeping track of the original height of the logo
     * before any browser resizes.
     */
    private init;
    /**
     * getter for the HTMLElement of the parent element of the hero.
     */
    get logo(): HTMLElement;
    /**
     * getter for if hero intro has begun and is in progress.
     */
    get isHeroIntroInProgress(): boolean;
    /**
     * sets the pcomponents head element and resets the original height.
     */
    set logo(val: HTMLElement);
    /**
     * Intros the SVGs and handles when the SVGs have completed their intro
     */
    intro(): void;
    /**
     * Sets the appropriate css classes to shrink the hero.
     */
    shrink(): void;
    /**
     * Sets the appropriate css classes to immediately jump to the shrink state
     * of the hero.
     */
    forceShrink(): void;
    /**
     * Sets the appropriate css classes to shrink the hero when the
     * menu is open on mobile sized browsers.
     */
    shrinkOnMobileMenuOpen(): void;
    /**
     * Makes the hero large back to the original state.
     */
    enlarge(): void;
    /**
     * resizes the header based on the appropriate ratio by confining it to a
     * maximum height possible when shrunken.
     */
    resize(): void;
    /**
     * Sets up necessary animation listeners for hero intro. Holding the
     * reference to remove if listeners already attached and intro has
     * occurred once.
     */
    protected applyListeners(): void;
    /**
     * Called once to hold onto elements the section needs to prevent
     * further dom calls that could result in repaint or reflow. Loops through
     * all possible elements needed for Hero functionality.
     * ! Uses the generic type to allow access of the HTMLElement by using the
     * ! data structure key name as the property name of elements.
     */
    private preventRepaintReflow;
    /**
     * Handles when the SVG animation of the hero has completed resulting in a
     * rquest for the main hero images to animate in.
     * @param event AnimationEvent.ANIMATION_ENDED
     */
    private svgIntroCompleteHandler;
}
