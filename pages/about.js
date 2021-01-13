import Image from 'next/image';
import React from 'react';
import config from '../config';
import profilePic from '../assets/profile-pic.jpg';
import styles from './about.module.css';

export default function About() {
  return (
    <main>
      <aside className={styles.aside}>
        <Image
          src={profilePic}
          alt={config.author}
          width={70}
          height={70}
          layout="fixed"
          className={styles.profilePicture}
        />
      </aside>
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
        <a href="https://onivim.io/" target="_blank" rel="noopener noreferrer">
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
  );
}
