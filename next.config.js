const withImages = require('next-images');

module.exports = withImages({
  inlineImageLimit: false,
  async redirects() {
    return [
      {
        source: '/future-proof-data-fetching-with-resource-hooks',
        destination: '/future-proof-data-fetching-with-react',
        permanent: true,
      },
      {
        source: '/giving-names-meaning',
        destination: '/how-to-give-meaningful-names',
        permanent: true,
      },
    ];
  },
});
