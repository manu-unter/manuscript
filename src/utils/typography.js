import './global.css';

import Typography from 'typography';
// import Wordpress2016 from 'typography-theme-wordpress-2016';

// Wordpress2016.overrideThemeStyles = () => ({
//   'h1, h2, h3, h4, h5, h6': {
//     fontFamily: 'Lato, Georgia, serif',
//   },
//   a: {
//     color: 'var(--textLink)',
//     textDecoration: 'underline',
//     boxShadow: 'none',
//   },
//   hr: {
//     background: 'var(--hr)',
//   },
//   'a.gatsby-resp-image-link': {
//     boxShadow: 'none',
//   },
//   // These two are for gatsby-remark-autolink-headers:
//   'a.anchor': {
//     boxShadow: 'none',
//   },
//   'a.anchor svg[aria-hidden="true"]': {
//     stroke: 'var(--textLink)',
//   },
//   'p code': {
//     fontSize: '1rem',
//   },
//   // TODO: why tho
//   'h1 code, h2 code, h3 code, h4 code, h5 code, h6 code': {
//     fontSize: 'inherit',
//   },
//   'li code': {
//     fontSize: '1rem',
//   },
//   blockquote: {
//     color: 'inherit',
//     borderLeftColor: 'inherit',
//     opacity: '0.8',
//   },
//   'blockquote.translation': {
//     fontSize: '1em',
//   },
// });

// delete Wordpress2016.googleFonts;
const typographyOptions = {
  headerFontFamily: [
    'Lato',
    'Helvetica Neue',
    'Segoe UI',
    'Helvetica',
    'Arial',
    'sans-serif',
  ],
  headerColor: 'var(--textTitle)',
  bodyFontFamily: ['Open Sans', 'Arial', 'sans-serif'],
  // bodyFontFamily: ['Merriweather', 'Georgia', 'serif'],
  bodyColor: 'var(--textNormal)',
  // baseFontSize: '16px',
  googleFonts: [
    {
      name: 'Kalam',
      styles: ['400'],
    },
    {
      name: 'Lato',
      styles: ['700'],
    },
    {
      name: 'Open Sans',
      styles: ['400', '400i', '500', '500i', '700', '700i'],
    },
  ],
  overrideStyles: ({ rhythm }, options, styles) => ({
    a: {
      color: 'var(--textLink)',
    },
    'a:hover': {
      color: 'var(--textLinkHover)',
    },
  }),
};

const typography = new Typography(typographyOptions);

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
  typography.injectStyles();
}

export default typography;
export const rhythm = typography.rhythm;
export const scale = typography.scale;
