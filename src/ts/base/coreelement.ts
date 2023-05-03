import {TypeGuard} from '@abstract/typeguard';
import {TCoreContainer, WEB_EVENT_TYPES} from '@base/constants/types';

/**
 * A CoreElement Class is defined as one or more containers with key
 * modular functionality that all compoents can subclass and share
 * commonality.
 */
export class CoreElement extends EventTarget {
  //Does this element belong to a common set of items such as li tag.
  public belongsToSeries = false;

  protected _container: TCoreContainer;
  protected seriesKey: string;
  protected mobileClickListeners: Function[] = [];
  protected mobileMouseLeaveListeners: Function[] = [];

  private mobileReadyElements: HTMLElement[] = [];

  /**
   * subclassing EventTarget.
   * @param elementID the indentifier to search for marking the top-most
   * container which indicates to the app is a valid section.
   */
  constructor(elementID = '') {
    super();

    if (elementID !== '') {
      this.container = elementID;

      if (this.container.children) {
        this.belongsToSeries = true;
        this.seriesKey = elementID;
      }
    }
  }

  /**
   * gets a complex data structure of TCoreContainer which contains
   * head:HTMLElement, children: HTMLElement[].
   */
  public get container(): TCoreContainer {
    return this._container;
  }

  /**
   * Sets the complex data structure or takes a string that gets passed to
   * handle setting up container as a proper data type of TCoreContainer.
   */
  public set container(val: TCoreContainer | string) {
    this._container =
      typeof val === 'string'
        ? TypeGuard.guardForNull(this.getQualifiedSelector(val))
        : val;

    this.removeMobileHoverClickListeners();
    this.applyMobileHoverClickListeners();
  }

  /**
   * Checks to see if a string is a valid class or id in the HTML.
   * @param searchKey the expected selector that belongs to an element tag.
   * @returns the searchKey with the correct selector prefix if it is
   * valid within the HTML.
   */
  public getValidSelector(searchKey: string): string | undefined {
    const qualifiers: string[] = ['', '#', '.'];

    for (const qualifier of qualifiers) {
      const updatedElementID: string = qualifier + searchKey;
      const temp: NodeListOf<HTMLElement> =
        document.querySelectorAll(updatedElementID);

      if (temp !== null && temp instanceof NodeList && temp.length > 0) {
        return updatedElementID;
      }
    }

    return undefined;
  }

  /**
   * Checks to see if a string is a valid class or id in the HTML.
   * @param searchKey the expected class or id that belongs to an element tag.
   * @returns true if the selector is valid in the HTML.
   */
  public doesSelectorQualify(searchKey: string): boolean {
    const elementKey = this.getValidSelector(searchKey);
    if (elementKey == undefined) {
      return false;
    }

    return true;
  }

  /**
   * Checks the string for proper formatting of a css selector and then tests
   * to see if the key exists in the HTML as a proper identifier of a single
   * or series of elements.
   * @param searchKey the expected class or id that belongs to an element tag.
   * @returns all occurrences, if any, of TCoreContainer that includes a
   * single occurence(TCoreContainer.head) or multiple occurrences
   * (TCoreContainer.children).
   *
   * ! Head will always be assigned the first occurence whether it is
   * ! at the top-most containet level or the first child that has the
   * ! classname or id attribute.
   */
  protected getQualifiedSelector(searchKey: string): TCoreContainer | null {
    const elementID: string | undefined = this.getValidSelector(searchKey);
    if (elementID == undefined) {
      return null;
    }

    const temp: NodeListOf<HTMLElement> = document.querySelectorAll(elementID);
    if (temp == null || (temp instanceof NodeList && temp.length === 0)) {
      return null;
    }

    const children: HTMLElement[] = [];

    switch (temp.length) {
      case 1:
        return {head: temp.item(0)};
      default:
        for (let i = 1; i < temp.length; i++) {
          children.push(temp.item(i));
        }
        return {head: temp.item(0), children: children};
    }
  }

  /**
   * Converts TCoreContainer: head, children[] as an array series of
   * HTMLElement
   * @returns a easy to access stack to iterate over all containers that share
   * the same key instead of using head / children accessors.
   */
  protected getAllContainers(): HTMLElement[] {
    const allContainers: HTMLElement[] = [];

    if (this._container.head) {
      allContainers.push(this._container.head);
    }

    if (this._container.children && this._container.children.length > 0) {
      for (let i = 0; i < this._container.children.length; i++) {
        allContainers.push(this._container.children[i]);
      }
    }

    return allContainers;
  }

  /**
   * Allows for mobile to experience the desktop hover states when the user
   * touches the element. Adds the appropriate interaction listeners assigned
   * to any container that have the class attribute of 'mobile-ready'.
   *
   * ! mobile-ready is one of two site-wide class names that extend beyond
   * ! styling and determine functionality.
   */
  protected applyMobileHoverClickListeners(): void {
    const allContainers: HTMLElement[] = this.getAllContainers();

    for (let i = 0; i < allContainers.length; i++) {
      const mobileReadyElements: HTMLCollectionOf<Element> =
        allContainers[i].getElementsByClassName('mobile-ready');

      for (const element of mobileReadyElements) {
        const mobileClickListener: (event: MouseEvent) => void = (
          event: MouseEvent
        ) => this.mobileClickHandler(event);
        const mobileMouseLeaveListener: (event: MouseEvent) => void = (
          event: MouseEvent
        ) => this.mobileMouseLeaveHandler(event);
        const assertElement: HTMLElement = TypeGuard.assertInstance(
          HTMLElement,
          element
        );

        assertElement.addEventListener(
          WEB_EVENT_TYPES.CLICK,
          mobileClickListener
        );
        this.mobileClickListeners.push(mobileClickListener);

        assertElement.addEventListener(
          WEB_EVENT_TYPES.MOUSE_LEAVE,
          mobileMouseLeaveListener
        );
        this.mobileMouseLeaveListeners.push(mobileMouseLeaveListener);

        this.mobileReadyElements.push(assertElement);
      }
    }
  }

  /**
   * Removes listeners that enable the mobile experience of users touch
   * enabling the hover states assigned to any container that has the class
   * attribute of 'mobile-ready'.
   *
   * ! mobile-ready is one of two site-wide class names that extend beyond
   * ! styling and determine functionality.
   */
  protected removeMobileHoverClickListeners(): void {
    for (let i = 0; i < this.mobileReadyElements.length; i++) {
      this.mobileReadyElements[i].removeEventListener(
        WEB_EVENT_TYPES.CLICK,
        this.mobileClickListeners[i] as EventListener
      );
      this.mobileReadyElements[i].removeEventListener(
        WEB_EVENT_TYPES.MOUSE_LEAVE,
        this.mobileMouseLeaveListeners[i] as EventListener
      );
    }
  }

  /**
   * Uses a partial  match to search for a potential class name. If found,
   * removes the class name from the elements classlist.
   * @param element element to test the search against
   * @param prefix the partial matich of the class name we're looking for
   */
  protected removeClassByPrefix(element: HTMLElement, prefix: string): void {
    const cssList: string = element.classList.toString();
    if (!cssList) {
      return;
    }
    const r = new RegExp(/(^|\s)placeholder\S+/g);
    const newRE = new RegExp(r.source.replace('placeholder', prefix), 'g');

    let returnedClass: string = (cssList.match(newRE) || []).join(' ');
    if (returnedClass === '') {
      return;
    }

    returnedClass = returnedClass.trim();
    element.classList.remove(returnedClass);
  }

  /**
   * The handler toggles mobile-click which is tied to our hover states in
   * CSS. This is to mimic the functionality of mouse_over and mouse_leave on
   * mobile devices.
   * @param event MouseEvent.CLICK
   */
  protected mobileClickHandler(event: MouseEvent): void {
    (event.currentTarget as HTMLElement).classList.toggle('mobile-click');
  }

  /**
   * The handler remove the mobile-click class to mimic the mouse_leave
   * or 'hover off' functionality available on desktop.
   * @param event MouseEvent.MOUSE_LEAVE
   */
  protected mobileMouseLeaveHandler(event: MouseEvent): void {
    (event.currentTarget as HTMLElement).classList.remove('mobile-click');
  }
}
