import type { AppProps } from "next/app";
import { WagmiConfig, mainnet } from "wagmi";
import Footer from "../components/core/Footer";
// import "@web3inbox/widget-react/dist/compiled.css";
import "react-loading-skeleton/dist/skeleton.css";

import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import Navbar from "../components/core/Navbar";
import "../styles/globals.css";
import { Toaster } from "react-hot-toast";

import { QueryClient, QueryClientProvider } from "react-query";
import { SkeletonTheme } from "react-loading-skeleton";
import AuthWrapper from "../components/AuthWrapper";

// 1. Get projectID at https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID as string;
if (!projectId) {
  throw new Error("You need to provide NEXT_PUBLIC_PROJECT_ID env variable");
}

// 2. Configure Web3Modal
const chains = [mainnet];
const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  appName: "GM Hackers",
});

createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,

  // NOTE: The typings don't match reality.
  themeVariables: {
    "--w3m-font-family": "Roboto, sans-serif",
    "--w3m-accent": "#56B5BF",
    "--w3m-z-index": 100,
  } as any,
});

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SkeletonTheme baseColor="#202020" highlightColor="#444">
        <Toaster />
        <WagmiConfig config={wagmiConfig}>
          <AuthWrapper>
            <div className="w-full flex flex-col">
              <>
                <div>
                  <Navbar />
                </div>
                <div className="p-10 z-0">
                  <div className="flex flex-col justify-center items-center">
                    <Component {...pageProps} />
                  </div>
                </div>
                <div className="z-10">
                  <Footer />
                </div>
              </>
            </div>
          </AuthWrapper>
        </WagmiConfig>
      </SkeletonTheme>
    </QueryClientProvider>
  );
}

export default MyApp;
