import { Section } from '@base/section';
import { SectionKeys, TSectionValues, TActiveSection } from '@base/constants/types';
/**
 * The Site base Class delivers key functionlity to manage full page websites
 */
export declare class Site extends EventTarget {
    readonly SCROLL_OFFSET: number;
    activeSection: TActiveSection;
    previousSection: TActiveSection;
    protected site: Map<SectionKeys, TSectionValues>;
    protected lastScrollTop: number;
    /**
     * subclassing EventTarget. Sets up the site manager, and stores the view
     * mode of the site whether we're initially in Desktop or non-desktop view.
     */
    constructor();
    /**
     * When a refresh happens, we start back at the top opposed to allowing
     * refreshes to load the page in the middle of a section.
     */
    protected scrollRestoration(): void;
    /**
     * Stores the view mode of the page by grabbing the CSS global variable.
     * The page is either in desktop or non-desktop mode.
     */
    protected setConfig(): void;
    /**
     * Adds baseline listeners required for full-page websites, such as page
     * resizes since it changes the scroll percentage and possibly viewport
     * height effecting all sections.
     */
    protected applyListeners(): void;
    /**
     * Registers the section instance with the website and sets the site manager
     * map to appropriate section values where we keep track of the:
     * parent, the top most valid container of a section.
     * head: the first container in the section which has an id attribute.
     * children: any additional containers have have an id attribute.
     * theme: data-theme attribute at the top most container, the parent.
     * @param args a list of instances that extend the Section base class.
     */
    protected register(...args: Section[]): void;
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
    private findTopMostValidContainer;
    /**
     * Checks each section to see if it is considered active.
     * @returns the new active section, otherwise, returns the currently active
     * section.
     */
    protected checkForActiveSection(): TActiveSection;
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
    protected isSectionActive(panelName: SectionKeys, element: HTMLElement): TActiveSection | null;
    /**
     * Checks to see if the section (or any element) is actually in view.
     * @param element HTMLElement we check to see if it has entered into
     * the viewport
     * @param offsetRatio if no offset ratio is passed in, the section must be
     * 100% visible to be considered active.
     * @returns true if the section is in fact in view by meeting the threshold
     * otherwise, false.
     */
    protected isSectionInView(element: HTMLElement, offsetRatio?: number): boolean;
    /**
     * Figures out the correct scroll percentage of an acrtive section given
     * that the window height can resize, and offset ratio may change across
     * different sections.
     * @param element HTMLElement within the viewport now considered active.
     * @param offsetRatio if no offset ratio is passed in, the section must be
     * 100% visible to be considered active.
     * @returns percentage out of a 100 of how much of the section is visible.
     */
    protected updateActiveScrollPercentage(element: HTMLElement, offsetRatio?: number): number;
    /**
     * Checks and updates if necessary the view state of the page when a resize
     * occurs.
     * @param event  Window Event WEB_EVENT_TYPES.RESIZE.
     */
    protected onResizeHandler(event: Event): void;
    /**
     * Handler that sets the page to the top to prevent refreshes loading the
     * page in the middle of a section.
     * @param event Window Event WEB_EVENT_TYPES.ON_BEFORE_UNLOAD.
     */
    private onBeforeUnloadHandler;
}
