import React from 'react';
import Layout from '../components/Layout';
import get from 'lodash/get';
import { graphql } from 'gatsby';
import profilePic from '../assets/profile-pic.jpg';
import { rhythm } from '../utils/typography';
import Footer from '../components/Footer';

export default function About({ location, data }) {
  const siteTitle = get(data, 'site.siteMetadata.title');
  return (
    <Layout location={location} title={siteTitle}>
      <main>
        <img
          src={profilePic}
          alt={`Manuel Unterhofer`}
          style={{
            // marginRight: rhythm(1 / 2),
            marginBottom: 0,
            width: rhythm(3),
            height: rhythm(3),
            borderRadius: '50%',
            float: 'right',
          }}
        />{' '}
        <h1>About Me</h1>
        <p>Hi! 👋 My name is Manuel Unterhofer.</p>
        <p>
          I'm a web developer, IT consultant, and tinker. I love riddles,
          challenges, music, and Open Source. I'm Interested in all projects and
          experiments that set out to bring software development to the next
          level.
        </p>
        <p>
          My ultimate goal is to make a difference in how we build and use
          technology. This blog is one of the ways I'm working on it. Others are
          my day job at{' '}
          <a
            href="https://netlight.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Netlight Consulting
          </a>{' '}
          and my contributions to Open Source projects like{' '}
          <a
            href="https://reasonml.github.io/"
            target="_blank"
            rel="noopener noreferrer"
          >
            ReasonML
          </a>
          ,{' '}
          <a
            href="https://www.outrunlabs.com/revery/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Revery
          </a>
          , and{' '}
          <a
            href="https://onivim.io/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Onivim 2
          </a>
          .
        </p>
        <p>
          If you want to hear more from me, you should follow me on{' '}
          <a
            href="https://mobile.twitter.com/manu_unter"
            target="_blank"
            rel="noopener noreferrer"
          >
            twitter
          </a>
          .
        </p>
      </main>
      <Footer />
    </Layout>
  );
}

export const pageQuery = graphql`
  query ReactComponentsAboutSiteData {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
