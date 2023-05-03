import { Section } from '@base/section';
import { TAnimationProperties } from '@base/constants/types';
/**
 * Work History section of Code Responsibly. Section can be components or
 * contain multiple components.
 * !Sections are qualified by having an id attribute at the parent level or
 * !the first child occurence of the id attribute.
 *
 * <section class='panel work-history'>
 *   ..
 *     <div id='work-history'>..</div>
 *   ..
 * </section>
 */
export declare class WorkHistory extends Section {
    private hairstyles;
    private companies;
    readonly transforms: TAnimationProperties[];
    /**
     * subclassing Section -> Component -> CoreElement.
     * @param elementID the indentifier to search for regardless of whether the
     * id attribute is in the section tag or belongs to a child of the section
     * tag.
     */
    constructor(elementID: string);
    /**
     * The companies in grid are asked to animate in.
     * !The main app overseeing scrolling behavior calls this method
     * !for When this section comes intov view
     */
    animate(): void;
    /**
     * Special behavior given to this section as updating theme will not only
     * result in the background color changing, but specific images updates to
     * match the theme.
     * @param theme the specific color scheme used at the app-level.
     */
    updateTheme(theme: string): void;
    /**
     * method to handle all functionality needed to appropriately initialized
     * the component. Hairstyles in the work grid are fed the pool of possible
     * transitions for random Mouse Over actions.
     */
    protected init(): void;
}
