import React from 'react';

import { rhythm } from '../utils/typography';

class Footer extends React.Component {
  render() {
    return (
      <footer
        style={{
          marginTop: rhythm(2.5),
          paddingTop: rhythm(1),
        }}
      >
        <div style={{ float: 'right' }}>
          <a href="/legal-notice">legal notice</a> &bull;{' '}
          <a href="/rss.xml" target="_blank" rel="noopener noreferrer">
            rss
          </a>
        </div>
        <a href="/about">about</a> &bull;{' '}
        <a
          href="https://mobile.twitter.com/manu_unter"
          target="_blank"
          rel="noopener noreferrer"
        >
          twitter
        </a>{' '}
        &bull;{' '}
        <a
          href="https://github.com/manu-unter"
          target="_blank"
          rel="noopener noreferrer"
        >
          github
        </a>{' '}
        &bull;{' '}
        <a
          href="https://stackoverflow.com/users/4887966/manu-unter"
          target="_blank"
          rel="noopener noreferrer"
        >
          stack overflow
        </a>
      </footer>
    );
  }
}

export default Footer;
