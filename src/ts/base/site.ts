import {Section} from '@base/section';
import {ElementAssist} from '@abstract/elementassist';
import {
  SectionKeys,
  SITE_CONFIG,
  TSectionValues,
  TActiveSection, 
  WEB_EVENT_TYPES,
} from '@base/constants/types';
import {TypeGuard} from '@abstract/typeguard';

/**
 * The Site base Class delivers key functionlity to manage full page websites
 */
export class Site extends EventTarget {
  // When a section is 25% percent visible, we consider it active and the
  // previous section no longer active.
  readonly SCROLL_OFFSET: number = 0.25;

  // The active section by default is the Home section.
  public activeSection: TActiveSection = {
    name: SectionKeys.HOME,
    scrollPercentage: 0,
  };

  // The previous section the user last visited.
  public previousSection: TActiveSection;

  //This is site manager map.
  protected site: Map<SectionKeys, TSectionValues >;
  protected lastScrollTop = 0;

  /**
   * subclassing EventTarget. Sets up the site manager, and stores the view
   * mode of the site whether we're initially in Desktop or non-desktop view.
   */
  constructor() {
    super();

    this.site = new Map<SectionKeys, TSectionValues >();
    this.scrollRestoration();
    this.setConfig();
  }

  /**
   * When a refresh happens, we start back at the top opposed to allowing
   * refreshes to load the page in the middle of a section.
   */
  protected scrollRestoration(): void {
    if (history.scrollRestoration) {
      history.scrollRestoration = 'manual';
    } else {
      window.addEventListener(
        WEB_EVENT_TYPES.ON_BEFORE_UNLOAD,
        (event: Event) => this.onBeforeUnloadHandler(event)
      );
    }
  }

  /**
   * Stores the view mode of the page by grabbing the CSS global variable.
   * The page is either in desktop or non-desktop mode.
   */
  protected setConfig(): void {
    const r: HTMLElement = TypeGuard.cast(document.querySelector('html'));

    const rs = getComputedStyle(r);
    SITE_CONFIG.SITE_MODE = TypeGuard.cast(
      rs.getPropertyValue('--site-mode').replace(/['"]+/g, '').trim()
    )
  }

  /**
   * Adds baseline listeners required for full-page websites, such as page
   * resizes since it changes the scroll percentage and possibly viewport
   * height effecting all sections.
   */
  protected applyListeners(): void {
    window.addEventListener(WEB_EVENT_TYPES.RESIZE, (event: Event) =>
      this.onResizeHandler(event)
    );
  }

  /**
   * Registers the section instance with the website and sets the site manager
   * map to appropriate section values where we keep track of the:
   * parent, the top most valid container of a section.
   * head: the first container in the section which has an id attribute.
   * children: any additional containers have have an id attribute.
   * theme: data-theme attribute at the top most container, the parent.
   * @param args a list of instances that extend the Section base class.
   */
  protected register(...args: Section[]): void {
    let sectionName: SectionKeys;
    let sectionValues: TSectionValues ;

    for (let i = 0; i < args.length; i++) {
      sectionName = TypeGuard.cast(args[i].sectionElements.head.id);
      const componentHead: HTMLElement = args[i].sectionElements.head.element;
      const componentContainer: HTMLElement = TypeGuard.guardForNull(
        this.findTopMostValidContainer(componentHead)
      );

      sectionValues = {
        parent: componentContainer,
        head: args[i].sectionElements.head,
        children: args[i].sectionElements.children,
        theme: TypeGuard.guardForNull(componentContainer.dataset.theme),
      };

      this.site.set(sectionName, sectionValues);
    }
  }

  /**
   * searches a given element to find the top most valid element which begins
   * with either a section tag or header tag.
   *
   * ! typically this shoudl only be a section tag. However, my hero lives in
   * ! the header when shrunken so the header tag is also a type of section for
   * ! this site. Yes, this is easily remedied by changing header tag to a
   * ! section tag, but prevents the HTML page form having an appropriate
   * ! header tag.
   *
   * @param element the HTMLElement we search for the closet relevant parent.
   * @returns the valid container type if one is found otherwise, null.
   */
  private findTopMostValidContainer(element: HTMLElement): HTMLElement | null {
    const containerTypes: string[] = ['header', 'section'];
    let foundContainer: HTMLElement | null;

    for (let i = 0; i < containerTypes.length; i++) {
      foundContainer = element.closest(containerTypes[i]);
      if (foundContainer) {
        return foundContainer;
      }
    }

    return null;
  }

  /**
   * Checks each section to see if it is considered active.
   * @returns the new active section, otherwise, returns the currently active
   * section.
   */
  protected checkForActiveSection(): TActiveSection {
    let panel: SectionKeys;
    let allElements: HTMLElement[] = [];
    let section: TActiveSection | null = null;

    for (panel of this.site.keys()) {
      const element: HTMLElement = TypeGuard.guardForNull(
        this.site.get(panel)
      ).parent;
      allElements = [];

      if (element instanceof Array<HTMLElement>) {
        allElements = element.slice(0);
      } else {
        allElements.push(element);
      }

      const activePanel: SectionKeys = this.activeSection.name;
      for (let i = 0; i < allElements.length; i++) {
        if (
          this.isSectionActive(
            this.activeSection.name,
            TypeGuard.guardForNull(this.site.get(activePanel)).parent
          )
        ) {
          return this.activeSection;
        }
        section = this.isSectionActive(panel, allElements[i]);
        if (section && section.name !== this.activeSection.name) {
          return section;
        }
      }
    }

    if (!section) {
      return this.activeSection;
    }

    return section;
  }

  /**
   * Checks if a section is active by looking to see if the section meets the
   * threshhold of being considered so, where the requirment is being 25% or
   * more visible given the SCROLL_OFFSET.
   * If a section is in view, we update the scroll percentage while the section
   * remains active.
   *
   * @param panelName the section name to check against the active section's
   * name.
   * @param element The HTMLElement to check if it is in view or not.
   * ! The name of the section(panelName) and HTMLElement should be related.
   *
   * @returns TActiveSection which includes the name of the section based on
   * predefined keys and the scrollPercentage of the active section.
   */
  protected isSectionActive(
    panelName: SectionKeys,
    element: HTMLElement
  ): TActiveSection | null {
    let scrollPercentage: number;

    if (this.isSectionInView(element, this.SCROLL_OFFSET)) {
      scrollPercentage = this.updateActiveScrollPercentage(
        element,
        this.SCROLL_OFFSET
      );

      if (this.activeSection.name === panelName) {
        this.activeSection.scrollPercentage = scrollPercentage;
        return this.activeSection;
      }

      return {name: panelName, scrollPercentage: scrollPercentage};
    }

    return null;
  }

  /**
   * Checks to see if the section (or any element) is actually in view.
   * @param element HTMLElement we check to see if it has entered into
   * the viewport
   * @param offsetRatio if no offset ratio is passed in, the section must be
   * 100% visible to be considered active.
   * @returns true if the section is in fact in view by meeting the threshold
   * otherwise, false.
   */
  protected isSectionInView(element: HTMLElement, offsetRatio = 1): boolean {
    const scopeHeight = ElementAssist.size(element).height;
    const scopeTop = ElementAssist.position(element).top;

    const windowHeight = ElementAssist.window().height;
    const elementTop = ElementAssist.window().scrollTop;

    const scroll = elementTop + windowHeight * (1 - offsetRatio);
    if (scopeTop <= scroll && scopeTop + scopeHeight > scroll) {
      return true;
    }

    return false;
  }

  /**
   * Figures out the correct scroll percentage of an acrtive section given
   * that the window height can resize, and offset ratio may change across
   * different sections.
   * @param element HTMLElement within the viewport now considered active.
   * @param offsetRatio if no offset ratio is passed in, the section must be
   * 100% visible to be considered active.
   * @returns percentage out of a 100 of how much of the section is visible.
   */
  protected updateActiveScrollPercentage(
    element: HTMLElement,
    offsetRatio = 1
  ): number {
    const scopeHeight = ElementAssist.size(element).height;
    const scopeTop = ElementAssist.position(element).top;

    const windowHeight = ElementAssist.window().height;
    const elementTop = ElementAssist.window().scrollTop;

    const scroll = elementTop + windowHeight * (1 - offsetRatio);
    let calc: number = (scroll - scopeTop) / scopeHeight;
    calc = Math.floor(calc * 100);
    return calc;
  }

  /**
   * Checks and updates if necessary the view state of the page when a resize
   * occurs.
   * @param event  Window Event WEB_EVENT_TYPES.RESIZE.
   */
  protected onResizeHandler(event: Event): void {
    this.setConfig();
  }

  /**
   * Handler that sets the page to the top to prevent refreshes loading the
   * page in the middle of a section.
   * @param event Window Event WEB_EVENT_TYPES.ON_BEFORE_UNLOAD.
   */
  private onBeforeUnloadHandler(event: Event): void {
    window.scrollTo(0, 0);
  }
}
