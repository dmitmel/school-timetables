const h = require('./hyperscript');

module.exports = function Layout({ relativeRoot, head, body }) {
  return h(
    'html',
    { lang: 'en' },
    h(
      'head',
      h('meta', { charset: 'UTF-8' }),
      h('meta', {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0',
      }),
      h('link', {
        rel: 'stylesheet',
        href:
          'https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css',
        integrity: 'sha256-l85OmPOjvil/SOvVt3HnSSjzF1TUMyT9eV0c2BzEGzU=',
        crossorigin: 'anonymous',
      }),
      h('link', {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Ubuntu:400,700&display=swap',
      }),
      h('link', {
        rel: 'stylesheet',
        href:
          'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
        integrity:
          'sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN',
        crossorigin: 'anonymous',
      }),
      h('link', { rel: 'stylesheet', href: `${relativeRoot}/style.css` }),
      head,
    ),
    h('body', body),
  );
};
