import Head from 'next/head';
import Layout from '../components/Layout';
import config from '../config';
import './global.css';

export default function CustomApp({ Component, pageProps }) {
  return (
    <Layout title={config.title}>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
      </Head>
      <Component {...pageProps} />
    </Layout>
  );
}
