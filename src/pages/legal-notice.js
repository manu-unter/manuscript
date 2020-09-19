import React from 'react';
import Layout from '../components/Layout';
import get from 'lodash/get';
import { graphql } from 'gatsby';

export default function LegalNotice({ location, data }) {
  const siteTitle = get(data, 'site.siteMetadata.title');
  return (
    <Layout location={location} title={siteTitle}>
      <main>
        <h1>Legal Notice</h1>
        <p>
          Manuel Unterhofer
          <br />
          Feldmochinger Str. 21 <br />
          80992 Munich <br />
          Germany <br />
          Tel.: 0049 162 4254113 <br />
          E-Mail: manuel.unterhofer@hey.com
        </p>

        <h2>Privacy Policy</h2>
        <p>
          I do not use cookies and I do not track any information about you.
        </p>
      </main>
    </Layout>
  );
}

export const pageQuery = graphql`
  query ReactComponentsLegalNoticeSiteData {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
