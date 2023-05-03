import { Component } from '@base/component';
/**
 * Simple Data structure to componentize Theme Manager across projects.
 */
interface ThemeSet {
    theme: string[];
}
/**
 * ThemeManager updates and manages the current theme style passed in and
 * allows for random sets of themes to be assigned.
 */
export declare class ThemeManager extends Component {
    currentTheme: string;
    private themePrefix;
    private seriesPointer;
    private totalNumberThemes;
    private randomThemes;
    private clickThruThemes;
    /**
     * subclassing Component -> CoreElement.
     * The component is indepedent of a decorator requirement.
     */
    constructor();
    /**
     * shuffles the the the ThemeMap prior to appliation or
     * re-application.
     */
    shuffle(): void;
    /**
     * Looks at an index of the ThemeMap, stringifys the values that map back to
     * the defined themes in CSS global variables, and adds them to a array,
     * randomThemes, which will be used by the ThemeManager until reshuffling
     * (shuffle) happens.
     * @param index the pointer or index of ThemeMap.
     */
    private setThemeSeries;
    /**
     * Looks at an index of the ClickThruThemeMap, stringifys the values that
     * map back to the defined themes in CSS global variables, and adds them
     * to a array, clickThruThemes, which are themes not available for random
     * load, but available if the user decides to change themes through some
     * sort of click action.
     * @param index the pointer or index of ThemeMap.
     */
    private clickThruThemeSeries;
    /**
     * Checks to see if the currentTheme being attached is not same as what is
     * already set at the element data attribute tag. If the values match,
     * randomize the set until a new theme will be applied.
     */
    applyRandomThemeTo(element: HTMLElement): void;
    /**
     * sets the html-level data attribut tag to the elements theme and notifies
     * the app that an ThemeEvent.UPDATE has occured.
     * @param elementTheme the element's data attribute theme or any of the
     * theme styles set in the CSS global variables.
     */
    updateTheme(elementTheme: string): void;
    /**
     * Fetches all the elements (Sections) with a  data theme attributes set,
     * and assigns the next set of Themes available in the map to each element
     * identified.
     * The method notifies the main app that themes have been written to the HTML
     * hy dispatching ThemeEvent.RANDOM_THEMES_SET.
     */
    randomize(selectFromAllThemes?: boolean): void;
    /**
     * Retrieves the next randomized set in randomThemes. If the pointer reaches
     * the end of randomThemes, we go in circular selection and start at the
     * beginning.
     * !Reshuffling (shuffle method) would shuffle the randomeThemes array and
     * !reset the pointer.
     * @returns a data structure of ready to go stringfied values that
     * can be applied to the data-theme attribute at the element level.
     */
    getNextThemeSet(includeClickThruThemes?: boolean): ThemeSet;
    /**
     * Checks if the next theme being applied is already the currnt theme. If so,
     * we skip over it and check once again until it has exhausted the rest of
     * themes available in the currently-pointed randomeThemes series.
     * @returns the next theme within a theme set. (a pointer in ramdomThemes).
     */
    getNextTheme(): string | undefined;
    /**
     * Called once to hold onto elements the section needs to prevent
     * further dom calls that could result in repaint or reflow.
     */
    private preventRepaintReflow;
    /**
     * Allows for reverse lookup by returning the index of a theme to check
     * against the ThemeMap or where else applicable.
     * @param theme the string value that includes an index as a prefix.
     * @returns the index attached to the theme.
     * !Asumes the index is the last character of the string.
     */
    private getThemeIndex;
}
export {};
