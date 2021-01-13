import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Bio from '../components/Bio';
import SEO from '../components/SEO';
import generateRssFeed from '../utils/generate-rss-feed';
import { formatPostDate, formatReadingTime } from '../utils/helpers';
import { getAllArticles } from '../utils/transformation';
import styles from './index.module.css';

export default function ArticleList({ articles }) {
  return (
    <>
      <SEO />
      <aside className={styles.bioSection}>
        <Bio />
      </aside>
      <main>
        {articles.map(
          ({
            title,
            date,
            slug,
            spoiler,
            heroImageUrl,
            heroImageAlt,
            timeToRead,
          }) => {
            return (
              <Link href={`/${slug}`} key={slug}>
                <a className={styles.link} rel="bookmark">
                  <article className={styles.article}>
                    <header className={styles.articleHeader}>
                      <h2 className={styles.articlePreviewTitle}>{title}</h2>
                      <small>
                        {formatPostDate(date)}
                        {` • ${formatReadingTime(timeToRead)}`}
                      </small>
                      <p
                        className={styles.articlePreviewSpoiler}
                        dangerouslySetInnerHTML={{
                          __html: spoiler,
                        }}
                      />{' '}
                    </header>
                    <figure className={styles.articlePreviewImage}>
                      <Image
                        src={heroImageUrl}
                        alt={heroImageAlt}
                        layout="fill"
                        objectFit="cover"
                      />
                    </figure>
                  </article>
                </a>
              </Link>
            );
          }
        )}
      </main>
    </>
  );
}

export async function getStaticProps() {
  const allArticles = await getAllArticles();

  generateRssFeed(allArticles);

  return { props: { articles: await getAllArticles() } };
}
