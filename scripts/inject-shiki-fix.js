'use strict';

hexo.extend.injector.register('body_end', `
<script data-swup-ignore-script>
if (typeof swup !== "undefined") {
  swup.hooks.on("page:view", () => {
    setTimeout(() => {
      if (typeof addHighlightTool === "function") {
        addHighlightTool();
      }
    }, 50);
  });
}
</script>
`);
