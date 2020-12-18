import React from 'react';
import profilePic from '../assets/profile-pic.jpg';
import { rhythm } from '../utils/typography';

class Bio extends React.Component {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          marginBottom: rhythm(2),
        }}
      >
        <img
          src={profilePic}
          alt={`Manuel Unterhofer`}
          style={{
            marginRight: rhythm(1 / 2),
            marginBottom: 0,
            width: rhythm(2),
            height: rhythm(2),
            borderRadius: '50%',
          }}
        />
        <p>
          Blog by <a href="/about">Manuel Unterhofer</a>, trying to improve the
          way we build and use technology. To me, the fun starts where the
          Google results end.
        </p>
      </div>
    );
  }
}

export default Bio;
