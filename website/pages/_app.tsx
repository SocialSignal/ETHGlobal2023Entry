import type { AppProps } from "next/app";
import { WagmiConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import { theme } from "../styles/theme";
import Footer from "../components/core/Footer";
// import "@web3inbox/widget-react/dist/compiled.css";

import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import Navbar from "../components/core/Navbar";
import "../styles/globals.css";
import { Toaster } from "react-hot-toast";

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

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <div>
        <Toaster />
      </div>
      <WagmiConfig config={wagmiConfig}>
        <div
          className="w-full flex flex-col"
          // templateAreas={`"header" "main" "footer"`}
          // w="100%"
          // width="100%"
          // gridTemplateRows={"100px 3f 40px"}
          // gridTemplateColumns={"1fr"}
          // paddingY="2em"
        >
          <div className="p-4">
            <Navbar />
          </div>
          <div className="p-10">
            <div className="flex flex-col justify-center items-center">
              <Component {...pageProps} />
            </div>
          </div>
          <div>
            <Footer />
          </div>
        </div>
      </WagmiConfig>
    </>
  );
}

export default MyApp;
