import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
          <link
            rel="preload"
            href="/AquireBold-8Ma60.otf"
            as="font"
            type="font/otf"
            crossOrigin="anonymous"
          />
          <meta name="robots" content="noindex,follow" />
          <meta
            name="description"
            content="Generuj plansze z biblijnymi wersetami!"
          />
        </Head>
        <body className="dark:bg-gray-700" data-dark>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
