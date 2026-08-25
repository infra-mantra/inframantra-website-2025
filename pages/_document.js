import Document, { Html, Head, Main, NextScript } from 'next/document';

/**
 * Custom document, added for one reason: to preload the home page hero as real
 * static HTML.
 *
 * The hero is the LCP element, and measured on the deployed preview it does not
 * start downloading until ~284ms after the document lands — the browser has to
 * parse into <body>, reach the <picture>, and evaluate its <source media> before
 * it knows which file it wants. A preload removes that gap.
 *
 * The obvious place for it is next/head, and that is where it lived before. It
 * had to come out: Next's head manager creates those <link> elements through the
 * DOM and sets imagesrcset before media, so the fetch begins before the media
 * gate applies. On a desktop window that downloaded the mobile hero, which
 * nothing then used, and Chrome logged "preloaded using link preload but not
 * used" on every re-render.
 *
 * Rendered here, the tag is serialised into the HTML string with all of its
 * attributes already in place, so there is no window in which media is missing.
 *
 * Gated to "/" so that every other route does not preload a banner it never
 * shows. If the hero filenames in components/newComponents/homepage/bannerVideo
 * change, these must change with them or the preload silently stops matching.
 */
class MyDocument extends Document {
  render() {
    const isHomePage = this.props.__NEXT_DATA__?.page === '/';

    return (
      <Html lang="en">
        <Head>
          {isHomePage && (
            <>
              <link
                rel="preload"
                as="image"
                type="image/avif"
                imageSrcSet="/banner/westin-mobile.avif"
                media="(max-width: 768px)"
                fetchpriority="high"
              />
              <link
                rel="preload"
                as="image"
                type="image/avif"
                imageSrcSet="/banner/whiteland-desktop.avif"
                media="(min-width: 769px)"
                fetchpriority="high"
              />
            </>
          )}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
