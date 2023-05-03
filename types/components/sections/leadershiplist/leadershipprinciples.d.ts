import { Section } from '@base/section';
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
export declare class LeadershipPrinciples extends Section {
    private items;
    /**
     * subclassing Section -> Component -> CoreElement.
     * @param elementID the indentifier to search for regardless of whether the
     * id attribute is in the section tag or belongs to a child of the section
     * tag.
     */
    constructor(elementID: string);
    /**
     * Intros the animate list, ideally when the section comes into the viewport.
     */
    animate(): void;
}
