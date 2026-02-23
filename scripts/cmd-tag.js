'use strict';

hexo.extend.tag.register('cmd', function (args) {
  const command = args[0] || '';
  const filepath = args.slice(1).join(' ');

  return `<div class="cmd-wrapper">` +
    `<span class="cmd-prompt">$</span>` +
    `<span style="color:var(--blue)">${command}</span>` +
    `<span>\u00a0</span>` +
    `<span style="color:var(--mauve)">${filepath}</span>` +
    `<span class="cmd-cursor">_</span>` +
    `</div>`;
});
