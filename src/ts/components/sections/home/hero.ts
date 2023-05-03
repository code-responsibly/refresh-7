import {TypeGuard} from '@abstract/typeguard';
import {Component} from '@base/component';
import {HTML_TAGS, WEB_EVENT_TYPES} from '@base/constants/types';
import { HeroEvent } from './events/heroevent';

/**
 * Data structure of all possible tag & class references required
 * to componetize the the Leadership Principles Section.
 */
enum HERO_ELEMENTS {
  HERO_HEAD = '.panel.home',
  HERO_LOGO = '.hero-logo',
  HERO_IMG = '.hero-logo img.hero-img',
  HERO_IMG_OVERLAY = '.hero-logo img.hero-img-overlay',
}

/**
 * Generic, but confines HeroElements to the instance.
 */
interface IHeroElements {
  [key: string]: HTMLElement;
}

/** The Main Hero in the Header section of the site. */
export class Hero extends Component {
  readonly SVG = 'svg';
  public maxHeight = 70;
  public isShrunk = false;
  
  private _isHeroIntroInProgress = false;
  private elements: IHeroElements;
  private introSvgs: NodeListOf<SVGGraphicsElement>;
  private svgIntroCompleteListener: (event: AnimationEvent) => void;
  private originalHeight: number;

  /**
   * subclassing Component -> CoreElement.
   * @param elementID the indentifier to search for marking the main container
   * of the component.
   */
  constructor(elementId: string) {
    super(elementId);

    this.init();
  }

  /**
   * method to handle all functionality needed to appropriately initialized
   * the component. For Hero, keeping track of the original height of the logo
   * before any browser resizes.
   */
  private init(): void {
    this.originalHeight = this.logo.getBoundingClientRect().height;

    this.preventRepaintReflow();
    this.applyListeners();
  }

  /**
   * getter for the HTMLElement of the parent element of the hero.
   */
  public get logo(): HTMLElement {
    return this.container.head;
  }

  /**
   * getter for if hero intro has begun and is in progress.
   */
    public get isHeroIntroInProgress(): boolean {
      return this._isHeroIntroInProgress;
    }


  /**
   * sets the pcomponents head element and resets the original height.
   */
  public set logo(val: HTMLElement) {
    this.container.head = val;
    this.originalHeight = this.logo.getBoundingClientRect().height;
  }

  /**
   * Intros the SVGs and handles when the SVGs have completed their intro
   */
  public intro(): void {
    this.elements.HERO_HEAD.classList.add('draw-in-hero');
    this._isHeroIntroInProgress = true;

    this.introSvgs[0].addEventListener(
      WEB_EVENT_TYPES.ANIMATION_ENDED,
      this.svgIntroCompleteListener
    );
  }

  /**
   * Sets the appropriate css classes to shrink the hero.
   */
  public shrink(): void {
    this.isShrunk = true;
    this.resize();

    if (this.elements.HERO_HEAD.classList.contains('animate-on-menu-open')) {
      this.elements.HERO_HEAD.classList.remove('animate-on-menu-open');
    }
    this.elements.HERO_HEAD.classList.add('hero-shrunk');

    this.dispatchEvent(
      new HeroEvent(HeroEvent.HERO_ANIMATED, {
        detail: {
          state: HeroEvent.HERO_SHRUNK,
        },
      })
    );
  }

  /**
   * Sets the appropriate css classes to immediately jump to the shrink state
   * of the hero.
   */
    public forceShrink(): void {
      this.shrink();
      this.elements.HERO_HEAD.classList.add('notransition');
    }

  /**
   * Sets the appropriate css classes to shrink the hero when the
   * menu is open on mobile sized browsers.
   */
  public shrinkOnMobileMenuOpen(): void {
    if(this.elements.HERO_HEAD.classList.contains('notransition')) {
      this.elements.HERO_HEAD.classList.remove('notransition');
    }

    this.isShrunk = true;
    this.resize();

    this.elements.HERO_HEAD.classList.add('hero-shrunk');
    this.elements.HERO_HEAD.classList.add('animate-on-menu-open');

    this.dispatchEvent(
      new HeroEvent(HeroEvent.HERO_ANIMATED, {
        detail: {
          state: HeroEvent.HERO_SHRUNK,
        },
      })
    );
  }

  /**
   * Makes the hero large back to the original state.
   */
  public enlarge(): void {
    if(this.elements.HERO_HEAD.classList.contains('notransition')) {
      this.elements.HERO_HEAD.classList.remove('notransition');
    }
    
    if (this.elements.HERO_HEAD.classList.contains('animate-on-menu-open')) {
      this.elements.HERO_HEAD.classList.remove('animate-on-menu-open');
    }

    this.elements.HERO_HEAD.classList.remove('hero-shrunk');
    this.isShrunk = false;
    this.logo.style.transform = 'scale(1)';

    this.dispatchEvent(
      new HeroEvent(HeroEvent.HERO_ANIMATED, {
        detail: {
          state: HeroEvent.HERO_ENLARGE,
        },
      })
    );
  }

  /**
   * resizes the header based on the appropriate ratio by confining it to a
   * maximum height possible when shrunken.
   */
  public resize(): void {
    const ratio: number = this.maxHeight / this.logo.clientHeight;
    this.logo.style.transform = 'scale(' + ratio + ')';
  }

  /**
   * Sets up necessary animation listeners for hero intro. Holding the 
   * reference to remove if listeners already attached and intro has
   * occurred once.
   */
  protected override applyListeners(): void {
    this.svgIntroCompleteListener = (event: AnimationEvent) =>
      this.svgIntroCompleteHandler(event);
  }

  /**
   * Called once to hold onto elements the section needs to prevent
   * further dom calls that could result in repaint or reflow. Loops through
   * all possible elements needed for Hero functionality.
   * ! Uses the generic type to allow access of the HTMLElement by using the
   * ! data structure key name as the property name of elements.
   */
    private preventRepaintReflow(): void {
      type key = keyof typeof HERO_ELEMENTS;
      this.elements = {};
  
      for (const element of Object.keys(HERO_ELEMENTS)) {
        this.elements[element] = TypeGuard.assertInstance(
          HTMLElement,
          document.querySelector(HERO_ELEMENTS[element as key])
        );
      }
  
      this.introSvgs = TypeGuard.cast(
        this.elements.HERO_LOGO.getElementsByTagName(HTML_TAGS.SVG)
      );
    }

  /**
   * Handles when the SVG animation of the hero has completed resulting in a
   * rquest for the main hero images to animate in.
   * @param event AnimationEvent.ANIMATION_ENDED
   */
  private svgIntroCompleteHandler(event: AnimationEvent): void {
    this.introSvgs[0].removeEventListener(
      WEB_EVENT_TYPES.ANIMATION_ENDED,
      this.svgIntroCompleteListener
    );

    this.elements.HERO_HEAD.classList.remove('draw-in-hero');
    this.elements.HERO_HEAD.classList.add('fade-in-hero');

    this._isHeroIntroInProgress = false;
  }
}
