import { Component } from '@base/component';
import { TCoreContainer } from '@base/constants/types';
/**
 * Single Animation (Not Transition*) allows for an element to have an intro,
 * rollover and rollout animation classes along with support for mouse-over /
 * mouse-out transition styles.
 */
export declare class OverlayAnimation extends Component {
    basePath: string;
    rollOverTransitionStyle: string;
    rollOutTransitionStyle: string;
    introAnimationClass: string;
    rollOverAnimationClass: string;
    rollOutAnimationClass: string;
    private _assetPath;
    private base;
    private overlay;
    private introAnimationEventListener;
    private hoverAnimationEventListener;
    private mouseEventListener;
    private activeTheme;
    private animationInProgress;
    private onHover;
    private queueAnimation;
    private animationInProgressState;
    /**
     * subclassing Component -> CoreElement.
     * @param elementID the indentifier to search for marking the main container
     * of the component.
     */
    constructor(elementID?: string);
    /**
     * !required to override the setter while strict-true
     * gets a complex data structure of TCoreContainer which contains
     * head:HTMLElement, children: HTMLElement[].
     */
    get container(): TCoreContainer;
    /**
     * Forces an assetPath safe guard check before setting container.
     */
    set container(element: TCoreContainer);
    /**
     * returns the path of assets, ideally, the current theme's assets.
     */
    get assetPath(): string;
    /**
     * Correcly creates the path of the assets by supporting dynamic subfolders
     */
    set assetPath(val: string);
    /**
     * animates in the component's overlay element if an intro animation class
     * is set.
     * @param delay how long should we wait in seconds before animating an intro.
     */
    intro(delay?: number): void;
    /**
     * If the theme updates, assumes image paths need to update as different
     * theme styles for the component may require better looking assets.
     * @param theme a theme from the Theme Manager or a string value that matches
     * themes that are defined in CSS Variables.
     */
    update(theme: string, assetPath: string): void;
    /**
     * Adds necessary mouse interaction listeners and listeners relating to
     * the animation listeners of intro, click,and hover. Holding the reference
     * to remove if listeners already attached or listeners are being added and
     * removed as the component enter/exit the viewport.
     */
    protected applyListeners(): void;
    /**
     * remove all mouse interaction and animation listeners.
     */
    protected removeListeners(): void;
    /**
     * Handler takes care of mouse over, mouse out, and click actions. To prevent
     * animation skipping on CSS animation keyframes, we check to see if an
     * animation is in progress and queue it up from when the previous animation
     * ends.
     *
     * !The user can quickly hover on and off the element, and we keep track of the
     * !the last hover state to know which animation needs to be queued: Over or Off
     * !state.
     * @param event MouseEvent.CLICK, MOUSE_ENTER, MOUSE_LEAVE
     */
    protected onMouseInteraction(event: MouseEvent): void;
    /**
     * method to handle all functionality needed to appropriately initialize
     * the component.
     */
    private init;
    /**
     * Called once to hold onto elements the component needs to prevent
     * further dom calls that could result in repaint or reflow.
     */
    private preventRepaintReflow;
    /**
     * updates the src tag of an image element.
     * @param image the image element to be updated.
     * @param source the image name that belongs in a specific theme folder.
     */
    private updateImageSource;
    /**
     * Sets the appropriate hover transition by updating the transform.
     *
     * !purposely not using a class for variety purposes as the class already
     * !uses animation clss as an example.
     * !SingleTransition uses css class for transition properties as an example.
     */
    private setHoverTransition;
    /**
     * Sets the appropriate hover animation by updating the classlist if
     * a rollout and rollover animation classes have been set.
     *
     * The method can also handle queued calls. If the user is hovered and the
     * animationInProgressState is unhover, we exit gracefully to not disrupt the
     * animation.
     * If the user is unhovered and animationInProgressState is hovered, we exit
     * gracefully to not disrupt the animation.
     */
    private setHoverAnimation;
    /**
     * Handles when the hover animations have completed. If there is
     * an animation queued,  we set the appropriate transition and
     * animation states.
     * @param event AnimationEvent.ANIMATION_ENDED
     */
    private hoverAnimationComplete;
    /**
     * Handles when the intro animations have completed. Checks to see if there's
     * a queued animation that happened in the midle of the intro. If so, we
     * set the appropriate transition and animation states.
     * @param event AnimationEvent.ANIMATION_ENDED
     */
    private introAnimationComplete;
    /**
     * Animation reset need to occur after animation classes are added or
     * removed to the classlist to force reruns.
     * @param element the element that needs a reflow.
     */
    private resetAnimation;
}
