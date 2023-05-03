import {Section} from '@base/section';

/**
 * Data structure of all possible tag & class references required
 * to componetize the the Leadership Principles Section.
 */
export enum ABOUTME_ELEMENTS {
  LINKS_COLLECTION = '.copy-paragraph-container',
}

/**
 * About Me section of Code Responsibly. Section can be components or contain
 * multiple components.
 * !Sections are qualified by having an id attribute at the parent level or
 * !the first child occurence of the id attribute.
 *
 * <section class='panel about'>
 *   ..
 *     <div id='about'>..</div>
 *   ..
 * </section>
 */
export class AboutMe extends Section {
  /**
   * subclassing Section -> Component -> CoreElement.
   * @param elementID the indentifier to search for regardless of whether the
   * id attribute is in the section tag or belongs to a child of the section
   * tag.
   */
  constructor(elementID: string) {
    super(elementID);

    this.setLinks(ABOUTME_ELEMENTS.LINKS_COLLECTION);
  }
}
