import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import UserProvider from "../context/user";
import theme from "../theme.js";
import Head from "next/head";
import Navbar from "../components/Navbar";
import Script from 'next/script'
import { useRouter } from 'next/router'
import * as gtag from '../lib/gtag'
import { useEffect } from "react"
import { NextSeo } from "next-seo"

function MyApp({ Component, pageProps }) {
  const G_CLIENT = process.env.G_AD_CLIENT

  const router = useRouter()
  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    router.events.on('hashChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
      router.events.off('hashChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <Script
        id="Adsense-id"
        async={true}
        strategy="beforeInteractive"
        crossOrigin="anonymous"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${G_CLIENT}`}
        onError={(e) => { console.error('Auto-ad script failed to load', e) }}
      />

      <Head>
        <title>Unpuzzle</title>
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <ChakraProvider theme={theme}>
        <NextSeo
          title="Unpuzzle"
          description="Finish your assignments on time by getting Edpuzzle solutions instantly (we even generate answers to open ended questions)! We provide unique insights on problems in order to aid students in learning the material!"
          openGraph={{
            url: 'https://unpuzzle.net',
            title: 'Unpuzzle',
            description:
              'Finish your assignments on time by getting Edpuzzle solutions instantly (we even generate answers to open ended questions)! We provide unique insights on problems in order to aid students in learning the material!',
            locale: 'en_US',
            images: [
              {
                url: 'https://unpuzzle.net/logo.png',
                width: 1200,
                height: 630,
                alt: 'unpuzzle',
                type: 'image/png',
              },
            ],
          }}
        />
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <UserProvider>
          <Navbar />
          <Component {...pageProps} />
        </UserProvider>
      </ChakraProvider>
    </>
  );
}

export default MyApp;
