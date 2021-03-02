import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import Bio from '../components/Bio';
import SEO from '../components/SEO';
import { formatPostDate, formatReadingTime } from '../utils/helpers';
import { rhythm, scale } from '../utils/typography';
import { getAllArticleSlugs, getArticle } from '../utils/transformation';
import styles from './[slug].module.css';

export default function Article({
  title,
  spoiler,
  slug,
  date,
  timeToRead,
  heroImageUrl,
  heroImageAlt,
  contentHtml,
  discussUrl,
  editUrl,
}) {
  return (
    <>
      <SEO
        title={title}
        description={spoiler}
        slug={slug}
        image={heroImageUrl}
      />
      <main>
        <article>
          <header>
            <h1 style={{ color: 'var(--textTitle)' }}>{title}</h1>
            <p
              style={{
                ...scale(-1 / 5),
                display: 'block',
                marginBottom: rhythm(1),
                marginTop: rhythm(-4 / 5),
              }}
            >
              {formatPostDate(date)}
              {` • ${formatReadingTime(timeToRead)}`}
            </p>
            <figure className={styles.figure}>
              <Image
                src={heroImageUrl}
                alt={heroImageAlt}
                layout="fill"
                objectFit="cover"
                sizes="(max-width: 40rem) 100vh, 38rem"
                className={styles.heroImage}
              />
            </figure>
          </header>
          <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
          <footer>
            <p>
              <a href={discussUrl} target="_blank" rel="noopener noreferrer">
                Discuss on Twitter
              </a>
              {` • `}
              <a href={editUrl} target="_blank" rel="noopener noreferrer">
                Edit on GitHub
              </a>
            </p>
          </footer>
        </article>
      </main>
      <aside>
        <h3
          style={{
            fontFamily: 'Kalam, sans-serif',
            fontWeight: 'normal',
            marginTop: rhythm(0.25),
          }}
        >
          <Link href="/">
            <a
              style={{
                boxShadow: 'none',
                textDecoration: 'none',
              }}
            >
              manuscript
            </a>
          </Link>
        </h3>
        <Bio />
      </aside>
    </>
  );
}

export function getStaticPaths() {
  return {
    paths: getAllArticleSlugs().map(slug => ({
      params: { slug },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params: { slug } }) {
  return { props: await getArticle(slug) };
}
