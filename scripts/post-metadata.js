import { postEntries } from '../src/content/posts.js';

const escape = (value) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

export const withPostMetadata = (html, post) => {
  const title = escape(`${post.title} — Floyd Benedikter`);
  const description = escape(post.summary);
  return html
    .replace(/<title>.*?<\/title>/s, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${description}" />`)
    .replace('</head>', `    <meta property="og:type" content="article" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
  </head>`);
};

export const postMetadata = () => ({
  name: 'post-metadata',
  transformIndexHtml: {
    order: 'post',
    handler(html, context) {
      const path = (context.originalUrl || context.path).split('?')[0].replace(/\/$/, '');
      const post = postEntries.find((entry) => path === `/posts/${entry.slug}`);
      return post ? withPostMetadata(html, post) : html;
    },
  },
  generateBundle: {
    order: 'post',
    handler(_options, bundle) {
      const index = bundle['index.html'];
      if (!index) this.error('Post metadata requires the generated index.html.');
      for (const post of postEntries) {
        this.emitFile({ type: 'asset', fileName: `posts/${post.slug}/index.html`, source: withPostMetadata(String(index.source), post) });
      }
    },
  },
});
