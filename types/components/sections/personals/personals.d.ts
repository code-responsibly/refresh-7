import { Section } from '@base/section';
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
export declare class Personals extends Section {
    private gridItems;
    /**
     * subclassing Section -> Component -> CoreElement.
     * @param elementID the indentifier to search for regardless of whether the
     * id attribute is in the section tag or belongs to a child of the section
     * tag.
     */
    constructor(elementID: string);
}
