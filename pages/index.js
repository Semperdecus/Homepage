import Link from 'next/link';
import { getSubPages } from '../utils/mdx-utils';

import Footer from '../components/Footer';
import Header from '../components/Header';
import Layout, { GradientBackground } from '../components/Layout';
import ArrowIcon from '../components/ArrowIcon';
import { getGlobalData } from '../utils/global-data';
import SEO from '../components/SEO';

export default function Index({ subpages, globalData }) {
  return (
    <Layout>
      <SEO title={globalData.name} description={globalData.siteTitle} />
      <Header name={globalData.name} />
      <main className="w-full">
        <h1 className="mb-12 text-3xl text-center lg:text-5xl">
          {globalData.siteTitle}
        </h1>
        <ul className="w-full">
          {subpages.map((page) => (
            <li
              key={page.filePath}
              className="transition bg-white border border-b-0 border-gray-800 md:first:rounded-t-lg md:last:rounded-b-lg backdrop-blur-lg dark:bg-black dark:bg-opacity-30 bg-opacity-10 hover:bg-opacity-20 dark:hover:bg-opacity-50 dark:border-white border-opacity-10 dark:border-opacity-10 last:border-b hover:border-b hovered-sibling:border-t-0" data-sb-object-id={`pages/${page.filePath}`}
            >
              <Link
                as={`/${page.filePath.replace(/\.mdx?$/, '')}`}
                href={`/${page.filePath}`}
                className="block px-6 py-6 lg:py-10 lg:px-16 focus:outline-none focus:ring-4">

                {page.data.date && (
                  <p className="mb-3 font-bold uppercase opacity-60" data-sb-field-path="date">
                    {page.data.date}
                  </p>
                )}
                <h2 className="text-2xl md:text-3xl" data-sb-field-path="title">{page.data.title}</h2>
                {page.data.description && (
                  <p className="mt-3 text-lg opacity-60" data-sb-field-path="description">
                    {page.data.description}
                  </p>
                )}
                <ArrowIcon className="mt-4" />

              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer copyrightText={globalData.footerText} />
      <GradientBackground
        variant="large"
        className="fixed top-20 opacity-40 dark:opacity-60"
      />
      <GradientBackground
        variant="small"
        className="absolute bottom-0 opacity-20 dark:opacity-10"
      />
    </Layout>
  );
}

export function getStaticProps() {
  const subpages = getSubPages();
  const globalData = getGlobalData();

  return { props: { subpages, globalData } };
}
