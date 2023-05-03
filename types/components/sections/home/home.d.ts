import { Hero } from '@sections/home/hero';
import { Section } from '@base/section';
/**
 * Data structure of all possible tag & class references required
 * to componetize the the Home Section.
 */
export declare enum HOME_ELEMENTS {
    MAIN_LOGO = ".hero-logo",
    MAIN_INTRO_LINE = ".intro-line .intro-line-container"
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
export declare class Home extends Section {
    private _hero;
    private quickActionMenu;
    private navActivated;
    private scrollPointToTakeAction;
    private outroOccurred;
    /**
     * subclassing Section -> Component -> CoreElement.
     * @param elementID the indentifier to search for regardless of whether the
     * id attribute is in the section tag or belongs to a child of the section
     * tag.
     */
    constructor(elementID: string);
    /**
     * for quick access to the hero, the main component of the section.
     */
    get hero(): Hero;
    /**
     * Iddentifies if the Quick Action Menu needs to animate in or animate out
     * based on a unique scroll to action point set for the the home section.
     */
    updateQuickActionMenu(): void;
    /**
     * a method that requests an outro for elements that need to exit the viewport
     * or for the hero to shrink if possible.
     */
    requestOutro(): void;
    /**
     * Determins if the hero needs to be shrunk or enlarged, and notifies the
     * app by HeroEvent.
     * @param forceShrink forces the nav and hero state to be a compressed header
     * bar if we force shrink the hero.
     */
    updateHero(forceShrink?: boolean): void;
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
    checkNavState(navActivated?: boolean): void;
}
