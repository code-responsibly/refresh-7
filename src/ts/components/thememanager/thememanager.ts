import {TypeGuard} from '@abstract/typeguard';
import {Component} from '@base/component';
import {ThemeEvent} from '@components/thememanager/events/themeevent';

/**
 * Each entry holds the index of a theme valued defined in The CSS variables.
 * There are certain themes that look great with certain sections, and certain
 * themes to avoid. For example, the last item in every array is the value of 1
 * which represents 'theme-1'. The last section (an element with an id
 * attribute or the parene element of an element with an id attribute) will
 * always have theme-1 colors applied to it.
 */
const ThemeMap = [
  [1, 1, 1, 1, 1, 1, 1],
  [2, 11, 11, 11, 11, 2, 1],
  [3, 9, 9, 9, 9, 9, 1],
  [6, 1, 1, 1, 1, 1, 1],
  [7, 8, 8, 8, 8, 7, 1],
];

/**
 * Each entry holds the index of a theme valued defined in The CSS variables.
 * These are secondary themes that will only set when the user requests through
 * some kind of interaction post-site-load to rotate through the full set
 * of themes that include the ThemeMap + ClickThruThemeMap.
 */
const ClickThruThemeMap = [
  [4, 10, 10, 10, 10, 10, 1],
  [7, 7, 8, 7, 7, 7, 1],
];

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
export class ThemeManager extends Component {
  //The current theme at the html data tag level.
  public currentTheme: string;

  private themePrefix: string;
  private seriesPointer: number;
  private totalNumberThemes: number;
  private randomThemes: ThemeSet[] = [];
  private clickThruThemes: ThemeSet[] = [];

  /**
   * subclassing Component -> CoreElement.
   * The component is indepedent of a decorator requirement.
   */
  constructor() {
    super();
    this.preventRepaintReflow();
    this.shuffle();
  }

  /**
   * shuffles the the the ThemeMap prior to appliation or
   * re-application.
   */
  public shuffle(): void {
    this.seriesPointer = 0;
    this.randomThemes = [];

    const orderedThemes: Array<number> = [];
    for (let i = 0; i < ThemeMap.length; i++) {
      orderedThemes.push(i);
    }

    for (let i = 0; i < ThemeMap.length; i++) {
      const random: number = Math.floor(Math.random() * orderedThemes.length);
      this.setThemeSeries(orderedThemes[random]);
      orderedThemes.splice(random, 1);
    }

    const secondaryThemes: Array<number> = [];
    for (let i = 0; i < ClickThruThemeMap.length; i++) {
      secondaryThemes.push(i);
    }

    this.clickThruThemes = [...this.randomThemes];
    for (let k = 0; k < ClickThruThemeMap.length; k++) {
      const random: number = Math.floor(Math.random() * secondaryThemes.length);
      this.clickThruThemeSeries(secondaryThemes[random]);
    }
  }

  /**
   * Looks at an index of the ThemeMap, stringifys the values that map back to
   * the defined themes in CSS global variables, and adds them to a array,
   * randomThemes, which will be used by the ThemeManager until reshuffling
   * (shuffle) happens.
   * @param index the pointer or index of ThemeMap.
   */
  private setThemeSeries(index: number): void {
    const themeSet: string[] = [];
    for (let i = 0; i < ThemeMap[index].length; i++) {
      themeSet[i] = this.themePrefix + ThemeMap[index][i];
    }

    const obj: ThemeSet = {theme: themeSet};
    this.randomThemes.push(obj);
  }

  /**
   * Looks at an index of the ClickThruThemeMap, stringifys the values that
   * map back to the defined themes in CSS global variables, and adds them
   * to a array, clickThruThemes, which are themes not available for random
   * load, but available if the user decides to change themes through some
   * sort of click action.
   * @param index the pointer or index of ThemeMap.
   */
  private clickThruThemeSeries(index: number): void {
    const themeSet: string[] = [];
    for (let i = 0; i < ClickThruThemeMap[index].length; i++) {
      themeSet[i] = this.themePrefix + ClickThruThemeMap[index][i];
    }

    const obj: ThemeSet = {theme: themeSet};
    this.clickThruThemes.push(obj);
  }

  /**
   * Checks to see if the currentTheme being attached is not same as what is
   * already set at the element data attribute tag. If the values match,
   * randomize the set until a new theme will be applied.
   */
  public applyRandomThemeTo(element: HTMLElement): void {
    const elementTheme: string = TypeGuard.guardForNull(element.dataset.theme);
    if (this.currentTheme == elementTheme) {
      this.randomize(true);
      return;
    }

    this.updateTheme(elementTheme);
  }

  /**
   * sets the html-level data attribut tag to the elements theme and notifies
   * the app that an ThemeEvent.UPDATE has occured.
   * @param elementTheme the element's data attribute theme or any of the
   * theme styles set in the CSS global variables.
   */
  public updateTheme(elementTheme: string): void {
    if (this.currentTheme == elementTheme) {
      return;
    }

    document.documentElement.setAttribute('data-theme', elementTheme);
    this.currentTheme = elementTheme;

    this.dispatchEvent(new ThemeEvent(ThemeEvent.UPDATE));
  }

  /**
   * Fetches all the elements (Sections) with a  data theme attributes set,
   * and assigns the next set of Themes available in the map to each element
   * identified.
   * The method notifies the main app that themes have been written to the HTML
   * hy dispatching ThemeEvent.RANDOM_THEMES_SET.
   */
  public randomize(selectFromAllThemes: boolean = false): void {
    const sections: NodeListOf<HTMLElement> =
      document.querySelectorAll('[data-theme]');
    if (
      sections === null ||
      (sections instanceof NodeList && sections.length === 0)
    ) {
      return;
    }

    const series: ThemeSet = this.getNextThemeSet(selectFromAllThemes);

    let k = 0;
    // Skipping HTML Tag [data-theme] Attribute
    for (let i = 1; i < sections.length; i++) {
      sections[i].setAttribute('data-theme', series.theme[k]);
      if (k < series.theme.length) {
        k++;
      } else {
        k = 0;
      }
    }

    this.dispatchEvent(new ThemeEvent(ThemeEvent.RANDOM_THEMES_SET));
  }

  /**
   * Retrieves the next randomized set in randomThemes. If the pointer reaches
   * the end of randomThemes, we go in circular selection and start at the
   * beginning.
   * !Reshuffling (shuffle method) would shuffle the randomeThemes array and
   * !reset the pointer.
   * @returns a data structure of ready to go stringfied values that
   * can be applied to the data-theme attribute at the element level.
   */
  public getNextThemeSet(includeClickThruThemes: boolean = false): ThemeSet {
    this.seriesPointer++;

    let properThemes: ThemeSet[] = this.randomThemes;
    if (includeClickThruThemes == true) {
      properThemes = this.clickThruThemes;
    }

    if (this.seriesPointer >= properThemes.length) {
      this.seriesPointer = 0;
    }
    return properThemes[this.seriesPointer];
  }

  /**
   * Checks if the next theme being applied is already the currnt theme. If so,
   * we skip over it and check once again until it has exhausted the rest of
   * themes available in the currently-pointed randomeThemes series.
   * @returns the next theme within a theme set. (a pointer in ramdomThemes).
   */
  public getNextTheme(): string | undefined {
    const currentThemeSet: ThemeSet = this.randomThemes[this.seriesPointer];

    let k = 0;
    for (let i = 0; i < currentThemeSet.theme.length; i++) {
      if (this.currentTheme == currentThemeSet.theme[i]) {
        k = i + 1;
        if (
          k < currentThemeSet.theme.length &&
          this.currentTheme != currentThemeSet.theme[k]
        ) {
          return currentThemeSet.theme[k];
        }
      } else {
        return currentThemeSet.theme[i];
      }
    }

    return undefined;
  }

  /**
   * Called once to hold onto elements the section needs to prevent
   * further dom calls that could result in repaint or reflow.
   */
  private preventRepaintReflow(): void {
    const r: unknown = TypeGuard.cast(document.querySelector('html'));
    const rs: CSSStyleDeclaration = getComputedStyle(TypeGuard.cast(r));

    this.themePrefix = rs
      .getPropertyValue('--theme-prefix')
      .replace(/['"]+/g, '')
      .trim();

    this.totalNumberThemes = Number(rs.getPropertyValue('--total-themes'));
    this.currentTheme = TypeGuard.guardForNull(
      document.documentElement.getAttribute('data-theme')
    );
  }

  /**
   * Allows for reverse lookup by returning the index of a theme to check
   * against the ThemeMap or where else applicable.
   * @param theme the string value that includes an index as a prefix.
   * @returns the index attached to the theme.
   * !Asumes the index is the last character of the string.
   */
  private getThemeIndex(theme: string): string | undefined {
    let index: string;

    if (theme.includes(this.themePrefix)) {
      index = theme.substring(theme.length - 1, theme.length);
      return index;
    }
    return undefined;
  }
}
