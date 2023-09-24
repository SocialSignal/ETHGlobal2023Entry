import { useW3iAccount } from "@web3inbox/widget-react";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import ConnectTakeover from "./ConnectTakeover";
import { useSignalSourceSignMessage } from "./Web3Inbox";

export default function AuthWrapper({ children }: any) {
  const { account, setAccount } = useW3iAccount();
  const { signMessage } = useSignalSourceSignMessage();
  const [hasFELoaded, setFELoaded] = useState(false);

  useEffect(() => {
    setFELoaded(true);
  }, []);

  const { address } = useAccount({
    onDisconnect: () => {
      setAccount("");
    },
  });

  // We need to set the account as soon as the user is connected
  useEffect(() => {
    if (!Boolean(address)) return;
    setAccount(`eip155:1:${address}`);
  }, [signMessage, address, setAccount]);

  if (!address?.trim().length || !hasFELoaded) return <ConnectTakeover />;

  return children;
}
