import { writeFileSync } from 'fs';
import Rss from 'rss';
import { getAllArticles } from './transformation';
import config from '../../config';

const { title, description, siteUrl, author } = config;

export default async function generateRssFeed() {
  const feed = new Rss({
    title,
    description,
    site_url: siteUrl,
    feed_url: `${siteUrl}rss.xml`,
    managingEditor: author,
    webMaster: author,
  });

  const allArticles = await getAllArticles();
  allArticles.forEach(({ title, date, slug, spoiler, contentHtml }) => {
    const postText = `
        <div style="margin-top=55px; font-style: italic;">(This is an article posted to my blog at manuscript.blog. You can read it online by <a href="${
          siteUrl + slug
        }">clicking here</a>.)</div>
    `;

    const preparedContentHtml = contentHtml
      .replace(/href="\//g, `href="${siteUrl}/`)
      .replace(/src="\//g, `src="${siteUrl}/`)
      .replace(/"\/static\//g, `"${siteUrl}/static/`)
      .replace(/,\s*\/static\//g, `,${siteUrl}/static/`);

    feed.item({
      title,
      description: spoiler,
      date,
      url: siteUrl + slug,
      guid: siteUrl + slug,
      custom_elements: [{ 'content:encoded': preparedContentHtml + postText }],
    });
  });

  const feedXml = feed.xml();
  writeFileSync('./public/rss.xml', feedXml).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

generateRssFeed();
