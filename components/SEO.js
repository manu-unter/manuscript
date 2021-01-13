import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import config from '../config';

const {
  title: siteTitle,
  description: siteDescription,
  siteUrl,
  social,
} = config;
function SEO({ image, title, description, slug }) {
  const metaDescription = description || siteDescription;
  const metaImage = image ? `${siteUrl}${image}` : null;
  const url = slug ? `${siteUrl}${slug}` : siteUrl;

  return (
    <Head>
      <title>
        {title
          ? `${title} — {siteTitle}`
          : `${siteTitle} — A blog by Manuel Unterhofer`}
      </title>
      <meta name="description" content={metaDescription} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title || siteTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:creator" content="@manu_unter" />,
      <meta name="twitter:title" content={title || siteTitle} />
      <meta name="twitter:description" content={metaDescription} />
      {metaImage && <meta property="og:image" content={metaImage} />}
      {metaImage && <meta name="twitter:image" content={metaImage} />}
    </Head>
  );
}

SEO.propTypes = {
  description: PropTypes.string,
  image: PropTypes.string,
  slug: PropTypes.string,
  title: PropTypes.string,
};

export default SEO;
