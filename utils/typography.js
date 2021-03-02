import Typography from 'typography';
// import Wordpress2016 from 'typography-theme-wordpress-2016';

// Wordpress2016.overrideThemeStyles = () => ({
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
      styles: ['400', '400i', '500', '500i', '700', '700i&display=fallback'],
    },
  ],
  overrideStyles: ({ rhythm }, options, styles) => ({
    a: {
      color: 'var(--textLink)',
    },
    'a:hover': {
      color: 'var(--textLinkHover)',
    },
    'a.anchor svg[aria-hidden="true"]': {
      fill: 'currentColor',
    },
    hr: {
      background: 'var(--hr)',
    },
    blockquote: {
      margin: '0 -1rem 1.45rem',
      padding: '0 1rem 0 calc(1rem - 3px)',
      color: 'var(--textNormal)',
      fontStyle: 'italic',
      borderLeft: '3px solid var(--textLink)',
    },
    'blockquote > *': {
      opacity: 0.8,
    },
    small: {
      fontSize: "75%",
    }
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
