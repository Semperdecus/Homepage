export const getGlobalData = () => {
  const name = process.env.SITE_NAME
    ? decodeURI(process.env.SITE_NAME)
    : 'Terence Koch';
  const siteTitle = process.env.SITE_TITLE
    ? decodeURI(process.env.SITE_TITLE)
    : 'Homepage';
  const footerText = process.env.BLOG_FOOTER_TEXT
    ? decodeURI(process.env.BLOG_FOOTER_TEXT)
    : 'All rights reserved.';

  return {
    name,
    siteTitle,
    footerText,
  };
};
