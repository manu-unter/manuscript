import Head from 'next/head';
import { name } from '../../package.json';
import Layout from '../components/Layout';
import './global.css';

export default function CustomApp({ Component, pageProps }) {
  return (
    <Layout title={name}>
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
