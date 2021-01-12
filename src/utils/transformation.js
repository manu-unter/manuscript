import remarkSmartypants from '@silvenon/remark-smartypants';
import { readdirSync, readFileSync } from 'fs';
import parseFileWithFrontMatter from 'gray-matter';
import _ from 'lodash';
import { join } from 'path';
import remark from 'remark';
import remarkAutolinkHeadings from 'remark-autolink-headings';
import remarkExternalLinks from 'remark-external-links';
import remarkHtml from 'remark-html';
import remarkPrism from 'remark-prism';
import remarkSlug from 'remark-slug';
import sanitizeHtml from 'sanitize-html';
import { homepage as baseUrl } from '../../package.json';

const articleFileName = 'index.md';
const relativeArticlesPath = join('src', 'articles');
const articlesDirectory = join(process.cwd(), relativeArticlesPath);

export function getAllArticleSlugs() {
  return readdirSync(articlesDirectory);
}

export async function getAllArticles() {
  const articles = await Promise.all(getAllArticleSlugs().map(getArticle));
  return articles.sort(
    (articleA, articleB) =>
      new Date(articleB.date).getTime() - new Date(articleA.date).getTime()
  );
}

const githubUsername = 'manu-unter';
const githubRepoName = 'manuscript';

async function transformMarkdownIntoHtml(markdown) {
  const file = await remark()
    .use(remarkSmartypants)
    .use(remarkSlug)
    .use(remarkExternalLinks)
    .use(remarkAutolinkHeadings, { behavior: 'wrap' })
    .use(remarkPrism, { transformInlineCode: true })
    .use(remarkHtml)
    .process(markdown);
  return file.toString();
}

function getTimeToRead(html) {
  const pureText = sanitizeHtml(html, { allowTags: [] });
  const avgWpm = 265;
  const wordCount = _.words(pureText).length;

  return Math.round(wordCount / avgWpm);
}

export async function getArticle(slug) {
  const articlePath = join(articlesDirectory, slug, articleFileName);

  const fileContent = readFileSync(articlePath, 'utf8');
  const {
    data: frontMatter,
    content: contentMarkdown,
  } = parseFileWithFrontMatter(fileContent);
  const contentHtml = await transformMarkdownIntoHtml(contentMarkdown);
  const timeToRead = getTimeToRead(contentHtml);

  const heroImageUrl = `/hero-images/${slug}.jpg`;
  const editUrl = `https://github.com/${githubUsername}/${githubRepoName}/edit/master/src/articles/${slug}/${articleFileName}`;
  const absoluteUrl = baseUrl + slug;
  const discussUrl = `https://mobile.twitter.com/search?q=${encodeURIComponent(
    absoluteUrl
  )}`;

  return {
    ...frontMatter,
    slug,
    timeToRead,
    heroImageUrl,
    editUrl,
    discussUrl,
    contentHtml,
  };
}
