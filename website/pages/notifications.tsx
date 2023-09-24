import { Web3Inbox } from "../components/Web3Inbox";
import {
  useManageSubscription,
  useSubscription,
  useW3iAccount,
  useInitWeb3InboxClient,
  useMessages,
} from "@web3inbox/react-widget";
import { useEffect, useCallback } from "react";
import { useSignMessage, useAccount } from "wagmi";

export default () => {
  const isReady = useInitWeb3InboxClient({ projectId: "..." });

  const { address } = useAccount({
    onDisconnect: () => {
      setAccount("");
    },
  });

  const {
    account,
    setAccount,
    register: registerIdentity,
    identityKey,
  } = useW3iAccount();

  const { signMessageAsync } = useSignMessage();

  // Checking if subscribed
  const { subscribe, isSubscribed } = useManageSubscription();

  // Get the subscription
  const { subscription } = useSubscription();

  const { messages } = useMessages();

  useEffect(() => {
    if (!Boolean(address)) return;
    setAccount(`eip155:1:${address}`);
  }, [address, setAccount]);

  const handleRegistration = useCallback(async () => {
    if (!account) return;
    try {
      await registerIdentity(signMessageAsync);
    } catch (registerIdentityError) {
      console.error({ registerIdentityError });
    }
  }, [signMessageAsync, registerIdentity, account]);

  useEffect(() => {
    if (!identityKey) {
      handleRegistration();
    }
  }, [handleRegistration, identityKey]);

  return (
    <div>
      <span>Client is {isReady ? "Ready" : "Not Ready"}</span>
      <span>
        You are {isSubscribed ? "Subscribed" : "Not Subscribed"} Subscribed
      </span>
      <button onClick={() => subscribe()}> Subscribe to current dapp </button>
      <div> All your messages in JSON: {JSON.stringify(messages)}</div>
    </div>
  );
};
