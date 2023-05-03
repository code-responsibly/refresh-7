import {Component} from '@base/component';

/**
 * A ScrollComponent Class is defined as one or more containers that depend on
 * an Intersection Observer to intro, outro, or deliver extra functionality
 * based on observer options that may be limited but not exclusively to, for
 * example, an intersection ratio and threshhold being met of any
 * children containers.
 */
export class ScrollComponent extends Component {
  protected observer: IntersectionObserver;
  protected observerOptions: object;

  /**
   * subclassing Component -> CoreElement.
   * @param elementID the indentifier to search for marking the main container
   * of the component.
   */
  constructor(elementID: string) {
    super(elementID);

    this.observerOptions = {
      rootMargin: '0px 0px 0px 0px',
      threshold: 0.2,
    };

    this.init();
  }

  /**
   * method to handle all functionality needed to appropriately initialized
   * the component. For ScrollComponent, the IntersectionObserve is set up.
   */
  protected init(): void {
    this.initObserver();
  }

  /**
   * Sets up the InteserctionObserver and sets an observe to all the containers
   * within the component.
   */
  protected initObserver(): void {
    const callback = (
      entries: IntersectionObserverEntry[],
      observer: IntersectionObserver
    ) => this.observerCallbackHandler(entries, observer);

    this.observer = new IntersectionObserver(callback, this.observerOptions);

    const target: HTMLElement[] = this.getAllContainers();
    target.forEach(target => this.observer.observe(target));
  }

  /**
   * The handler that checks for when an entry enters into the viewport at
   * 20% visibility. Animates in the Index Number, the Title, and Copy that
   * make up the elements of a Single Principle Item.
   * @param entries A series of items the IntersectionObserver is aware of.
   * @param observer the IntersectionObserver that chekcs for entries entering
   * into the viewport.
   * @todo interface this method(implements IScrollComponent)
   */
  protected observerCallbackHandler(
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver
  ): void {
    /** Empty Callback Passed */
  }
}
