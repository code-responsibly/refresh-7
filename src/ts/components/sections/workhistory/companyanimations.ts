import {TypeGuard} from '@abstract/typeguard';
import {Component} from '@base/component';
import {OverlayAnimation} from '@base/overlayanimation';

/**
 * CompanyAnimations represents the company elements in the grid of the Work
 * History section of the site. Children of the parent component that share
 * the same tag structure.
 *
 * Sets queue capable functionality for when a user clicks(desktop / mobile),
 * hovers on and off the component gracefully manages animation and
 * transitions to prevent skips or jumps for when a user hovers on and off
 * quickly or clicks repeatedly on the element during transition/animation.
 *
 * !This purposely uses style.transform for transitions and classes for
 * !animations to showcase an age old CSS problem of how to queue
 * !transitions and animations and prevent user breaks.
 * !For example of css transition-based(not animation) class property
 * !handling, please review SingleTransition.ts
 */
export class CompanyAnimations extends Component {
  private companies: OverlayAnimation[];

  /**
   * subclassing Component -> CoreElement.
   * @param elementID the indentifier to search for marking the main container
   * of the component.
   */
  constructor(elementID: string) {
    super(elementID);
    this.companies = [];

    this.init();
  }

  /**
   * Animates in the companies in a grid with a delay.
   */
  public intro(): void {
    let delay = 0.35;
    for (let i = 0; i < this.companies.length; i++) {
      this.companies[i].intro(delay);
      delay += 0.35;
    }
  }

  /**
   * Special case of when the theme updates, this component will need
   * to update image paths to update theme specific images.
   *
   * !Filter combinations of saturate, brightness, etc. did not give the
   * !desired effects so falling back on images for the best assets
   * !to align to the color schemes of a theme.
   * @param theme a theme from the Theme Manager or a string value that matches
   * themes that are defined in CSS Variables.
   */
  public updateTheme(theme: string): void {
    const r: HTMLElement = TypeGuard.cast(
      document.querySelector('section[data-theme=' + theme + ']')
    );
    const rs = getComputedStyle(r);
    const path: string = TypeGuard.cast(
      rs
        .getPropertyValue('--career-grid-company-asset-path')
        .replace(/['"]+/g, '')
        .trim()
    );
    
    for (let i = 0; i < this.companies.length; i++) {
      this.companies[i].update(theme, path);
    }
  }

  /**
   * method to handle all functionality needed to appropriately initialized
   * the component.
   */
  private init(): void {
    this.preventRepaintReflow();
  }

  /**
   * Called once to hold onto elements the component needs to prevent
   * further dom calls that could result in repaint or reflow.
   *
   * Loops through all the containers and creates instanecs of
   * OverlayAnimation. Assigns all the properties needed for
   * OverlayAnimation to deliver transition and animation styling
   * simultaneously.
   */
  private preventRepaintReflow(): void {
    const containers: HTMLElement[] = this.getAllContainers();

    for (let i = 0; i < containers.length; i++) {
      this.companies[i] = new OverlayAnimation();
      this.companies[i].basePath = '/assets/work-history';
      this.companies[i].rollOverTransitionStyle =
        'rotateX(15deg) rotateY(15deg)';
      this.companies[i].rollOutTransitionStyle = 'rotateX(0deg) rotateY(0deg)';
      this.companies[i].introAnimationClass = 'company-intro';
      this.companies[i].rollOverAnimationClass = 'company-rollover';
      this.companies[i].rollOutAnimationClass = 'company-rollout';

      this.companies[i].container = {head: containers[i]};
    }
  }
}
