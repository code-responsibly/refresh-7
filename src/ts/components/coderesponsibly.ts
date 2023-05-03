import {TypeGuard} from '@abstract/typeguard';
import {AnchorEvent} from '@base/events/anchorevent';
import {
  SectionKeys,
  SITE_CONFIG,
  SITE_STATE,
  TActiveSection,
  TSectionValues,
  WEB_EVENT_TYPES,
} from '@base/constants/types';
import {Site} from '@base/site';
import {SiteEvent} from '@base/events/siteevent';
import {FirebaseEvent} from '@components/firestorefetch/events/firebaseevent';
import {Nav} from '@components/nav/nav';
import {NavEvent} from '@components/nav/events/navevent';
import {ThemeManager} from '@components/thememanager/thememanager';
import {ThemeEvent} from '@components/thememanager/events/themeevent';
import {AboutMe} from '@sections/aboutme/aboutme';
import {DownloadMe} from '@sections/downloadme/downloadme';
import {HeroEvent} from '@sections/home/events/heroevent';
import {Home} from '@sections/home/home';
import {LeadershipPrinciples} from '@sections/leadershiplist/leadershipprinciples';
import {Personals} from '@sections/personals/personals';
import {WorkHistory} from '@sections/workhistory/workhistory';

// No longer need 'import type'. Typescript knows whether to compile
// FirestoneFetch as a depdenency.
import {FirestoreFetch} from '@components/firestorefetch/firestorefetch';
import {ConsolePoem} from '@abstract/consolepoem';

/**
 * The main app to initialize on window load. Registers all the sections that
 * need to interact with each other or update based on
 */
export class CodeResponsibly extends Site {
  //Aux Classes
  private themeManager: ThemeManager;
  private fetch: FirestoreFetch;

  //Component
  private nav: Nav;

  //Sections
  private home: Home;
  private aboutme: AboutMe;
  private workhistory: WorkHistory;
  private downloadme: DownloadMe;
  private personals: Personals;
  private myPrinciples: LeadershipPrinciples;

  /**
   * subclasses Site -> EventTarget.
   * Instaniates the theme manager, all the sections based on allowed keys and
   * registers the standalone chunk needed for the app.
   * ! FirestoreFetch along with the frebase depedencies are broken out as
   * ! a chunk as the functionality is independent of the total experience
   * ! offered by the site.
   */
  constructor() {
    ConsolePoem.publish();
    super();

    this.themeManager = new ThemeManager();
    this.nav = new Nav();

    this.home = new Home(SectionKeys.HOME);
    this.aboutme = new AboutMe(SectionKeys.ABOUT);
    this.workhistory = new WorkHistory(SectionKeys.WORK_HISTORY);
    this.personals = new Personals(SectionKeys.PERSONALS);
    this.downloadme = new DownloadMe(SectionKeys.DOWNLOAD_ME);
    this.myPrinciples = new LeadershipPrinciples(SectionKeys.RULES);

    this.register(
      this.home,
      this.aboutme,
      this.workhistory,
      this.personals,
      this.downloadme,
      this.myPrinciples
    );

    this.setDeviceDefaultState();
    this.importStandAloneChunk();
  }

  /**
   * If the site loads on non-mobile sizes, we open the nav for the user.
   * Otherwise, on mobile or smaller resizes, we keep the nav closed.
   */
  private setDeviceDefaultState() {
    if (SITE_CONFIG.SITE_MODE === SITE_STATE.DESKTOP) {
      this.nav.open();
    } else {
      this.nav.close();
    }
  }

  /**
   * Load the FirestoreFetch module. We're only using firebase for the
   * reading and writing the download counter for the Download Codebase
   * sction of the site. Once loaded, we add the necessary FirestoreFetch
   * listeners.
   */
  private async importStandAloneChunk() {
    const moduleImport = await import(
      /* webpackMode: 'lazy'*/
      /* webpackChunkName: 'firestorefetch' */
      'components/firestorefetch/firestorefetch'
    );
    const moduleClass = moduleImport.FirestoreFetch;
    const fetch: FirestoreFetch = new moduleClass();
    this.fetch = fetch;
    this.lazyLoadedListeners();
  }

  /**
   * Sets up the site for on load. Applies necessary mouse listeners,
   * updates the images needed to match the assigned theme for the work history
   * section of the site, and checks immediately for which is the active
   * section since we can deeplink to a section.
   * If the active section is not the home panel, we close the nav and shrink.
   */
  public init(): void {
    this.applyListeners();

    this.activeSection = this.checkForActiveSection();

    this.themeManager.randomize();
    this.home.hero.intro();

    switch (this.activeSection.name) {
      case SectionKeys.HOME:
        break;
      default:
        if (this.home.hero.isShrunk === false) {
          this.home.updateHero();
        }
    }
  }

  /**
   * Adds listeners to sections and components needed to communicate with each
   * other.
   */
  protected override applyListeners(): void {
    super.applyListeners();
    window.addEventListener(WEB_EVENT_TYPES.SCROLL, event =>
      this.onScrollHandler(event)
    );

    this.themeManager.addEventListener(ThemeEvent.UPDATE, (event: Event) =>
      this.updateThemeHandler(TypeGuard.cast(event))
    );

    this.themeManager.addEventListener(
      ThemeEvent.RANDOM_THEMES_SET,
      (event: Event) => this.randomThemeHandler(TypeGuard.cast(event))
    );

    this.aboutme.addEventListener(
      AnchorEvent.NOTIFY_SELECTION,
      (event: Event) => this.sectionRequestHandler(TypeGuard.cast(event))
    );

    this.nav.addEventListener(AnchorEvent.NOTIFY_SELECTION, (event: Event) =>
      this.sectionRequestHandler(TypeGuard.cast(event))
    );

    this.nav.addEventListener(NavEvent.OPEN_MENU, (event: Event) =>
      this.menuOpenHandler(TypeGuard.cast(event))
    );

    this.home.hero.addEventListener(HeroEvent.HERO_ANIMATED, (event: Event) =>
      this.checkHeroHandler(TypeGuard.cast(event))
    );

    this.downloadme.addEventListener(SiteEvent.TRACK_CLICK, (event: Event) =>
      this.codebaseDownloadedHandler(TypeGuard.cast(event))
    );

    this.home.hero.logo.addEventListener(
      WEB_EVENT_TYPES.CLICK,
      (event: Event) => this.heroClickHandler(TypeGuard.cast(event))
    );
  }

  /**
   * set up the delayed listeners and requests for anonymouse user
   * authentication. Listen for when a record has been fetched so we can update
   * our Download Codebase Section counter and when authenication is successful
   * for an anonymouse user.
   */
  private lazyLoadedListeners(): void {
    this.fetch.addEventListener(FirebaseEvent.RECORD_FETCHED, (event: Event) =>
      this.recordFetchedHandler(TypeGuard.cast(event))
    );

    this.fetch.addEventListener(FirebaseEvent.AUTHENTICATED, (event: Event) =>
      this.firebaseAuthHandler(TypeGuard.cast(event))
    );

    this.fetch.authenticate();
  }

  /**
   * When the browser is resized, we notify home section of the nav state.
   * ! if the nav is open on desktop view and we resize to mobile sizes,
   * ! the nav becomes a full screen overlay resulting in the hero changing
   * ! its position and vice versa.
   * @param event Window Event WEB_EVENT_TYPES.RESIZE.
   */
  protected onResizeHandler(event: Event): void {
    super.onResizeHandler(event);

    this.nav.updateToLayout();
    this.home.checkNavState(this.nav.isNavOpen);
  }

  /**
   * when the user scrolls, we check for the active section.
   * If the active section has changed, the url updates with the anchor path,
   * section theme color is applied, and we see if the section has an intro
   * usecase.
   * if the section is in view and there are scenes that depend on scroll,
   * we continue to check for scene activity.
   * @param event Window Event WEB_EVENT_TYPES.SCROLL
   */
  protected onScrollHandler(event: Event): void {
    const sectionCheck = this.checkForActiveSection();

    if (sectionCheck && sectionCheck.name !== this.activeSection.name) {
      this.activeSection = sectionCheck;
      this.updateSectionURL();

      const panel: SectionKeys = this.activeSection.name;
      this.themeManager.updateTheme(
        TypeGuard.guardForNull(this.site.get(panel)).theme
      );
      this.checkToIntroSections();
    }

    this.checkForScenesInSection();
  }

  /**
   * Update the section URL by checking to see if pushstate is available for
   * modern browsers, otherwise, we write the active section name to the hash.
   * ! For updating the section and nav item active state as we scroll.
   * @todo add a timer to check for when the user has stopped scrolling to
   * update the hash url as there is suspicion that scrolling during the hash
   * update causes a slight momentary lag.
   */
  private updateSectionURL(): void {
    if (typeof history.pushState != undefined) {
      window.history.pushState(null, '', '#' + this.activeSection.name);
    } else {
      window.location.hash = this.activeSection.name;
    }

    this.nav.updateActiveState(this.activeSection.name);
  }

  /**
   * When a section becomes active, it's given the opportunity to audit the
   * any site/app level parameters relating to its siblings and intro in.
   */
  private checkToIntroSections(): void {
    
    if (
      this.home.hero.isHeroIntroInProgress == true &&
      this.activeSection.name != SectionKeys.HOME &&
      this.activeSection.name != SectionKeys.ABOUT && 
      this.activeSection.name != SectionKeys.SPORTS_SCIENCE
    ) {
      this.home.hero.forceShrink();
    }

    switch (this.activeSection.name) {
      case SectionKeys.HOME:
        this.home.updateQuickActionMenu();
        this.home.updateHero();
        break;
      case SectionKeys.WORK_HISTORY:
        this.workhistory.animate();
        break;
    }
  }

  /**
   * Checks for scenes within Sections that need a fresh scrollPercentage for
   * update.
   */
  private checkForScenesInSection(): void {
    switch (this.activeSection.name) {
      case SectionKeys.HOME:
        this.home.requestOutro();
        break;
      case SectionKeys.DOWNLOAD_ME:
        this.downloadme.animate(this.activeSection.scrollPercentage);
        break;
      default:
        break;
    }
  }

  /**
   * Handler for when the Theme Manager has updated
   * the body.
   * @param event hemeEvent.UPDATE
   */
  private updateThemeHandler(event: ThemeEvent): void {
    if (this.activeSection.name === SectionKeys.WORK_HISTORY) {
      this.workhistory.updateTheme(
        TypeGuard.guardForNull(this.site.get(SectionKeys.WORK_HISTORY)).theme
      );
    }
  }

  /**
   * Handler for when the Theme Manager has randomized the theme map.
   * We udate all saved themes within the site manager to remain consistent
   * with what's been updated across the dom as all of the data-theme
   * attributes have also been updated once Random Themes are set.
   * @param event hemeEvent.RANDOM_THEMES_SET
   */
  private randomThemeHandler(event: ThemeEvent): void {
    let panel: SectionKeys;

    for (panel of this.site.keys()) {
      const randomTheme: string = TypeGuard.cast(
        TypeGuard.guardForNull(this.site.get(panel)).parent.dataset.theme
      );
      const values: TSectionValues = TypeGuard.guardForNull(
        this.site.get(panel)
      );
      values.theme = randomTheme;
    }

    panel = this.activeSection.name;
    this.themeManager.applyRandomThemeTo(
      TypeGuard.guardForNull(this.site.get(panel)).parent
    );

    this.workhistory.updateTheme(
      TypeGuard.guardForNull(this.site.get(SectionKeys.WORK_HISTORY)).theme
    );
  }

  /**
   * Handler for when the a nav item or element requests for a new section
   * to come into view. The Url updates and we check to see if the new section
   * needs to intro in.
   * @param event AnchorEvent.NOTIFY_SELECTION
   */
  private sectionRequestHandler(event: AnchorEvent): void {
    const upcomingSection: TActiveSection = {
      name: event.detail.sectionRequested,
      scrollPercentage: 0,
    };

    if (this.site.get(upcomingSection.name)) {
      this.previousSection = this.activeSection;
      this.activeSection = upcomingSection;
      this.updateSectionURL();
      this.checkToIntroSections();
    }
  }

  /**
   * Handler for when the nav menu opens, we notify th home section
   * of the nav status.
   *
   * ! if the nav is open on desktop view and we resize to mobile sizes,
   * ! the nav becomes a full screen overlay resulting in the hero changing
   * ! its position and vice versa.
   *
   * @param event NavEvent.OPEN_MENU
   */
  private menuOpenHandler(event: NavEvent): void {
    this.home.checkNavState(event.detail.isNavOpen);
  }

  /**
   * If the Hero state changes, the nav is notified to adjust itself along with
   * the left and right info boxes.
   * If the view mode is mobile, we let the nav know if the hero has shrunk
   * or enlarged.
   * If the mode is desktop and the hero has shrunk, we close the nav and
   * update theme. The theme is updated because we do not treat the home as
   * other sections where theme is updated when sections are active.
   * If the mode is desktop and the hero has enlarged, we open the menu and
   * update the theme back to the home sections theme.
   * @param event HeroEvent.HERO_ANIMATED
   */
  private checkHeroHandler(event: HeroEvent): void {
    if (SITE_CONFIG.SITE_MODE !== SITE_STATE.DESKTOP) {
      if (event.detail.state === HeroEvent.HERO_SHRUNK) {
        this.nav.adjustForHero(HeroEvent.HERO_SHRUNK);
      } else {
        this.nav.adjustForHero(HeroEvent.HERO_ENLARGE);
      }
      return;
    }

    if (event.detail.state === HeroEvent.HERO_SHRUNK) {
      this.nav.close();
      this.nav.adjustForHero(HeroEvent.HERO_SHRUNK);
      this.themeManager.updateTheme(
        TypeGuard.guardForNull(this.site.get(SectionKeys.ABOUT)).theme
      );
    } else if (event.detail.state === HeroEvent.HERO_ENLARGE) {
      this.nav.open();
      this.nav.adjustForHero(HeroEvent.HERO_ENLARGE);
      this.themeManager.updateTheme(
        TypeGuard.guardForNull(this.site.get(SectionKeys.HOME)).theme
      );
    }
  }

  /**
   * A handler for when the user clicks the download link in the Download
   * Codebase section.
   * @param event SiteEvent.TRACK_CLICK
   */
  private codebaseDownloadedHandler(event: SiteEvent): void {
    this.fetch.codebaseDownloaded();
  }

  /**
   * When an out-of-flow section outros, we update the section url to the
   * previous section such as the case with Sports Science Analytics section
   * for reference (FYI Sports Science is removed temporarily from this site).
   * @param event SiteEvent.SECTION_OUTRO
   */
  private sectionOutroHandler(event: SiteEvent): void {
    this.activeSection = this.previousSection;
    this.updateSectionURL();
  }

  /**
   * Handler for when the hero is clicked, we randomize the themes.
   * @param event WEB_EVENT_TYPES.CLICK = MouseEvent 'click'
   */
  private heroClickHandler(event: MouseEvent): void {
    this.themeManager.randomize(true);
  }

  /**
   * Handler for when firebase authenticates the anonymous user.
   * @param event FirebaseEvent AUTHENTICATED
   */
  private firebaseAuthHandler(event: FirebaseEvent): void {
    this.fetch.getDownloads();
  }

  /**
   * Handler for when firebase has returned the record we requested
   * for the Downloads Counter so that we may update the Download
   * Codebase section.
   * @param event FirebaseEvent.RECORD_FETCHED
   */
  private recordFetchedHandler(event: FirebaseEvent): void {
    this.downloadme.updateDownloadCounter(event.detail.record);
  }
}
