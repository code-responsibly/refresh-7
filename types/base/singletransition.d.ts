import { Component } from '@base/component';
import { TAnimationProperties } from '@base/constants/types';
/**
 * Single Transition (Not Animations*) allows for an element to have
 * several transition states assigned to it for looping as the user mouses
 * over and off multiple times, for variety purposes.
 */
export declare class SingleTransition extends Component {
    resetTransitionStyle: string;
    useRandomTransitions: boolean;
    private transitions;
    /**
     * subclassing Component -> CoreElement.
     * @param elementID the indentifier to search for marking the main container
     * of the component.
     */
    constructor(elementID: string);
    /**
     * Stores the transiition styling for later application. Initializes and
     * populates the transition variations.
     * @param variantion a data structure descriptor of a type of transition
     */
    createTransitions(variantion: TAnimationProperties): void;
    /**
     * single method to to handle Mouse Enter, Mouse Leave, and Click states.
     * elements transform property is set reset on Mouse Leave, however, Mouse
     * Enter and Click are treated the same and a random or next-in line
     * transition is applied.
     * @param event MouseEvent.CLICK / MOUSE_ENTER / MOUSE_LEAVE
     */
    protected animate(event: MouseEvent): void;
    /**
     * method to handle all functionality needed to appropriately initialized
     * the component. For SingleTransitions, applying the listeners immediately
     * is dependent-critical for the functionality of the component.
     */
    protected init(): void;
    /**
     * Adds listeners to all (or one) HTML Elements found in the component.
     */
    protected applyListeners(): void;
    /**
     * Gets the next transition in the series in circular pattern.
     * @returns the next applicable transition variation.
     */
    private getNextTransition;
    /**
     * Gets the previous transition in the series in circular pattern.
     * @returns the previous applicable transition variation.
     */
    private getpreviousTransition;
    /**
     * Gets a random transition in the series.
     * @returns the next random transition variation that does not repeat the
     * previously selected transition.
     */
    private getRandomTransition;
}
