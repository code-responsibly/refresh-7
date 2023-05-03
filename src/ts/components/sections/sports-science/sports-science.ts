import {Section} from '@base/section';
import {SiteEvent} from '@base/events/siteevent';
import {SITE_CONFIG, SITE_STATE, WEB_EVENT_TYPES} from '@base/constants/types';
import {TypeGuard} from '@abstract/typeguard';

/**
 * Data structure of all possible tag & class references required
 * to componetize the the Sports Science Section.
 */
enum SPORTS_SCIENCE_ELEMENTS {
  SECTION_INDICATOR = '.section-indicator-holder',
  FOCUS_SNAP_SECTION = '.sports-science-analytics .snap-section',
  SNAP_ITEM = '.sports-science-analytics .snap-section .snap-item',
  BURGER = '.sports-science-analytics .burger'
}

enum INTERACTION_TYPES {
  SCROLL = 'scroll',
  TOUCH = 'touch',
}

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
export class SportsScience extends Section {
  readonly DESKTOP_SCROLL_THRESHOLD: number = 125;
  readonly MOBILE_SCROLL_THRESHOLD: number = 40;

  private burger:HTMLElement;
  private bodyTag: HTMLElement;
  private htmlTag: HTMLElement;
  private sectionScrollIndicator: HTMLElement;
  private snapSection: HTMLElement;

  private containerScrollListener: (event: WheelEvent) => void;
  private containerTouchStartListener: (event: TouchEvent) => void;
  private containerTouchMoveListener: (event: TouchEvent) => void;

  private panelInView = false;
  private totalSnapHeight: number;
  private userTouchY: number;
  private scrollThreshold:number;

  /**
   * subclassing Component -> CoreElement.
   * @param elementID the indentifier to search for marking the main container
   * of the component.
   */
  constructor(elementID: string) {
    super(elementID);

    this.preventRepaintReflow();
    this.applyListeners();
  }

  /**
   * sets the out-of-flow section properties so that it may
   * animate in accordingly.
   */
  public intro(): void {
    this.panelInView = true;

    this.bodyTag.classList.add('preventscroll');
    this.htmlTag.classList.add('preventscroll');
    this.container.head.style.display = 'inline';
    this.container.head.style.animationDuration = '.75s';
    this.container.head.style.animationDirection = 'normal';
    this.container.head.style.animationFillMode = 'forwards';
    this.container.head.style.animationPlayState = 'running';
    this.container.head.style.animationName = 'show-trap-door';

    this.calculateSnapItems();
  }

  /**
   * Upate the calculated total height of snap containers when necessary such
   * as when a resize happens
   */
  public update(): void {
    this.calculateSnapItems();
  }

  /**
   * exits the out-of-flow section.
   */
  public outro(): void {
    this.cleanupListeners();
    this.panelInView = false;

    this.container.head.style.animationDuration = '.75s';
    this.container.head.style.animationDirection = 'normal';
    this.container.head.style.animationFillMode = 'forwards';
    this.container.head.style.animationName = 'hide-trap-door';
  }

  /**
   * Called once to hold onto elements the section needs to prevent
   * further dom calls that could result in repaint or reflow.
   */
  private preventRepaintReflow(): void {
    this.burger = TypeGuard.guardForNull(
      document.querySelector(SPORTS_SCIENCE_ELEMENTS.BURGER)
    );
    this.sectionScrollIndicator = TypeGuard.guardForNull(
      document.querySelector(SPORTS_SCIENCE_ELEMENTS.SECTION_INDICATOR)
    );
    this.snapSection = TypeGuard.guardForNull(
      document.querySelector(SPORTS_SCIENCE_ELEMENTS.FOCUS_SNAP_SECTION)
    );

    this.bodyTag = TypeGuard.cast(document.querySelector('body'));
    this.htmlTag = TypeGuard.cast(document.querySelector('html'));
  }

  /**
   * Adds listeners to all (or one) HTML Elements found in the component.
   */
  protected override applyListeners(): void {
    super.applyListeners();

    this.burger.addEventListener(WEB_EVENT_TYPES.CLICK, (event: MouseEvent) =>
      this.onBurgerClickHandler(event)
    );

    if (SITE_CONFIG.SITE_MODE == SITE_STATE.DESKTOP) {
      this.scrollThreshold = this.DESKTOP_SCROLL_THRESHOLD;
      this.containerScrollListener = (event: WheelEvent) =>
        this.containerScrollHandler(event);
    } 
    else {
      this.scrollThreshold = this.MOBILE_SCROLL_THRESHOLD;
      this.containerTouchStartListener = (event: TouchEvent) =>
        this.containerTouchStartHandler(event);
      this.containerTouchMoveListener = (event: TouchEvent) =>
        this.containerTouchMoveHandler(event);
    }

    const panelAnimationListener = (event: AnimationEvent) =>
      this.panelAnimationHandler(event);

    this.container.head.addEventListener(
      WEB_EVENT_TYPES.ANIMATION_ENDED,
      panelAnimationListener
    );
  }

  /**
   * Calculates the total height of the items added to the snap container.
   * this.totalSnapHeight is used to know when we've scrolled past the max
   * and the out-of-flow section should outro.
   */
  private calculateSnapItems(): void {
    const items: NodeListOf<HTMLElement> = document.querySelectorAll(
      SPORTS_SCIENCE_ELEMENTS.SNAP_ITEM
    );
    const totalItems: number = items.length;

    let calculteTotalSnapHeight = 0;
    for (const item of items) {
      calculteTotalSnapHeight += item.scrollHeight;
    }

    this.totalSnapHeight =
      calculteTotalSnapHeight - calculteTotalSnapHeight / totalItems;
  }

  /**
   * Cleans up desktop and mobile listeners initially set up to keep track
   * how far the user has scrolled through the section.
   */
  private cleanupListeners(): void {
    if (SITE_CONFIG.SITE_MODE == SITE_STATE.DESKTOP) {
      this.snapSection.removeEventListener(
        WEB_EVENT_TYPES.WHEEL,
        this.containerScrollListener
      );
    } else {
      this.snapSection.removeEventListener(
        WEB_EVENT_TYPES.TOUCH_START,
        this.containerTouchStartListener
      );

      this.snapSection.removeEventListener(
        WEB_EVENT_TYPES.TOUCH_MOVE,
        this.containerTouchMoveListener
      );
    }
  }

  /**
   * Checks to see if the user has exceeded the scrolling threshold after
   * the container scroll percentage has reached 100%.
   * @param event WEB_EVENT_TYPES.WHEEL = WheelEvent 'wheel'
   */
  private containerScrollHandler(event: WheelEvent): void {
    this.requestOutro(INTERACTION_TYPES.SCROLL, event.deltaY);
  }

  /**
   * Checks to see when the user has began a touch on mobile
   * devices and stores the vertical positions.
   * @param event WEB_EVENT_TYPES.TOUCH_START = 'touchstart'
   */
  private containerTouchStartHandler(event: TouchEvent): void {
    this.userTouchY = event.touches[0].pageY;
  }

  /**
   * Checks to see when the user has moved their touch interaction
   * across a moile device and mimics the deltaY provided by
   * window.scrollY.
   * ! Cannot use window.scrollY since the overlay of the section overflow
   * ! hidden on the body tag.
   * @param event WEB_EVENT_TYPES.TOUCH_MOVE = 'touchmove'
   */
  private containerTouchMoveHandler(event: TouchEvent) {
    const deltaY = this.userTouchY - event.touches[0].pageY;
    this.userTouchY = event.touches[0].pageY;
    
    this.requestOutro(INTERACTION_TYPES.TOUCH, deltaY);
  }

  /**
   * Checks to see if user has scrolled beyond the end of the section
   * by testing the scroll against a threshold. if the delta treshold is met,
   * the section outros.
   * @param mode
   * @param userScrollPoint
   */
  private requestOutro(mode: string, userScrollPoint: number) {
    let snapPercentage: number =
      this.snapSection.scrollTop / this.totalSnapHeight;
    snapPercentage = Math.round(snapPercentage * 100) / 100;

    if (userScrollPoint > this.scrollThreshold && snapPercentage >= 1) {
      this.outro();
    }
  }

  /**
   * Handler that takes care of what happens after the section animates in or
   * out. If the section has completed animatining in, the wheel listener is
   * attached for scroll. If the secion has completed animating out, we allow
   * the page to be scrollable and notify the main app that a section has
   * outro'd.
   * @param event WEB_EVENT_TYPES.ANIMATION_ENDED = AnimationEvent 'animationend'
   */
  private panelAnimationHandler(event: AnimationEvent): void {
    switch (this.panelInView) {
      case true:
        if (SITE_CONFIG.SITE_MODE == SITE_STATE.DESKTOP) {
          this.snapSection.addEventListener(
            WEB_EVENT_TYPES.WHEEL,
            this.containerScrollListener
          );
        } else {
          this.snapSection.addEventListener(
            WEB_EVENT_TYPES.TOUCH_START,
            this.containerTouchStartListener
          );

          this.snapSection.addEventListener(
            WEB_EVENT_TYPES.TOUCH_MOVE,
            this.containerTouchMoveListener
          );
        }
        break;
      case false:
      default:
        this.snapSection.scrollTop = 0;
        this.bodyTag.classList.remove('preventscroll');
        this.htmlTag.classList.remove('preventscroll');
        this.container.head.style.display = 'none';
        this.dispatchEvent(new SiteEvent(SiteEvent.SECTION_OUTRO));
        break;
    }
  }

  /**
   * Allows the user to close the section instead of having to scroll
   * all the way to the very end of the section (where it would then
   * automatically outro.)
   * @param event The click event on the section's burger x menu.
   */
  private onBurgerClickHandler(event:MouseEvent): void {
    this.outro();
  }
}
