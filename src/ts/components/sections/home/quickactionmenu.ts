import {Component} from '@base/component';
import {WEB_EVENT_TYPES} from '@base/constants/types';

/**
 * Quick Action Menu in the Home Section allows for an top call-to-actions to
 * stand out beyond the items in the nav. The Quick Action animates in and out
 * when the home section enters or exits into viewport.
 */
export class QuickActionMenu extends Component {
  private menuItems: NodeListOf<HTMLSpanElement>;

  //Event Listeners stored to be able to remove if necessary.
  private transitionEndListener: (event: TransitionEvent) => void;
  private transitionStartListener: (event: TransitionEvent) => void;
  private animateOut: boolean;

  /**
   * subclassing Component -> CoreElement.
   * @param elementID the indentifier to search for marking the main container
   * of the component.
   */
  constructor(elementId: string) {
    super(elementId);
    this.preventRepaintReflow();
    this.applyListeners();
  }

  /**
   * A single method to handle if the quick action should animate in or out.
   * @param animateOut if set to true, the quick action animates out of the
   * viewport. By default, the menu has animated in upon load.
   */
  public animate(animateOut = true): void {
    this.animateOut = animateOut;

    if (animateOut) {
      this.menuItems[0].style.transform = 'translateX(-50vw)';
      this.menuItems[2].style.transform = 'translateX(50vw)';
    } else {
      this.menuItems[0].style.transform = 'translateX(0vw)';
      this.menuItems[2].style.transform = 'translateX(0vw)';
    }
  }

  /**
   * a method intended to be called once to hold onto elements the section
   * needs to prevent further dom calls that could result in repaint or reflow.
   */
  private preventRepaintReflow(): void {
    this.menuItems = this.container.head.querySelectorAll('span');
  }

  /**
   * Adds transition listeners only to the first element as it's unneccessary
   * to adda listener to every menuItem. If we know all menu items will animate
   * at the same time for the same amount of time, one listner suffices.
   */
  protected override applyListeners(): void {
    super.applyListeners();

    this.transitionStartListener = (event: TransitionEvent) =>
      this.transitionStartHandler(event);
    this.menuItems[0].addEventListener(
      WEB_EVENT_TYPES.TRANSITION_RUN,
      this.transitionStartListener
    );

    this.transitionEndListener = (event: TransitionEvent) =>
      this.transitionEndHandler(event);
    this.menuItems[0].addEventListener(
      WEB_EVENT_TYPES.TRANSITION_END,
      this.transitionEndListener
    );
  }

  /**
   * Handler for when the transition has been initiated to start.
   * @param event TransitionEvent.TRANSITION_RUN
   */
  private transitionStartHandler(event: TransitionEvent): void {
    this.menuItems[0].style.visibility = 'visible';
    this.menuItems[2].style.visibility = 'visible';
  }

  /**
   * Handler for when the transition has completed.
   * @param event TransitionEvent.TRANSITION_OUT
   */
  private transitionEndHandler(event: TransitionEvent): void {
    if (this.animateOut) {
      this.menuItems[0].style.visibility = 'hidden';
      this.menuItems[2].style.visibility = 'hidden';
    }
  }
}
