import {Component} from '@base/component';
import {WEB_EVENT_TYPES} from '@base/constants/types';

/**
 * Data structure of all possible tag & class references required
 * to componetize the the Leadership Principles Section.
 */
enum CURSOR_ELEMENTS {
  CURSOR = '.fuzzy-cursor',
  CURSOR_LINK = 'fuzzy-cursor--link',
}

/**
 * Fuzzy Cursor is a custom cursor component where the element attaches itself
 * to the mouse cursor whenever the user hovers over any anchor elements or
 * elements with nested anchors.
 */
export class FuzzyCursor extends Component {
  private cursorInitialized: boolean;
  private mouseX: number;
  private mouseY: number;

  /**
   * subclassing Component -> CoreElement.
   * @param elementID the indentifier to search for marking the main container
   * of the component.
   */
  constructor(elementID: string) {
    super(elementID);

    this.init();
    this.applyListeners();
    this.animate();
  }

  /**
   * Check whether or not the cursor has been assigned listeners, is
   * visible, etc.
   * @returns true if the cursor is available
   */
  public isCursorInitialized(): boolean {
    return this.cursorInitialized;
  }

  /**
   * Alloows the styled custor element to animate at 60fps to the coordinates
   * of the mouse pointer.
   */
  public animate(): void {
    this.container.head.style.left = this.mouseX + 'px';
    this.container.head.style.top = this.mouseY + 'px';
    requestAnimationFrame(() => this.animate());
  }

  /**
   * Initialized the cursor on the method request for the cursor element
   * to display.
   * @param mouseX the horzontal axis the cursor element should appear.
   * @param mouseY the verical axis the cursor element should appear.
   */
  public show(mouseX: number, mouseY: number): void {
    this.mouseX = mouseX;
    this.mouseY = mouseY;

    if (!this.cursorInitialized) {
      this.container.head.style.opacity = '1';
      this.cursorInitialized = true;
    }
  }

  /**
   * De-Initializes the cursor and hides it from view.
   */
  public hide(): void {
    this.container.head.style.opacity = '0';
    this.cursorInitialized = false;
  }

  /**
   * Initializes component by fetching, calculating what's necessary up front.
   * Finds and keeps reference to all anchor tags in the HTML documnet.
   */
  private init(): void {
    const returnedLinks: NodeListOf<HTMLAnchorElement> =
      document.querySelectorAll('a');

    for (const link of returnedLinks) {
      this.links.push(link);
    }
    this.cursorInitialized = false;
  }

  /**
   * Applys listeners to all anchor links located in the HTML doc so that
   * the cursor-dedicated element can appear or disappear based on the hover
   * state of any individual link.
   */
  protected override applyListeners(): void {
    this.linklisteners = [];
    for (let i = 0; i < this.links.length; i++) {
      this.links[i].addEventListener(
        WEB_EVENT_TYPES.MOUSE_OVER,
        (event: MouseEvent) => this.onLinkMouseOverHandler(event)
      );
      this.links[i].addEventListener(
        WEB_EVENT_TYPES.MOUSE_OUT,
        (event: MouseEvent) => this.onLinkMouseOutHandler(event)
      );
    }
  }

  /**
   * Adds the necesary styled class to the cursor element from when the cursor is over
   * an anchor tag.
   * @param event Mouse Over Event for when the user hovers any and all links.
   */
  private onLinkMouseOverHandler(event: MouseEvent): void {
    this.container.head.classList.add(CURSOR_ELEMENTS.CURSOR_LINK);
  }

  /**
   * Removes the necesary styled class to the cursor element from when the cursor
   * has left an anchor tag.
   * @param event Mouse Out Event for when the user hovers any and all links.
   */
  private onLinkMouseOutHandler(event: MouseEvent): void {
    this.container.head.classList.remove(CURSOR_ELEMENTS.CURSOR_LINK);
  }
}
