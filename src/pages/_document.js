import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css?family=Inter:300,400,500,700&display=swap"
                />
                <link rel="manifest" href="/manifest.json" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta http-equiv="ScreenOrientation" content="autoRotate:disabled"/>
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
