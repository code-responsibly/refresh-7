import {SiteEvent} from '@base/events/siteevent';
import {ElementAssist} from '@abstract/elementassist';
import {Section} from '@base/section';
import {WEB_EVENT_TYPES} from '@base/constants/types';
import {TypeGuard} from '@abstract/typeguard';

/**
 * Data structure of all possible tag & class references required
 * to componetize the the Download Me Section.
 */
export enum DOWNLOAD_ME_ELEMENTS {
  STAR_SPINNER = '.star-spinner-container img',
  DOWNLOAD_COUNTER = '.codebase-download-counter',
  DOWNLOAD_LINK = '.download-link',
}

/**
 * Download Codebase section of Code Responsibly. Section can be components or
 * contain multiple components.
 * !Sections are qualified by having an id attribute at the parent level or
 * !the first child occurence of the id attribute.
 *
 * <section class='panel download-me'>
 *   ..
 *     <div id='download-me'>..</div>
 *   ..
 * </section>
 */
export class DownloadMe extends Section {
  private wheel: HTMLElement;
  private downloadCopy: HTMLElement;
  private downloadLink: HTMLElement;

  /**
   * subclassing Section -> Component -> CoreElement.
   * @param elementID the indentifier to search for regardless of whether the
   * id attribute is in the section tag or belongs to a child of the section
   * tag.
   */
  constructor(elementID: string) {
    super(elementID);
    this.preventRepaintReflow();
    this.applyListeners();
  }

  /**
   * Animates the wheel based on how much of the section has been scrolled.
   * !percentage is passed but no longer used since the section uses
   * !position:sticky.
   * @param percentage the amount of scroll for the section to enter and exit
   * the viewport.
   */
  public animate(percentage: number): void {
    const scrollTop: number = ElementAssist.window().scrollTop;
    const offset: number = scrollTop * 0.8;
    //let percentage =  scrollTop / this.container.offsetHeight;
    //percentage = Math.round(percentage * 100) / 100;

    this.wheel.style.transform = 'rotate(' + offset + 'deg)';
  }

  /**
   * Updates the copy to include the # of times the codebase zip has been
   * downloaded from the site.
   * @param firestoreValue the value retrieved from the firestore.
   */
  public updateDownloadCounter(firestoreValue: string | number): void {
    this.downloadCopy.textContent = firestoreValue.toLocaleString('en-US');
  }

  /**
   * Adds necessary listeners such as clicking to download the codebase
   * so that we may update the value in the firestore.
   */
  protected override applyListeners(): void {
    super.applyListeners();

    const downloadClickListener = (event: MouseEvent) =>
      this.downloadClickedkHandler(event);

    this.downloadLink.addEventListener(
      WEB_EVENT_TYPES.CLICK,
      downloadClickListener
    );
  }

  /**
   * Called once to hold onto elements the section needs to prevent
   * further dom calls that could result in repaint or reflow.
   */
  private preventRepaintReflow(): void {
    this.wheel = TypeGuard.cast(
      document.querySelector(DOWNLOAD_ME_ELEMENTS.STAR_SPINNER)
    );
    this.downloadLink = TypeGuard.cast(
      document.querySelector(DOWNLOAD_ME_ELEMENTS.DOWNLOAD_LINK)
    );
    this.downloadCopy = TypeGuard.cast(
      document.querySelector(DOWNLOAD_ME_ELEMENTS.DOWNLOAD_COUNTER)
    );
  }

  /**
   * The handler for download codebase link being clicked.
   * @param event MouseEvent Click
   */
  private downloadClickedkHandler(event: MouseEvent): void {
    this.dispatchEvent(new SiteEvent(SiteEvent.TRACK_CLICK));
  }
}
