import Head from 'next/head';
import Link from 'next/link';
import React, { useLayoutEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Toggle from './Toggle';

import sun from '../assets/sun.png';
import moon from '../assets/moon.png';
import styles from './Layout.module.css';
import Footer from './Footer';
import Image from 'next/image';

export default function Layout({ title, children }) {
  const [theme, setTheme] = useState(null);
  const router = useRouter();

  useLayoutEffect(() => {
    setTheme(window.__theme);
    window.__onThemeChange = () => {
      setTheme(window.__theme);
    };
  }, []);

  const HeadlineComponent = router.pathname === router.basePath ? 'h1' : 'h3';

  return (
    <div className={styles.layout}>
      <Head>
        <meta
          name="theme-color"
          content={theme === 'light' ? '#e29e1a' : '#e29e1a'}
        />
      </Head>
      <div className={styles.content}>
        <header className={styles.header}>
          <HeadlineComponent className={styles.blogTitle}>
            <Link href="/">
              <a>{title}</a>
            </Link>
          </HeadlineComponent>
          {theme !== null ? (
            <Toggle
              icons={{
                checked: (
                  <Image
                    src={moon}
                    width={16}
                    height={16}
                    role="presentation"
                    layout="fixed"
                  />
                ),
                unchecked: (
                  <Image
                    src={sun}
                    width={16}
                    height={16}
                    role="presentation"
                    layout="fixed"
                  />
                ),
              }}
              checked={theme === 'dark'}
              onChange={e =>
                window.__setPreferredTheme(e.target.checked ? 'dark' : 'light')
              }
            />
          ) : (
            <div style={{ height: '24px' }} />
          )}
        </header>
        {children}
        <Footer />
      </div>
    </div>
  );
}
