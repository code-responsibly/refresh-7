import {Component} from '@base/component';
import {HeroEvent} from '@sections/home/events/heroevent';
import {NavEvent} from '@components/nav/events/navevent';
import {
  SectionKeys,
  SITE_CONFIG,
  SITE_STATE,
  WEB_EVENT_TYPES,
} from '@base/constants/types';
import {TypeGuard} from '@abstract/typeguard';

/**
 * Data structure representing section-specific style classes.
 */
enum NAV_ELEMENTS {
  NAV = '.cr-menu',
  NAV_TAG = 'nav',
  NAV_INFO_LEFT = '.nav-info-area',
  NAV_INFO_RIGHT = '.nav-info-desc',
}

/**
 * The Main Menu of the site including the info boxes surrounding the nav.
 *
 * <nav>
 *   <div class='nav-info-area nav-info-box-styling'>..</div>
 *   <div class='nav-info-desc nav-info-box-styling'>..</div>
 *   <div class='cr-menu'>..</div>
 *  </nav>
 */
export class Nav extends Component {
  public isNavOpen = false;

  private lastDisplayState: string;
  private info_box_left: HTMLElement;
  private info_box_right: HTMLElement;
  private bodyTag: HTMLElement;

  /**
   * subclassing Component -> CoreElement.
   * @param elementID the indentifier to search for marking the main container
   * of the component. If an elementID is not passed in, we fallback on a
   * default value from or nav-defined data structure.
   */
  constructor(elementId = '') {
    const key = elementId || NAV_ELEMENTS.NAV_TAG;
    super(key);

    this.info_box_left = TypeGuard.cast(
      document.querySelector(NAV_ELEMENTS.NAV_INFO_LEFT)
    );
    this.bodyTag = TypeGuard.cast(document.querySelector('body'));

    if (!this.container) {
      return;
    }

    this.init();
  }

  /**
   * Checks to see the nav is closed, and if so, opens the nav and notifies
   * the main app the nav has opened.
   */
  public open(): void {
    if (this.isNavOpen === true) {
      return;
    }

    this.isNavOpen = true;
    this.updateToLayout();
    this.container.head.classList.add(WEB_EVENT_TYPES.OPEN_MENU);
    this.dispatchEvent(
      new NavEvent(NavEvent.OPEN_MENU, {detail: {isNavOpen: this.isNavOpen}})
    );
  }

  /**
   * Checks to see the nav is open, and if so, closes the nav and notifies
   * the main app the nav has opened.
   */
  public close(): void {
    if (this.isNavOpen === false) {
      return;
    }

    this.isNavOpen = false;
    this.updateToLayout();
    this.container.head.classList.remove(WEB_EVENT_TYPES.OPEN_MENU);
    this.dispatchEvent(
      new NavEvent(NavEvent.OPEN_MENU, {detail: {isNavOpen: this.isNavOpen}})
    );
  }

  /**
   * Adds the active state to a nav item since deep linking url can be updated
   * by other means besides selecting items in the nav, such as by user scroll
   * and other elements in different sections.
   * @param id the search key to test against the href tag of the the nav items.
   */
  public updateActiveState(id: SectionKeys) {
    const searchKey: string = '#' + id;

    for (let i = 0; i < this.links.length; i++) {
      if (this.links[i].getAttribute('href') !== searchKey) {
        this.links[i].classList.remove('active');
      } 
      else {
        this.links[i].classList.toggle('active');
      }
    }
  }

  /**
   * Checks for the href tag that matches a section id attribute and forces
   * the MouseEvent click functionality to mimic the user click of a nav item.
   * @param id the search key to test against the href tag of the the nav items.
   */
  public forceClickEvent(id: SectionKeys): void {
    const searchKey: string = '#' + id;

    const forcedEvent = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    });

    for (let i = 0; i < this.links.length; i++) {
      if (this.links[i].getAttribute('href') === searchKey) {
        this.links[i].dispatchEvent(forcedEvent);
        break;
      }
    }
  }

  /**
   * Updates the nav based on whether we're on desktop or mobile and if
   * the nav is open or not. On mobile, the nav is fullscreen and we prevent
   * scrolling while the nav is open.
   * If the nav is closed on mobile or the new state is desktop, we allow
   * scrolling.
   */
  public updateToLayout(): void {
    switch (SITE_CONFIG.SITE_MODE) {
      case SITE_STATE.DESKTOP:
        if (this.lastDisplayState === SITE_STATE.NOT_DESKTOP) {
          this.bodyTag.style.overflow = 'auto';
        }
        break;

      case SITE_STATE.NOT_DESKTOP:
      default:
        this.bodyTag.style.overflow = this.isNavOpen ? 'hidden' : 'auto';
        break;
    }

    this.lastDisplayState = SITE_CONFIG.SITE_MODE;
  }

  /**
   * if the hero has shrunk, we want the left info box on the nav to scoot
   * over. If the hero is large, we want the left info box to move back to
   * its original position.
   * @param heroState the state of whether the hero is large or shrunken.
   */
  public adjustForHero(heroState: string): void {
    if (heroState === HeroEvent.HERO_SHRUNK) {
      this.info_box_left.classList.add('hero-shrunk');
    } else {
      this.info_box_left.classList.remove('hero-shrunk');
    }
  }

  /**
   * Method to handle all functionality needed to appropriately initialized
   * the component. For Nav, adds a doc-level Mouse Click listener to close
   * the nav when the user clicks anywhere on the site.
   */
  private init(): void {
    document.addEventListener(WEB_EVENT_TYPES.CLICK, (event: MouseEvent) =>
      this.onClickWhileMenuOpenHandler(event)
    );

    const burger: HTMLElement = TypeGuard.cast(
      document.querySelector('.burger')
    );
    burger.addEventListener(WEB_EVENT_TYPES.CLICK, (event: MouseEvent) =>
      this.onBurgerClickHandler(event)
    );

    this.setLinks('ul', true);
  }

  /**
   * Handler to toggle the menu open or closed when the user clicks the nav
   * hamburger.
   * @param event MouseEvent.CLICK
   */
  private onBurgerClickHandler(event: MouseEvent): void {
    if (this.container.head.classList.contains('open-menu')) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Handler for the doc-level Mouse Click listener that closes the nav
   * if it is open if the user clicks anywhere else besides the burger.
   * @param event MouseEvent.CLICK
   */
  private onClickWhileMenuOpenHandler(event: MouseEvent): void {
    const menuClicked: HTMLElement = TypeGuard.cast(event.target);

    if (
      !menuClicked.matches('.burger') &&
      !menuClicked.matches('.burger a') &&
      this.isNavOpen === true
    ) {
      this.close();
    }
  }
}
