import {Section} from '@base/section';
import {MY_PRINCIPLES_ELEMENTS} from '@sections/leadershiplist/constants/types';
import {PrincipleItems} from '@sections/leadershiplist/principleitems';

/**
 * My Leadership Principles section of Code Responsibly. Section can be
 * components or contain multiple components.
 * !Sections are qualified by having an id attribute at the parent level or
 * !the first child occurence of the id attribute.
 *
 * <section class='panel my-principles'>
 *   ..
 *     <div id='my-principles'>..</div>
 *   ..
 * </section>
 */
export class LeadershipPrinciples extends Section {
  private items: PrincipleItems;

  /**
   * subclassing Section -> Component -> CoreElement.
   * @param elementID the indentifier to search for regardless of whether the
   * id attribute is in the section tag or belongs to a child of the section
   * tag.
   */
  constructor(elementID: string) {
    super(elementID);
    this.items = new PrincipleItems(MY_PRINCIPLES_ELEMENTS.RULES_ITEM);
  }

  /**
   * Intros the animate list, ideally when the section comes into the viewport.
   */
  public animate(): void {
    this.items.intro();
  }
}
