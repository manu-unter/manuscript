import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import config from '../../config';
import profilePic from '../assets/profile-pic.jpg';
import { rhythm } from '../utils/typography';
import styles from './Bio.module.css';

export default function Bio() {
  return (
    <div className={styles.bio}>
      <div>
        <Image
          src={profilePic}
          alt={config.author}
          width={46}
          height={46}
          layout="fixed"
          className={styles.profilePicture}
        />
      </div>
      <p className={styles.text}>
        Blog by{' '}
        <Link href="/about">
          <a>{config.author}</a>
        </Link>
        , trying to improve the way we build and use technology. To me, the fun
        starts where the Google results end.
      </p>
    </div>
  );
}
