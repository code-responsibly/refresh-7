import { Site } from '@base/site';
/**
 * The main app to initialize on window load. Registers all the sections that
 * need to interact with each other or update based on
 */
export declare class CodeResponsibly extends Site {
    private themeManager;
    private fetch;
    private nav;
    private home;
    private aboutme;
    private workhistory;
    private downloadme;
    private personals;
    private myPrinciples;
    /**
     * subclasses Site -> EventTarget.
     * Instaniates the theme manager, all the sections based on allowed keys and
     * registers the standalone chunk needed for the app.
     * ! FirestoreFetch along with the frebase depedencies are broken out as
     * ! a chunk as the functionality is independent of the total experience
     * ! offered by the site.
     */
    constructor();
    /**
     * If the site loads on non-mobile sizes, we open the nav for the user.
     * Otherwise, on mobile or smaller resizes, we keep the nav closed.
     */
    private setDeviceDefaultState;
    /**
     * Load the FirestoreFetch module. We're only using firebase for the
     * reading and writing the download counter for the Download Codebase
     * sction of the site. Once loaded, we add the necessary FirestoreFetch
     * listeners.
     */
    private importStandAloneChunk;
    /**
     * Sets up the site for on load. Applies necessary mouse listeners,
     * updates the images needed to match the assigned theme for the work history
     * section of the site, and checks immediately for which is the active
     * section since we can deeplink to a section.
     * If the active section is not the home panel, we close the nav and shrink.
     */
    init(): void;
    /**
     * Adds listeners to sections and components needed to communicate with each
     * other.
     */
    protected applyListeners(): void;
    /**
     * set up the delayed listeners and requests for anonymouse user
     * authentication. Listen for when a record has been fetched so we can update
     * our Download Codebase Section counter and when authenication is successful
     * for an anonymouse user.
     */
    private lazyLoadedListeners;
    /**
     * When the browser is resized, we notify home section of the nav state.
     * ! if the nav is open on desktop view and we resize to mobile sizes,
     * ! the nav becomes a full screen overlay resulting in the hero changing
     * ! its position and vice versa.
     * @param event Window Event WEB_EVENT_TYPES.RESIZE.
     */
    protected onResizeHandler(event: Event): void;
    /**
     * when the user scrolls, we check for the active section.
     * If the active section has changed, the url updates with the anchor path,
     * section theme color is applied, and we see if the section has an intro
     * usecase.
     * if the section is in view and there are scenes that depend on scroll,
     * we continue to check for scene activity.
     * @param event Window Event WEB_EVENT_TYPES.SCROLL
     */
    protected onScrollHandler(event: Event): void;
    /**
     * Update the section URL by checking to see if pushstate is available for
     * modern browsers, otherwise, we write the active section name to the hash.
     * ! For updating the section and nav item active state as we scroll.
     * @todo add a timer to check for when the user has stopped scrolling to
     * update the hash url as there is suspicion that scrolling during the hash
     * update causes a slight momentary lag.
     */
    private updateSectionURL;
    /**
     * When a section becomes active, it's given the opportunity to audit the
     * any site/app level parameters relating to its siblings and intro in.
     */
    private checkToIntroSections;
    /**
     * Checks for scenes within Sections that need a fresh scrollPercentage for
     * update.
     */
    private checkForScenesInSection;
    /**
     * Handler for when the Theme Manager has updated
     * the body.
     * @param event hemeEvent.UPDATE
     */
    private updateThemeHandler;
    /**
     * Handler for when the Theme Manager has randomized the theme map.
     * We udate all saved themes within the site manager to remain consistent
     * with what's been updated across the dom as all of the data-theme
     * attributes have also been updated once Random Themes are set.
     * @param event hemeEvent.RANDOM_THEMES_SET
     */
    private randomThemeHandler;
    /**
     * Handler for when the a nav item or element requests for a new section
     * to come into view. The Url updates and we check to see if the new section
     * needs to intro in.
     * @param event AnchorEvent.NOTIFY_SELECTION
     */
    private sectionRequestHandler;
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
    private menuOpenHandler;
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
    private checkHeroHandler;
    /**
     * A handler for when the user clicks the download link in the Download
     * Codebase section.
     * @param event SiteEvent.TRACK_CLICK
     */
    private codebaseDownloadedHandler;
    /**
     * When an out-of-flow section outros, we update the section url to the
     * previous section such as the case with Sports Science Analytics section
     * for reference (FYI Sports Science is removed temporarily from this site).
     * @param event SiteEvent.SECTION_OUTRO
     */
    private sectionOutroHandler;
    /**
     * Handler for when the hero is clicked, we randomize the themes.
     * @param event WEB_EVENT_TYPES.CLICK = MouseEvent 'click'
     */
    private heroClickHandler;
    /**
     * Handler for when firebase authenticates the anonymous user.
     * @param event FirebaseEvent AUTHENTICATED
     */
    private firebaseAuthHandler;
    /**
     * Handler for when firebase has returned the record we requested
     * for the Downloads Counter so that we may update the Download
     * Codebase section.
     * @param event FirebaseEvent.RECORD_FETCHED
     */
    private recordFetchedHandler;
}
