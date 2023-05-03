import {Section} from '@base/section';
import {InfoGrid} from '@sections/personals/infogrid';

/**
 * Data structure representing section-specific style classes.
 */
enum TOPFIVEGRID_ELEMENTS {
  MAIN_GRID = '.column-grid',
  COLUMN = '.column-grid .info-column',
}

/**
 * The Personals section of Code Responsibly. Section can be components or
 * contain multiple components.
 * !Sections are qualified by having an id attribute at the parent level or
 * !the first child occurence of the id attribute.
 *
 * <section class='panel personals'>
 *   ..
 *     <div id='personals'>..</div>
 *   ..
 * </section>
 */
export class Personals extends Section {
  private gridItems: InfoGrid;

  /**
   * subclassing Section -> Component -> CoreElement.
   * @param elementID the indentifier to search for regardless of whether the
   * id attribute is in the section tag or belongs to a child of the section
   * tag.
   */
  constructor(elementID: string) {
    super(elementID);

    this.gridItems = new InfoGrid(TOPFIVEGRID_ELEMENTS.COLUMN);
  }
}
