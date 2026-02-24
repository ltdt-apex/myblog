'use strict';

// Automatically inject a cmd-wrapper at the topmost of every post,
// above the article title.
hexo.extend.filter.register('after_render:html', function (str) {
  // Only match post pages (have article-title and are from _posts)
  const titleMatch = str.match(/<h1 class="article-title">([^<]+)<\/h1>/);
  if (!titleMatch) return str;

  // Extract slug from the URL path in the page
  const slugMatch = str.match(/class="cover-image" href="[^"]*\/([^/"]+)\/">/);
  const slug = slugMatch ? slugMatch[1] : null;
  if (!slug) return str;

  // Skip non-post pages (about, links, etc.)
  const isPost = str.includes('article-date');
  if (!isPost) return str;

  const cmd = `<div class="cmd-wrapper">` +
    `<span class="cmd-prompt">$</span>` +
    `<span style="color:var(--blue)">cat</span>` +
    `<span>\u00a0</span>` +
    `<span style="color:var(--mauve)">~/blog/${slug}.md</span>` +
    `<span class="cmd-cursor">_</span>` +
    `</div>`;

  // Insert before the cover image (top of the card)
  str = str.replace(
    '<div class="card"><a class="cover-image"',
    '<div class="card">' + cmd + '<a class="cover-image"'
  );

  return str;
});
