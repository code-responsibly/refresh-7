import {TypeGuard} from '@abstract/typeguard';
import {ScrollComponent} from '@base/scrollcomponent';
import {MY_PRINCIPLES_ELEMENTS} from '@sections/leadershiplist/constants/types';

/**
 * PrincipleItems are siblings to the parent component that share the same tag
 * structure. Checks for when a single element enters into the viewport via
 * IntersectionObserver, and animates in various elements that make up a single
 * Principle Item.
 */
export class PrincipleItems extends ScrollComponent {
  //svgs are passed in to reposition accordingly to the baseline.
  private svgs: NodeListOf<SVGGraphicsElement>;

  /**
   * subclassing ScrollComponent -> Component -> CoreElement.
   * @param elementID the indentifier to search for marking the main container
   * of the component.
   */
  constructor(elementID = '') {
    super(elementID);
  }

  /**
   * Animates any necessary elements.
   * @todo interface this method (implments IPrincipleItem)
   */
  public intro(): void {
    /** */
  }

  /**
   * Handle all functionality needed to appropriately initialized the
   * component. For PrincipeItems, we fetch all SVGs and set the correct
   * size after the font is applied to the text tag.
   * !SVG  width and height attributes cannot be predetermined in
   * !the HTML due to the font / bounding box varying for each text tag.
   * !Obviously, every svg tag should alwyas have a width/height attribute.
   */
  protected override init(): void {
    super.init();

    this.svgs = TypeGuard.guardForNull(
      document.querySelectorAll(MY_PRINCIPLES_ELEMENTS.SVGS)
    );
    this.repositionSVGTextBox();
  }

  /**
   * The handler that checks for when an entry enters into the viewport at
   * 20% visibility. Animates in the Index Number, the Title, and Copy that
   * make up the elements of a Single Principle Item.
   * @param entries A series of items the IntersectionObserver is aware of.
   * @param observer the IntersectionObserver that chekcs for entries entering
   * into the viewport.
   */
  protected override observerCallbackHandler(
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver
  ): void {
    entries.map((entry: IntersectionObserverEntry) => {
      if (entry.intersectionRatio >= 0.2) {
        const elementTarget: HTMLElement = TypeGuard.assertInstance(
          HTMLElement,
          entry.target
        );
        const principleNumber: HTMLElement = TypeGuard.guardForNull(
          elementTarget.querySelector(MY_PRINCIPLES_ELEMENTS.SVG_NUMBER)
        );
        const principleText: HTMLElement = TypeGuard.guardForNull(
          elementTarget.querySelector(MY_PRINCIPLES_ELEMENTS.HEADLINE_TEXT)
        );
        const principleCopy: HTMLElement = TypeGuard.guardForNull(
          elementTarget.querySelector(MY_PRINCIPLES_ELEMENTS.COPY_TEXT)
        );

        principleNumber.style.animationPlayState = 'running';
        principleText.style.animationPlayState = 'running';
        principleCopy.style.animationPlayState = 'running';
      }
    });
  }

  /**
   * Aligns SVGs to the baseline by setting the appropriate width and height
   * on every svg tag after the font renders the text tag.
   *
   * !SVGs are used for the index number of the principle in view.  The width
   * ! and height are different for every SVG. We figure it out after it's
   * ! been applied due to font of SVG varying the the width and height.
   */
  protected repositionSVGTextBox(): void {
    for (const el of this.svgs) {
      const bbox = el.getBBox();
      el.setAttribute('width', bbox.width + 'px');
      el.setAttribute('height', el.clientHeight + 8 + 'px');
    }
  }
}
