import {Hero} from '@sections/home/hero';
import {QuickActionMenu} from '@sections/home/quickactionmenu';
import {Section} from '@base/section';
import {SITE_CONFIG, SITE_STATE, WEB_EVENT_TYPES} from '@base/constants/types';

/**
 * Data structure of all possible tag & class references required
 * to componetize the the Home Section.
 */
export enum HOME_ELEMENTS {
  MAIN_LOGO = '.hero-logo',
  MAIN_INTRO_LINE = '.intro-line .intro-line-container',
}

/**
 * The Home section of Code Responsibly. Section can be components or
 * contain multiple components.
 * !Sections are qualified by having an id attribute at the parent level or
 * !the first child occurence of the id attribute.
 *
 * <header id='home'>
 *   ..
 * </header>
 */
export class Home extends Section {
  private _hero: Hero;
  private quickActionMenu: QuickActionMenu;
  private navActivated = false;
  private scrollPointToTakeAction = -30;
  private outroOccurred = false;

  /**
   * subclassing Section -> Component -> CoreElement.
   * @param elementID the indentifier to search for regardless of whether the
   * id attribute is in the section tag or belongs to a child of the section
   * tag.
   */
  constructor(elementID: string) {
    super(elementID);

    this._hero = new Hero(HOME_ELEMENTS.MAIN_LOGO);
    this.quickActionMenu = new QuickActionMenu(HOME_ELEMENTS.MAIN_INTRO_LINE);
  }

  /**
   * for quick access to the hero, the main component of the section.
   */
  public get hero(): Hero {
    return this._hero;
  }

  /**
   * Iddentifies if the Quick Action Menu needs to animate in or animate out
   * based on a unique scroll to action point set for the the home section.
   */
  public updateQuickActionMenu(): void {
    const elementTop = this.container.head.getBoundingClientRect().top;

    if (
      this.hero.isShrunk === false &&
      elementTop < this.scrollPointToTakeAction
    ) {
      this.quickActionMenu.animate(true);
      return;
    }

    if (
      this.hero.isShrunk === true &&
      elementTop > this.scrollPointToTakeAction
    ) {
      this.quickActionMenu.animate(false);
    }
  }

  /**
   * a method that requests an outro for elements that need to exit the viewport
   * or for the hero to shrink if possible.
   */
  public requestOutro(): void {
    this.updateQuickActionMenu();
    this.updateHero();
  }

  /**
   * Determins if the hero needs to be shrunk or enlarged, and notifies the
   * app by HeroEvent.
   * @param forceShrink forces the nav and hero state to be a compressed header
   * bar if we force shrink the hero.
   */
  public updateHero(forceShrink:boolean = false): void {
    const elementTop = this.container.head.getBoundingClientRect().top;

    if(forceShrink == true && this.hero.isShrunk == false) {
      this.hero.forceShrink();
      return;
    }

    if (
      this.hero.isShrunk === false &&
      elementTop < this.scrollPointToTakeAction
    ) {
      this.hero.shrink();
      return;
    }

    if (
      this.hero.isShrunk === true &&
      elementTop > this.scrollPointToTakeAction
    ) {
      this.hero.enlarge();
    }
  }

  /**
   * Receives the nav state and determins what to do with the hero.
   * If the view mode is desktop and open-menu exists on the hero element,
   * this is due to use-case of resize / mobile requiring the hero to
   * have an additional state. Therefore, we check and remove the OPEN_MENU
   * state since we are now in desktop view.
   *
   * if the nav is open and the hero is shrunk, we resize the shrunken hero to
   * match size constraints in the top header.
   *
   * if the the navv state has changed from the previous state,
   * @param navActivated the state of the nav being open or not
   */
  public checkNavState(navActivated = false): void {
    if (SITE_CONFIG.SITE_MODE === SITE_STATE.DESKTOP) {
      if (this.container.head.classList.contains(WEB_EVENT_TYPES.OPEN_MENU)) {
        this.container.head.classList.remove(WEB_EVENT_TYPES.OPEN_MENU);
        this.navActivated = false;
      }

      return;
    }

    if (navActivated === this.navActivated && this.hero.isShrunk) {
      this.hero.resize();
    }

    if (navActivated !== this.navActivated) {
      if (navActivated) {
        this.container.head.classList.add(WEB_EVENT_TYPES.OPEN_MENU);

        if (this.hero.isShrunk === false) {
          this.hero.shrinkOnMobileMenuOpen();
        }
      } else {
        this.updateHero();
        this.container.head.classList.remove(WEB_EVENT_TYPES.OPEN_MENU);
      }
    }

    this.navActivated = navActivated;
  }
}
