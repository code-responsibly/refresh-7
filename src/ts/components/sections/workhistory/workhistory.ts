import {Section} from '@base/section';
import {CompanyAnimations} from '@sections/workhistory/companyanimations';
import {SingleTransition} from '@base/singletransition';
import {TAnimationProperties} from '@base/constants/types';

/**
 * Data structure of all possible tag & class references required
 * to componetize the the Work History Section.
 */
enum WORKGRID_ELEMENTS {
  HAIRSTYLE = '.hairstyle-holder',
  COMPANIES = '.new-job-holder .company-img-container',
}

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
export class WorkHistory extends Section {
  private hairstyles: SingleTransition;
  private companies: CompanyAnimations;

  readonly transforms: TAnimationProperties[] = [
    {transform: 'rotateY(200deg) scale(1)'},
    {transform: 'rotateX(180deg) translate(0, -10px)'},
    {transform: 'rotateY(-200deg) scale(1)'},
    {transform: 'rotateX(-180deg) scale(1)'},
    {transform: 'rotateX(44deg) rotateZ(325deg)'},
    {transform: 'rotateY(180deg) rotateX(44deg) rotateZ(325deg)'},
    {transform: 'rotateX(24deg) rotateZ(180deg)'},
    {transform: 'rotateX(55deg) rotateZ(270deg)'},
    {transform: 'rotateZ(180deg)'},
    {transform: 'rotateZ(270deg)'},
  ];

  /**
   * subclassing Section -> Component -> CoreElement.
   * @param elementID the indentifier to search for regardless of whether the
   * id attribute is in the section tag or belongs to a child of the section
   * tag.
   */
  constructor(elementID: string) {
    super(elementID);

    this.hairstyles = new SingleTransition(WORKGRID_ELEMENTS.HAIRSTYLE);
    this.init();
  }

  /**
   * The companies in grid are asked to animate in.
   * !The main app overseeing scrolling behavior calls this method
   * !for When this section comes intov view
   */
  public animate(): void {
    this.companies.intro();
  }

  /**
   * Special behavior given to this section as updating theme will not only
   * result in the background color changing, but specific images updates to
   * match the theme.
   * @param theme the specific color scheme used at the app-level.
   */
  public updateTheme(theme: string): void {
    if (!this.companies) {
      this.companies = new CompanyAnimations(WORKGRID_ELEMENTS.COMPANIES);
    }
    this.companies.updateTheme(theme);
  }

  /**
   * method to handle all functionality needed to appropriately initialized
   * the component. Hairstyles in the work grid are fed the pool of possible
   * transitions for random Mouse Over actions.
   */
  protected init(): void {
    this.hairstyles.resetTransitionStyle =
      'scale(1) translate(0,0) rotateY(0deg) rotateX(0deg) rotateZ(0deg)';

    for (let i = 0; i < this.transforms.length; i++) {
      this.hairstyles.createTransitions(this.transforms[i]);
    }
  }
}
