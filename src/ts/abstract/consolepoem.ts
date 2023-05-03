/**
 * Poem construct to output to console because folks love looking at console.
 */
enum SITE_POEM {
  WORD_FROM_OUR_SPONSOR = 'A WORD FROM OUR SPONSOR',
  START_DASHED_LINE = '          -----        ',
  LINE_1 = 'These violent delights have violent ends',
  LINE_2 = 'And in their triumph die, like fire and powder,',
  LINE_3 = 'Which as they kiss consume: the sweetest honey',
  LINE_4 = 'Is loathsome in his own deliciousness',
  LINE_5 = 'And in the taste confounds the appetite:',
  LINE_6 = 'Therefore love moderately; long love doth so;',
  LINE_7 = 'Too swift arrives as tardy as too slow.',
  END_DASHED_LINE = '          -----        ',
}

/**
 * ConsolePoem abstract Class with the simple taslks of printing a poem to
 * console. Used previously across sites once in Production.
 * ! This is ideally used after the site has completedly loaded with no
 * ! errors or warnings and the console is bare in production.
 *
 * ! Post-Load Error Handling is handled gracefully by an error manager
 * ! handling with appropriate messaging upon catch / throws.
 */
export abstract class ConsolePoem {
  
  /**
   * Takes the defined site poem data structure and outputs to the console
   * line by line.
   */
  public static publish(): void {
    let poem = '\n';

    for (const line of Object.values(SITE_POEM)) {
      poem += line + '\n';
    }
    console.log(poem);
  }
}
