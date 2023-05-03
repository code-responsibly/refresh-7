import {TypeGuard} from '@abstract/typeguard';
import {Component} from '@base/component';
import {TCoreContainer, WEB_EVENT_TYPES} from '@base/constants/types';

/**
 * Single Animation (Not Transition*) allows for an element to have an intro,
 * rollover and rollout animation classes along with support for mouse-over /
 * mouse-out transition styles.
 */
export class OverlayAnimation extends Component {
  //base path of image assets to update the overlay HTMLElement
  public basePath: string;
  //Mouse Over transition styling applied to container.head.style.transform
  public rollOverTransitionStyle: string;
  //Mouse Out transition styling applied to container.head.style.transform
  public rollOutTransitionStyle: string;
  //intro animation class applied to  overlay HTMLElement's classList
  public introAnimationClass: string;
  //Mouse Over animation class applied to  overlay HTMLElement's classList
  public rollOverAnimationClass: string;
  //Mouse Out animation class applied to  overlay HTMLElement's classList
  public rollOutAnimationClass: string;

  //image path to update the overlay HTMLElement
  private _assetPath: string;

  private base: HTMLElement;
  private overlay: HTMLElement;
  private introAnimationEventListener: (event: AnimationEvent) => void;
  private hoverAnimationEventListener: (event: AnimationEvent) => void;
  //Handles click for mobile-touch
  private mouseEventListener: (event: MouseEvent) => void;
  private activeTheme: string;

  private animationInProgress = false;
  private onHover = false;
  private queueAnimation = false;
  private animationInProgressState = '';

  /**
   * subclassing Component -> CoreElement.
   * @param elementID the indentifier to search for marking the main container
   * of the component.
   */
  constructor(elementID = '') {
    super(elementID);

    if (this.container !== undefined) {
      this.init();
    }
  }

  /**
   * !required to override the setter while strict-true
   * gets a complex data structure of TCoreContainer which contains
   * head:HTMLElement, children: HTMLElement[].
   */
  public override get container(): TCoreContainer {
    return super.container;
  }

  /**
   * Forces an assetPath safe guard check before setting container.
   */
  public override set container(element: TCoreContainer) {
    if (this.basePath === undefined) {
      throw Error('-> Base Path Not Set On Single Animation Instance');
    }
    super.container = element;
    this.init();
  }

  /**
   * returns the path of assets, ideally, the current theme's assets.
   */
  public get assetPath(): string {
    return this._assetPath;
  }

  /**
   * Correcly creates the path of the assets by supporting dynamic subfolders
   */
  public set assetPath(val: string) {
    this._assetPath = this.basePath + "/" + val;
  }

  /**
   * animates in the component's overlay element if an intro animation class
   * is set.
   * @param delay how long should we wait in seconds before animating an intro.
   */
  public intro(delay = 0): void {
    if (this.introAnimationClass === undefined) {
      throw Error(
        '-> Intro Animation Class Not Set On Single Animation Instance'
      );
    }

    this.onHover = false;
    this.queueAnimation = false;

    this.resetAnimation(this.overlay);
    this.animationInProgress = true;
    this.overlay.style.animationDelay = delay + 's';
    this.overlay.classList.add(this.introAnimationClass);
  }

  /**
   * If the theme updates, assumes image paths need to update as different
   * theme styles for the component may require better looking assets.
   * @param theme a theme from the Theme Manager or a string value that matches
   * themes that are defined in CSS Variables.
   */
  public update(theme: string, assetPath:string): void {
    this.activeTheme = theme;
    this.assetPath = assetPath;

    this.updateImageSource(
      this.base,
      TypeGuard.guardForNull(this.base.dataset.source)
    );
    this.updateImageSource(
      this.overlay,
      TypeGuard.guardForNull(this.overlay.dataset.source)
    );
  }

  /**
   * Adds necessary mouse interaction listeners and listeners relating to
   * the animation listeners of intro, click,and hover. Holding the reference
   * to remove if listeners already attached or listeners are being added and
   * removed as the component enter/exit the viewport.
   */
  protected override applyListeners(): void {
    if (this.mouseEventListener != null) {
      this.removeListeners();
    }

    this.mouseEventListener = (event: MouseEvent) =>
      this.onMouseInteraction(event);
    this.introAnimationEventListener = (event: AnimationEvent) =>
      this.introAnimationComplete(event);
    this.hoverAnimationEventListener = (event: AnimationEvent) =>
      this.hoverAnimationComplete(event);

    this.container.head.addEventListener(
      WEB_EVENT_TYPES.MOUSE_ENTER,
      this.mouseEventListener
    );
    this.container.head.addEventListener(
      WEB_EVENT_TYPES.MOUSE_LEAVE,
      this.mouseEventListener
    );
    this.container.head.addEventListener(
      WEB_EVENT_TYPES.CLICK,
      this.mouseEventListener
    );
    this.overlay.addEventListener(
      WEB_EVENT_TYPES.ANIMATION_ENDED,
      this.introAnimationEventListener
    );
  }

  /**
   * remove all mouse interaction and animation listeners.
   */
  protected override removeListeners(): void {
    this.overlay.removeEventListener(
      WEB_EVENT_TYPES.ANIMATION_ENDED,
      this.introAnimationEventListener
    );
    this.overlay.removeEventListener(
      WEB_EVENT_TYPES.ANIMATION_ENDED,
      this.hoverAnimationEventListener
    );
    this.container.head.removeEventListener(
      WEB_EVENT_TYPES.MOUSE_ENTER,
      this.mouseEventListener
    );
    this.container.head.removeEventListener(
      WEB_EVENT_TYPES.MOUSE_LEAVE,
      this.mouseEventListener
    );
    this.container.head.removeEventListener(
      WEB_EVENT_TYPES.CLICK,
      this.mouseEventListener
    );

    this.mouseEventListener = () => {};
    this.introAnimationEventListener = () => {};
    this.hoverAnimationEventListener = () => {};
  }

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
  protected onMouseInteraction(event: MouseEvent): void {
    switch (event.type) {
      case WEB_EVENT_TYPES.MOUSE_ENTER:
        this.onHover = true;
        break;
      case WEB_EVENT_TYPES.MOUSE_LEAVE:
        this.onHover = false;
        break;
      case WEB_EVENT_TYPES.CLICK:
        if (this.animationInProgress === false) {
          this.onHover = this.onHover === true ? false : true;
        }
        break;
      default:
        break;
    }

    if (this.animationInProgress === true) {
      this.queueAnimation = true;
      return;
    } else {
      this.animationInProgress = true;
      this.setHoverTransition();
      this.setHoverAnimation();
    }
  }

  /**
   * method to handle all functionality needed to appropriately initialize
   * the component.
   */
  private init(): void {
    this.preventRepaintReflow();
    this.applyListeners();
  }

  /**
   * Called once to hold onto elements the component needs to prevent
   * further dom calls that could result in repaint or reflow.
   */
  private preventRepaintReflow(): void {
    this.base = TypeGuard.guardForNull(
      this.container.head.querySelector('img:nth-child(1)')
    );
    this.overlay = TypeGuard.guardForNull(
      this.container.head.querySelector('img:nth-child(2)')
    );

    this.updateImageSource(
      this.base,
      TypeGuard.guardForNull(this.base.dataset.source)
    );
    this.updateImageSource(
      this.overlay,
      TypeGuard.guardForNull(this.overlay.dataset.source)
    );
  }

  /**
   * updates the src tag of an image element.
   * @param image the image element to be updated.
   * @param source the image name that belongs in a specific theme folder.
   */
  private updateImageSource(image: HTMLElement, source: string): void {
    (image as HTMLImageElement).src = this.assetPath + '/' + source;
  }

  /**
   * Sets the appropriate hover transition by updating the transform.
   *
   * !purposely not using a class for variety purposes as the class already
   * !uses animation clss as an example.
   * !SingleTransition uses css class for transition properties as an example.
   */
  private setHoverTransition(): void {
    this.container.head.style.transform =
      this.onHover === true
        ? this.rollOverTransitionStyle
        : this.rollOutTransitionStyle;
  }

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
  private setHoverAnimation(): void {
    if (this.rollOutAnimationClass === undefined) {
      throw Error(
        '-> Roll Out Animation Class Not Set On Single Animation Instance'
      );
    }

    if (this.rollOverAnimationClass === undefined) {
      throw Error(
        '-> Roll Over Animation Class Not Set On Single Animation Instance'
      );
    }

    if (this.onHover === true) {
      if (this.animationInProgressState === 'hover') {
        this.animationInProgress = false;
        return;
      }
      this.resetAnimation(this.overlay);
      this.overlay.classList.remove(this.rollOutAnimationClass);
      this.overlay.classList.add(this.rollOverAnimationClass);
      this.animationInProgressState = 'hover';
    } else {
      if (this.animationInProgressState === 'unhover') {
        this.animationInProgress = false;
        return;
      }
      this.resetAnimation(this.overlay);
      this.overlay.classList.remove(this.rollOverAnimationClass);
      this.overlay.classList.add(this.rollOutAnimationClass);
      this.animationInProgressState = 'unhover';
    }
  }

  /**
   * Handles when the hover animations have completed. If there is
   * an animation queued,  we set the appropriate transition and
   * animation states.
   * @param event AnimationEvent.ANIMATION_ENDED
   */
  private hoverAnimationComplete(event: AnimationEvent): void {
    this.animationInProgress = false;

    if (this.queueAnimation === true) {
      this.queueAnimation = false;
      this.animationInProgress = true;
      this.setHoverTransition();
      this.setHoverAnimation();
    }
  }

  /**
   * Handles when the intro animations have completed. Checks to see if there's
   * a queued animation that happened in the midle of the intro. If so, we
   * set the appropriate transition and animation states.
   * @param event AnimationEvent.ANIMATION_ENDED
   */
  private introAnimationComplete(event: AnimationEvent): void {
    this.overlay.classList.remove(this.introAnimationClass);

    this.overlay.removeEventListener(
      WEB_EVENT_TYPES.ANIMATION_ENDED,
      this.introAnimationEventListener
    );
    this.overlay.addEventListener(
      WEB_EVENT_TYPES.ANIMATION_ENDED,
      this.hoverAnimationEventListener
    );

    this.animationInProgress = false;
    if (this.queueAnimation === true) {
      this.queueAnimation = false;
      this.setHoverTransition();
      this.setHoverAnimation();
    }
  }

  /**
   * Animation reset need to occur after animation classes are added or
   * removed to the classlist to force reruns.
   * @param element the element that needs a reflow.
   */
  private resetAnimation(element: HTMLElement): void {
    element.style.animationDelay = '0s';
    element.style.animationName = 'none';
    element.offsetHeight;
    element.style.animationName = '';
  }
}
