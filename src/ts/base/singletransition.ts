import {TypeGuard} from '@abstract/typeguard';
import {Component} from '@base/component';
import {TAnimationProperties, WEB_EVENT_TYPES} from '@base/constants/types';

/**
 * Data Structure to hold a variety of mouse over transitions and which
 * specific transition was last or curently selected
 */
interface TMouseOverTransitions {
  selected: number;
  variations: TAnimationProperties[];
}

/**
 * Single Transition (Not Animations*) allows for an element to have
 * several transition states assigned to it for looping as the user mouses
 * over and off multiple times, for variety purposes.
 */
export class SingleTransition extends Component {
  //The transtion style to return to the normal state
  public resetTransitionStyle: string;

  //Determines if transitions will be randomized or in order
  public useRandomTransitions = false;

  //Holds transitions styling, 1 Transition would be the standard functonality
  private transitions: TMouseOverTransitions;

  /**
   * subclassing Component -> CoreElement.
   * @param elementID the indentifier to search for marking the main container
   * of the component.
   */
  constructor(elementID: string) {
    super(elementID);
    this.init();
  }

  /**
   * Stores the transiition styling for later application. Initializes and
   * populates the transition variations.
   * @param variantion a data structure descriptor of a type of transition
   */
  public createTransitions(variantion: TAnimationProperties): void {
    if (!this.transitions) {
      this.transitions = {selected: 0, variations: []};
    }

    this.transitions.variations.push(variantion);
  }

  /**
   * single method to to handle Mouse Enter, Mouse Leave, and Click states.
   * elements transform property is set reset on Mouse Leave, however, Mouse
   * Enter and Click are treated the same and a random or next-in line
   * transition is applied.
   * @param event MouseEvent.CLICK / MOUSE_ENTER / MOUSE_LEAVE
   */
  protected animate(event: MouseEvent): void {
    const elementTarget: HTMLElement = TypeGuard.cast(event.currentTarget);
    const element: HTMLElement = TypeGuard.guardForNull(
      elementTarget.querySelector('img:first-of-type')
    );

    if (
      event.type === WEB_EVENT_TYPES.MOUSE_ENTER ||
      event.type === WEB_EVENT_TYPES.CLICK
    ) {
      const animation: TAnimationProperties =
        this.useRandomTransitions === true
          ? this.getRandomTransition()
          : this.getNextTransition();

      element.style.transform = animation.transform;
    } else {
      element.style.transform = this.resetTransitionStyle;
    }
  }

  /**
   * method to handle all functionality needed to appropriately initialized
   * the component. For SingleTransitions, applying the listeners immediately
   * is dependent-critical for the functionality of the component.
   */
  protected init(): void {
    this.applyListeners();
  }

  /**
   * Adds listeners to all (or one) HTML Elements found in the component.
   */
  protected applyListeners(): void {
    const containers: HTMLElement[] = this.getAllContainers();

    for (let i = 0; i < containers.length; i++) {
      containers[i].addEventListener(
        WEB_EVENT_TYPES.MOUSE_ENTER,
        (event: MouseEvent) => this.animate(event)
      );
      containers[i].addEventListener(
        WEB_EVENT_TYPES.MOUSE_LEAVE,
        (event: MouseEvent) => this.animate(event)
      );
      containers[i].addEventListener(
        WEB_EVENT_TYPES.CLICK,
        (event: MouseEvent) => this.animate(event)
      );
    }
  }

  /**
   * Gets the next transition in the series in circular pattern.
   * @returns the next applicable transition variation.
   */
  private getNextTransition(): TAnimationProperties {
    let selected: number = this.transitions.selected;
    selected =
      selected === this.transitions.variations.length ? 0 : selected + 1;

    this.transitions.selected = selected;
    return this.transitions.variations[this.transitions.selected];
  }

  /**
   * Gets the previous transition in the series in circular pattern.
   * @returns the previous applicable transition variation.
   */
  private getpreviousTransition(): TAnimationProperties {
    let selected: number = this.transitions.selected;
    selected =
      selected === 0 ? this.transitions.variations.length - 1 : selected - 1;

    this.transitions.selected = selected;
    return this.transitions.variations[this.transitions.selected];
  }

  /**
   * Gets a random transition in the series.
   * @returns the next random transition variation that does not repeat the
   * previously selected transition.
   */
  private getRandomTransition(): TAnimationProperties {
    let selected = this.transitions.selected;
    while (selected === this.transitions.selected) {
      selected = Math.floor(Math.random() * this.transitions.variations.length);
    }

    this.transitions.selected = selected;
    return this.transitions.variations[selected];
  }
}
