const withImages = require('next-images');

module.exports = withImages({
  inlineImageLimit: false,
  async redirects() {
    return [
      {
        src: '/future-proof-data-fetching-with-resource-hooks/?',
        destination: '/future-proof-data-fetching-with-react',
      },
      {
        src: '/giving-names-meaning/?',
        destination: '/how-to-give-meaningful-names',
      },
    ];
  },
});
