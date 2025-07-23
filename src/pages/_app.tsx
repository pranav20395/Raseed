// pages/_app.tsx
import '../styles/globals.css'; // Import your global Tailwind CSS
import type { AppProps } from 'next/app'; // Import AppProps type

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
