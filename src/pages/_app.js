import "@/styles/globals.css";
import { UserProvider } from "../../context/UserContext";
import { useEffect } from "react";
import { appWithTranslation } from 'next-i18next';

function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default appWithTranslation(App);
