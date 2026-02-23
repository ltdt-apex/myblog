'use strict';

// Fix hardcoded paths and text in the gnix theme without modifying node_modules.
// The theme hardcodes asset paths like src="/js/..." and href="/css/..." without
// using Hexo's url_for(), which breaks when deployed to a subpath like /myblog/.

const getRoot = () => hexo.config.root || '/';

hexo.extend.filter.register('after_render:html', function (str) {
  const root = getRoot();
  if (root === '/') return str;

  const title = hexo.config.title || 'Blog';

  // Fix all hardcoded src="/js/..." and href="/css/..." paths
  str = str.replace(/\bsrc="\/js\//g, `src="${root}js/`);
  str = str.replace(/\bhref="\/css\//g, `href="${root}css/`);

  // Add missing CSS links after shiki.css
  str = str.replace(
    `href="${root}css/shiki/shiki.css">`,
    `href="${root}css/shiki/shiki.css">\n` +
    `<link rel="stylesheet" href="${root}css/shiki/shiki-classes.css">\n` +
    `<link rel="stylesheet" href="${root}css/custom.css">`
  );

  // Fix hardcoded navbar brand name
  str = str.replace('>GnixAij</a>', `>${title}</a>`);

  return str;
});

// Fix hardcoded font URLs in CSS output
hexo.extend.filter.register('after_render:css', function (str) {
  const root = getRoot();
  if (root === '/') return str;

  return str.replace(/url\(\/css\/font\//g, `url(${root}css/font/`);
});
