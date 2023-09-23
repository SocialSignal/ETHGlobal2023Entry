import type { AppProps } from "next/app";
import { WagmiConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import Footer from "../components/core/Footer";
// import "@web3inbox/widget-react/dist/compiled.css";
import "react-loading-skeleton/dist/skeleton.css";

import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import Navbar from "../components/core/Navbar";
import "../styles/globals.css";
import { Toaster } from "react-hot-toast";

import { QueryClient, QueryClientProvider } from "react-query";
import { SkeletonTheme } from "react-loading-skeleton";
import { useState } from "react";
import ConnectTakeover from "../components/ConnectTakeover";

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

createWeb3Modal({ wagmiConfig, projectId, chains });

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <SkeletonTheme baseColor="#202020" highlightColor="#444">
        <Toaster />
        <WagmiConfig config={wagmiConfig}>
          {!isConnected ? (
            <ConnectTakeover onConnect={() => setIsConnected(true)} />
          ) : (
            <div
              className="w-full flex flex-col"
              // templateAreas={`"header" "main" "footer"`}
              // w="100%"
              // width="100%"
              // gridTemplateRows={"100px 3f 40px"}
              // gridTemplateColumns={"1fr"}
              // paddingY="2em"
            >
              <>
                <div>
                  <Navbar />
                </div>
                <div className="p-10 z-10">
                  <div className="flex flex-col justify-center items-center">
                    <Component {...pageProps} />
                  </div>
                </div>
                <div className="z-10">
                  <Footer />
                </div>
              </>
            </div>
          )}
        </WagmiConfig>
      </SkeletonTheme>
    </QueryClientProvider>
  );
}

export default MyApp;
