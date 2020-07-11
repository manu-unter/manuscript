import { Link, graphql } from 'gatsby';
import Img from 'gatsby-image';
import get from 'lodash/get';
import React from 'react';

import { formatPostDate, formatReadingTime } from '../utils/helpers';
import Bio from '../components/Bio';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import Panel from '../components/Panel';
import SEO from '../components/SEO';
import { rhythm } from '../utils/typography';

class BlogIndexTemplate extends React.Component {
  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title');
    const langKey = this.props.pageContext.langKey;

    const posts = get(this, 'props.data.allMarkdownRemark.edges');
    const previewHeroImages = get(this, 'props.data.heroImages.edges');

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO />
        <aside>
          <Bio />
        </aside>
        <main>
          {posts.map(({ node }) => {
            const title = get(node, 'frontmatter.title') || node.fields.slug;
            const directoryName = get(node, 'fields.directoryName');
            const previewImageFluid = previewHeroImages
              .map(edge => edge.node)
              .filter(image => image.relativeDirectory === directoryName)
              .map(image => image.childImageSharp.fluid);
            return (
              <article
                key={node.fields.slug}
                style={{
                  display: 'flex',
                }}
              >
                <Img
                  fluid={previewImageFluid}
                  style={{
                    flexBasis: '10%',
                    marginRight: '0.875rem',
                    minWidth: '3.5rem',
                  }}
                />
                <header
                  style={{
                    flexGrow: 1,
                  }}
                >
                  <h2
                    style={{
                      marginTop: 0,
                      marginBottom: rhythm(1 / 4),
                    }}
                  >
                    <Link
                      style={{ boxShadow: 'none', textDecoration: 'none' }}
                      to={node.fields.slug}
                      rel="bookmark"
                    >
                      {title}
                    </Link>
                  </h2>
                  <small>
                    {formatPostDate(node.frontmatter.date, langKey)}
                    {` • ${formatReadingTime(node.timeToRead)}`}
                  </small>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: node.frontmatter.spoiler,
                    }}
                  />{' '}
                </header>
              </article>
            );
          })}
        </main>
        <Footer />
      </Layout>
    );
  }
}

export default BlogIndexTemplate;

export const pageQuery = graphql`
  query($langKey: String!) {
    site {
      siteMetadata {
        title
        description
      }
    }
    allMarkdownRemark(
      filter: { fields: { langKey: { eq: $langKey } } }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          fields {
            directoryName
            slug
            langKey
          }
          timeToRead
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            spoiler
          }
        }
      }
    }
    heroImages: allFile(filter: { name: { eq: "hero-image" } }) {
      edges {
        node {
          relativeDirectory
          childImageSharp {
            fluid(maxWidth: 246, quality: 100) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`;
