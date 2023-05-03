import {CodeResponsibly} from '@components/coderesponsibly';

/**
 * Initialziing of CodeResponsibly, subclass of site.ts,
 * on window load
 */
window.onload = function () {
  const sitev9: CodeResponsibly = new CodeResponsibly();
  sitev9.init();
};
