import { Section } from '@base/section';
/**
 * Data structure of all possible tag & class references required
 * to componetize the the Download Me Section.
 */
export declare enum DOWNLOAD_ME_ELEMENTS {
    STAR_SPINNER = ".star-spinner-container img",
    DOWNLOAD_COUNTER = ".codebase-download-counter",
    DOWNLOAD_LINK = ".download-link"
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
export declare class DownloadMe extends Section {
    private wheel;
    private downloadCopy;
    private downloadLink;
    /**
     * subclassing Section -> Component -> CoreElement.
     * @param elementID the indentifier to search for regardless of whether the
     * id attribute is in the section tag or belongs to a child of the section
     * tag.
     */
    constructor(elementID: string);
    /**
     * Animates the wheel based on how much of the section has been scrolled.
     * !percentage is passed but no longer used since the section uses
     * !position:sticky.
     * @param percentage the amount of scroll for the section to enter and exit
     * the viewport.
     */
    animate(percentage: number): void;
    /**
     * Updates the copy to include the # of times the codebase zip has been
     * downloaded from the site.
     * @param firestoreValue the value retrieved from the firestore.
     */
    updateDownloadCounter(firestoreValue: string | number): void;
    /**
     * Adds necessary listeners such as clicking to download the codebase
     * so that we may update the value in the firestore.
     */
    protected applyListeners(): void;
    /**
     * Called once to hold onto elements the section needs to prevent
     * further dom calls that could result in repaint or reflow.
     */
    private preventRepaintReflow;
    /**
     * The handler for download codebase link being clicked.
     * @param event MouseEvent Click
     */
    private downloadClickedkHandler;
}
