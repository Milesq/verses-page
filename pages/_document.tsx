import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    const trakcingID = process.env.NEXT_PUBLIC_GOOGLE_TRACKING_CODE

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
          <meta
            name="og:image"
            content="https://bible-verse.vercel.app/verse.png"
          />
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${trakcingID}`}
          />

          <script
            dangerouslySetInnerHTML={{
              __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${trakcingID}');
                `,
            }}
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
