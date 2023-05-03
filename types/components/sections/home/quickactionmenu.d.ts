import { Component } from '@base/component';
/**
 * Quick Action Menu in the Home Section allows for an top call-to-actions to
 * stand out beyond the items in the nav. The Quick Action animates in and out
 * when the home section enters or exits into viewport.
 */
export declare class QuickActionMenu extends Component {
    private menuItems;
    private transitionEndListener;
    private transitionStartListener;
    private animateOut;
    /**
     * subclassing Component -> CoreElement.
     * @param elementID the indentifier to search for marking the main container
     * of the component.
     */
    constructor(elementId: string);
    /**
     * A single method to handle if the quick action should animate in or out.
     * @param animateOut if set to true, the quick action animates out of the
     * viewport. By default, the menu has animated in upon load.
     */
    animate(animateOut?: boolean): void;
    /**
     * a method intended to be called once to hold onto elements the section
     * needs to prevent further dom calls that could result in repaint or reflow.
     */
    private preventRepaintReflow;
    /**
     * Adds transition listeners only to the first element as it's unneccessary
     * to adda listener to every menuItem. If we know all menu items will animate
     * at the same time for the same amount of time, one listner suffices.
     */
    protected applyListeners(): void;
    /**
     * Handler for when the transition has been initiated to start.
     * @param event TransitionEvent.TRANSITION_RUN
     */
    private transitionStartHandler;
    /**
     * Handler for when the transition has completed.
     * @param event TransitionEvent.TRANSITION_OUT
     */
    private transitionEndHandler;
}
