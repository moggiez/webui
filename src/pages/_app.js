import React from "react";
import "styles/global.scss";
import NavbarCustom from "components/NavbarCustom";
import Footer from "components/Footer";
import "util/analytics.js";
import Head from "next/head";
import { AuthProvider } from "util/auth.js";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/images/logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
      </Head>
      <AuthProvider>
        <>
          <NavbarCustom
            signoutRoute="/"
            bg="white"
            variant="light"
            expand="md"
            logo="/images/logo.svg"
          />

          <Component {...pageProps} />

          <Footer
            bg="light"
            textColor="dark"
            size="sm"
            bgImage=""
            bgImageOpacity={1}
            description="A short description of what you do here"
            copyright="© 2021 moggies.io"
            logo="/images/logo.svg"
          />
        </>
      </AuthProvider>
    </>
  );
}

export default MyApp;
