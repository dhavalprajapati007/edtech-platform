import Head from "next/head";
import React from "react";
import Header from "../components/Header";
import Script from 'next/script';
import "../styles/globals.css"
import { excludeHeaderPath } from "../utils/data";
import { SessionProvider } from "next-auth/react"

const MyApp = ({ Component, pageProps, ...appProps }) => {
  return (
    <React.Fragment>
      <Head>
        <meta name="theme-color" content="#024F10" />
        
      </Head>
      {/* Jquery Lib Added */}

      <Script type='text/javascript' src="/jquery-1.js" strategy="beforeInteractive"/>

      {/* Jquery Lib Added End */}
      <SessionProvider session={pageProps.session}>
        {
          excludeHeaderPath.includes(appProps.router.pathname) ? <Component {...pageProps} /> :
          <>
            <Header />
            <Component {...pageProps} />
          </>
        }
      </SessionProvider>
    </React.Fragment>
  );
}

export default MyApp;