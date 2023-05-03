/**
 * ConsolePoem abstract Class with the simple taslks of printing a poem to
 * console. Used previously across sites once in Production.
 * ! This is ideally used after the site has completedly loaded with no
 * ! errors or warnings and the console is bare in production.
 *
 * ! Post-Load Error Handling is handled gracefully by an error manager
 * ! handling with appropriate messaging upon catch / throws.
 */
export declare abstract class ConsolePoem {
    /**
     * Takes the defined site poem data structure and outputs to the console
     * line by line.
     */
    static publish(): void;
}
