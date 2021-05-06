import React from "react";
import "styles/global.scss";
import NavbarCustom from "components/NavbarCustom";
import Footer from "components/Footer";
import "util/analytics.js";
import { AuthProvider } from "util/auth.js";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <>
        <NavbarCustom
          signoutRoute="/"
          bg="white"
          variant="light"
          expand="md"
          logo="https://uploads.divjoy.com/logo.svg"
        />

        <Component {...pageProps} />

        <Footer
          bg="light"
          textColor="dark"
          size="sm"
          bgImage=""
          bgImageOpacity={1}
          description="A short description of what you do here"
          copyright="© 2020 Company"
          logo="https://uploads.divjoy.com/logo.svg"
        />
      </>
    </AuthProvider>
  );
}

export default MyApp;
