import "@/styles/globals.css";
import { UserProvider } from "../../context/UserContext";
import { useEffect } from "react";


export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}
