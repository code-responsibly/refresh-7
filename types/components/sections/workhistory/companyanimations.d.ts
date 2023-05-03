import { Component } from '@base/component';
/**
 * CompanyAnimations represents the company elements in the grid of the Work
 * History section of the site. Children of the parent component that share
 * the same tag structure.
 *
 * Sets queue capable functionality for when a user clicks(desktop / mobile),
 * hovers on and off the component gracefully manages animation and
 * transitions to prevent skips or jumps for when a user hovers on and off
 * quickly or clicks repeatedly on the element during transition/animation.
 *
 * !This purposely uses style.transform for transitions and classes for
 * !animations to showcase an age old CSS problem of how to queue
 * !transitions and animations and prevent user breaks.
 * !For example of css transition-based(not animation) class property
 * !handling, please review SingleTransition.ts
 */
export declare class CompanyAnimations extends Component {
    private companies;
    /**
     * subclassing Component -> CoreElement.
     * @param elementID the indentifier to search for marking the main container
     * of the component.
     */
    constructor(elementID: string);
    /**
     * Animates in the companies in a grid with a delay.
     */
    intro(): void;
    /**
     * Special case of when the theme updates, this component will need
     * to update image paths to update theme specific images.
     *
     * !Filter combinations of saturate, brightness, etc. did not give the
     * !desired effects so falling back on images for the best assets
     * !to align to the color schemes of a theme.
     * @param theme a theme from the Theme Manager or a string value that matches
     * themes that are defined in CSS Variables.
     */
    updateTheme(theme: string): void;
    /**
     * method to handle all functionality needed to appropriately initialized
     * the component.
     */
    private init;
    /**
     * Called once to hold onto elements the component needs to prevent
     * further dom calls that could result in repaint or reflow.
     *
     * Loops through all the containers and creates instanecs of
     * OverlayAnimation. Assigns all the properties needed for
     * OverlayAnimation to deliver transition and animation styling
     * simultaneously.
     */
    private preventRepaintReflow;
}
