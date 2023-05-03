/**
 * Data structure to meet Position requirements.
 * Alternative map to JQuery's position method.
 */
interface TPosition {
  top: number;
  left: number;
}

/**
 * Data structure to meet global Window object properties.
 * Alternative map to JQuery's global window object.
 * !many properties ommitted on purpose. Only two properties we care for.
 */
interface TWindow {
  scrollTop: number;
  height: number;
}

/**
 * Data structure to meet size requirements.
 * Alternative map to JQuery's position method.
 */
interface TSize {
  width: number;
  height: number;
}

/**
 * Abstract Class that takes an HTMLElement or provides access to the global
 * windoe object to contrain overuse.
 *
 * The purpose of this class is to map property names and calculated values to
 * JQuery's similarly named  methods and properties not readily available in TypeScript.
 * Thereby removing the need to import JQuery to simply access methods, parameters
 * we've become very accustomed to using in everyday applicable use.
 *
 * For example: $window.scrollTop does not exist on this.window.
 * $('element').width() does not return the same value as element.clientWidth,
 * offsetWidth, or scrollWidth.
 */
export abstract class ElementAssist {
  public static window(): TWindow {
    const windowParams: TWindow = {
      scrollTop: window.scrollY,
      height: window.innerHeight,
    };

    return windowParams;
  }

  /**
   * Calcultes the top and left values of an HTML Elemnt as JQuery.
   * @param element the html element to get the correct top and left coordinates
   * that aligns to JQuery.
   * @returns the position data structure of top and left values for the element.
   */
  public static position(element: HTMLElement): TPosition {
    const parentRect = (element.offsetParent &&
      element.offsetParent.getBoundingClientRect()) || {top: 0, left: 0};
    const elemRect = element.getBoundingClientRect();

    const coordinates: TPosition = {
      top: elemRect.top - parentRect.top,
      left: elemRect.left - parentRect.left,
    };

    return coordinates;
  }

  /**
   * Calcultes the width and height values of an HTML Elemnt similar to JQuery
   * by taking into account the border and padding width and height.
   * @param element the html element to get the correct top and left coordinates
   * that aligns to JQuery.
   * @returns the size data structure of width and height values for the element.
   */
  public static size(element: HTMLElement): TSize {
    const cs = getComputedStyle(element);
    const paddingX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
    const paddingY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    const borderX =
      parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);
    const borderY =
      parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
    const sizeHeight = parseFloat(cs.height);
    const sizeWidth = parseFloat(cs.width);

    const size: TSize = {
      width: sizeWidth - paddingX - borderX,
      height: sizeHeight - paddingY - borderY,
    };

    return size;
  }

  /**
   * Allows access to to the scrolltop value, aligning to JQuery's
   * $(window).scrollTop.
   * @returns the vertical scroll value of the window object.
   */
  public static windowScrollTop(): number {
    return window.scrollY;
  }
}
