import {ScrollComponent} from '@base/scrollcomponent';

/**
 * InfoGrid represents the grid items in The Personals section of the site.
 * Children of the parent component that share the same tag
 * structure. Checks for when a single element enters into the viewport via
 * IntersectionObserver, and animates in various elements that make up a single
 * Grid Item.
 */
export class InfoGrid extends ScrollComponent {
  /**
   * subclassing ScrollComponent -> Component -> CoreElement.
   * @param elementID the indentifier to search for marking the main container
   * of the component.
   */
  constructor(elementID: string) {
    super(elementID);

    this.observerOptions = {
      rootMargin: '0px 0px 0px 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1],
    };
    this.init();
  }

  /**
   * Animates any necessary elements.
   * @todo interface this method (implments IPrincipleItem)
   */
  public intro(): void {
    /** */
  }

  /**
   * The handler that checks for when an entry enters into the viewport at
   * 25% visibility. Loops through ever element
   * @param entries A series of items the IntersectionObserver is aware of.
   * @param observer the IntersectionObserver that chekcs for entries entering
   * into the viewport.
   */
  protected override observerCallbackHandler(
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver
  ): void {
    entries.map((entry: IntersectionObserverEntry) => {
      if (entry.intersectionRatio >= 0.25) {
        const items: NodeListOf<HTMLElement> =
          entry.target.querySelectorAll(':scope > span, li');
        let delay = 0;

        for (const item of items) {
          item.style.animationDelay = delay + 's';
          item.style.animationPlayState = 'running';
          delay += 0.12;
        }
      }
    });
  }
}
