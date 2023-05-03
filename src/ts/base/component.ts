import {AnchorEvent} from '@base/events/anchorevent';
import {CoreElement} from '@base/coreelement';
import {
  SectionKeys,
  TCoreContainer,
  WEB_EVENT_TYPES,
} from '@base/constants/types';
import {TypeGuard} from '@abstract/typeguard';

/**
 * A Component Class is defined as one or more containers with key
 * modular functionality that all compoents can subclass and share
 * commonality.
 */
export class Component extends CoreElement {
  protected _links: HTMLAnchorElement[];
  protected linklisteners: Function[];
  private collectionID: string;
  private toggleGrouping: boolean;

  /**
   * subclassing CoreElement -> EventTarget.
   * @param elementID the indentifier to search for marking the main container
   * of the component.
   */
  constructor(elementID = '') {
    super(elementID);
  }

  /**
   * gets a complex data structure of TCoreContainer which contains
   * head:HTMLElement, children: HTMLElement[].
   */
  public get container(): TCoreContainer {
    return this._container;
  }

  /**
   * Sets the complex data structure or takes a string that gets passed to the
   * superclass setter that handles defining the TCoreContainer.
   */
  public set container(val: TCoreContainer | string) {
    if (this.container !== undefined) {
      this.removeLinkListeners();
    }

    super.container = val;
  }

  /**
   * returns any links identified at the component level.
   */
  public get links(): HTMLAnchorElement[] {
    return this._links;
  }

  /**
   * Looks for all the anchor elements in a collection, stores them for later
   * references, and applys necessary listeners to all anchor tags dound.
   * @param collectionID the parent tag that has a collection of anchor tags.
   * @param allowActiveStateToggle if set true, will pass the active class to
   * any future selected item, and remove the active class if exists on any
   * anchor elements within the same collection.
   */
  protected setLinks(
    collectionID: string,
    allowActiveStateToggle = false
  ): void {
    this.removeLinkListeners();
    this.toggleGrouping = allowActiveStateToggle;
    this._links = [];

    const containers = this.getAllContainers();

    for (let i = 0; i < containers.length; i++) {
      const returnedLinks: NodeListOf<HTMLAnchorElement> = containers[
        i
      ].querySelectorAll(collectionID + ' a');

      for (const link of returnedLinks) {
        this.links.push(link);
      }
    }

    this.applyLinkListeners(collectionID);
    this.collectionID = collectionID;
  }

  /**
   * Looks at collection of nested links by tag type and sets the active class
   * to the selected HTMLAchnorElement.
   * @param parentLinkID the tag name that includes a collection of children
   * anchor tags
   * @param selected the selected item within the collection.
   * @returns null if a collection has not be set
   */
  protected setActiveForSelected(
    parentLinkID: string,
    selected: HTMLAnchorElement
  ): void {
    const containers = this.getAllContainers();
    let selectedGroup: HTMLElement | null = null;

    for (let i = 0; i < containers.length; i++) {
      if (containers[i].contains(selected)) {
        selectedGroup = containers[i];
        break;
      }
    }

    if (!selectedGroup) {
      return;
    }

    const activeLinks: NodeListOf<HTMLAnchorElement> =
      selectedGroup.querySelectorAll(parentLinkID + ' a.active');

    if (activeLinks) {
      for (const link of activeLinks) {
        link.classList.toggle('active');
      }
    }

    selected.classList.toggle('active');
  }

  /**
   * Removes anty pre-existing link listeners and re-applies listeners.
   * Ideally, this is for when a new collection is being addressed.
   */
  protected applyListeners(): void {
    if (this.linklisteners) {
      this.removeLinkListeners();
    }

    this.applyLinkListeners(this.collectionID);
  }

  /**
   * Adds listeners if HTMLAnchorElements are set.
   * @param collectionID the parent tag that has a collection of children
   * anchor tags.
   * @returns null if there are no links found or collection tag of possible
   * children anchor tags was not set.
   */
  private applyLinkListeners(collectionID: string): void {
    if (this.linklisteners) {
      this.removeLinkListeners();
    }

    if (!this.links || collectionID === undefined) {
      return;
    }

    this.linklisteners = [];
    for (let i = 0; i < this.links.length; i++) {
      const listener: (event: MouseEvent) => void = (event: MouseEvent) =>
        this.activeLinkHandler(event, collectionID);

      this.links[i].addEventListener(WEB_EVENT_TYPES.CLICK, listener);
      this.linklisteners.push(listener);
    }
  }

  /**
   * Removes any listeners at the component element.
   */
  protected removeListeners(): void {
    this.removeLinkListeners();
  }

  /**
   * Removes any existing listeners attached to links belonging to a collection
   * @returns null if there are no listeners
   */
  private removeLinkListeners(): void {
    if (!this.linklisteners || this.linklisteners.length === 0) {
      return;
    }

    for (let i = 0; i < this.linklisteners.length; i++) {
      this.links[i].removeEventListener(
        WEB_EVENT_TYPES.CLICK,
        this.linklisteners[i] as EventListener
      );
    }

    this.linklisteners = [];
    this._links = [];
  }

  /**
   * Checks an HTMLAnchorElement to see if the class attribute has passed a
   * special class to force prevent-default action.
   * !There are only two special classes  typescript checks for to determine
   * !extended functionality: 'prevent-default' and 'mobile-ready'.
   * @param link the Anchor Element to check if 'prevent-default' is assigned.
   * @returns true if the special class of prevent-default exists.
   */
  protected checkForPreventDefaultClass(link: HTMLAnchorElement): boolean {
    if (link.classList == undefined) {
      return false;
    }
    return link.classList.contains('prevent-default') ? true : false;
  }

  /**
   * the handler for when an anchor tag is selected. Checks to see if
   * preventDefault exists at the class attribute level of the element or if
   * the parameter forces preventDefault, then dispatches an event to notify
   * the parent class that a selection has been made within the instaniated
   * component.
   * @param event MouseEvent.CLICK
   * @param parentLinkID the parent tag that has a collection of anchor tags.
   * @param preventDefault if the selected anchor element should prevent
   * default action.
   */
  protected activeLinkHandler(
    event: MouseEvent,
    parentLinkID: string,
    preventDefault = false
  ): void {
    const selectedLink: HTMLAnchorElement = TypeGuard.cast(event.currentTarget);

    const preventDefaultHTMLFlag: boolean =
      this.checkForPreventDefaultClass(selectedLink);

    if (preventDefaultHTMLFlag === true || preventDefault === true) {
      event.preventDefault();
      const hrefAttribute: string = TypeGuard.guardForNull(
        selectedLink.getAttribute('href')
      );
      const sectionRequested: SectionKeys = hrefAttribute.substring(
        1
      ) as SectionKeys;

      this.dispatchEvent(
        new AnchorEvent(AnchorEvent.NOTIFY_SELECTION, {
          detail: {sectionRequested: sectionRequested},
        })
      );
    }
    if (this.toggleGrouping) {
      this.setActiveForSelected(parentLinkID, selectedLink);
    }
  }
}
