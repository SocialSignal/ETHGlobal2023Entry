import {
  useInitWeb3InboxClient,
  useW3iAccount,
  useManageSubscription,
} from "@web3inbox/widget-react";
import { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { useInterval } from "usehooks-ts";
import { useAccount, useSignMessage, usePublicClient } from "wagmi";
import { sendNotification } from "../utils/fetchNotify";
import useSendNotification from "../utils/useSendNotification";
import "@web3inbox/widget-react/dist/compiled.css";
import Messages from "./Messages";
import Subscribers from "./Subscribers";
import Subscription from "./Subscription";

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID as string;
const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN as string;

export const useSignalSourceSignMessage = () => {
  const { signMessageAsync } = useSignMessage();
  const signMessage = useCallback(
    async (message: string) => {
      const res = await signMessageAsync({
        message,
      });

      return res as string;
    },
    [signMessageAsync]
  );

  return { signMessage, signMessageAsync };
};

export const Web3Inbox = () => {
  /** Web3Inbox SDK hooks **/
  const isW3iInitialized = useInitWeb3InboxClient({
    projectId,
    domain: appDomain,
  });

  const {
    account,
    setAccount,
    register: registerIdentity,
    identityKey,
  } = useW3iAccount();

  const { address } = useAccount({
    onDisconnect: () => {
      setAccount("");
    },
  });

  const { signMessage } = useSignalSourceSignMessage();

  // We need to set the account as soon as the user is connected
  useEffect(() => {
    if (!Boolean(address)) return;
    setAccount(`eip155:1:${address}`);
  }, [signMessage, address, setAccount]);

  const {
    subscribe,
    unsubscribe,
    isSubscribed,
    isSubscribing,
    isUnsubscribing,
  } = useManageSubscription(account);

  const wagmiPublicClient = usePublicClient();

  const { handleSendNotification, isSending } = useSendNotification();
  const [lastBlock, setLastBlock] = useState<string>();
  const [isBlockNotificationEnabled, setIsBlockNotificationEnabled] =
    useState(true);

  const handleRegistration = useCallback(async () => {
    if (!account) return;
    try {
      await registerIdentity(signMessage);
    } catch (registerIdentityError) {
      console.error({ registerIdentityError });
    }
  }, [signMessage, registerIdentity, account]);

  useEffect(() => {
    if (!identityKey) {
      handleRegistration();
    }
  }, [handleRegistration, identityKey]);

  // handleSendNotification will send a notification to the current user and includes error handling.
  // If you don't want to use this hook and want more flexibility, you can use sendNotification.
  const handleTestNotification = useCallback(async () => {
    if (isSubscribed) {
      handleSendNotification({
        title: "GM Hacker",
        body: "Hack it until you make it!",
        icon: `${window.location.origin}/WalletConnect-blue.svg`,
        url: window.location.origin,
        type: "promotional",
      });
    }
  }, [handleSendNotification, isSubscribed]);

  // Example of how to send a notification based on some "automation".
  // sendNotification will make a fetch request to /api/notify
  const handleBlockNotification = useCallback(async () => {
    if (isSubscribed && account && isBlockNotificationEnabled) {
      const blockNumber = await wagmiPublicClient.getBlockNumber();
      if (lastBlock !== blockNumber.toString()) {
        setLastBlock(blockNumber.toString());
        try {
          toast.success("new block", {
            // position:
            // variant: "subtle",
          });

          await sendNotification({
            accounts: [account], // accounts that we want to send the notification to.
            notification: {
              title: "New block",
              body: blockNumber.toString(),
              icon: "https://social-signal.vercel.app/favicon-32x32.png",
              url: `https://etherscan.io/block/${blockNumber.toString()}`,
              type: "transactional",
            },
          });
        } catch (error: any) {
          toast("Failed to send new block notification", {
            // description: error.message ?? "Something went wrong",
          });
        }
      }
    }
  }, [
    wagmiPublicClient,
    isSubscribed,
    lastBlock,
    account,
    toast,
    isBlockNotificationEnabled,
  ]);

  useInterval(() => {
    handleBlockNotification();
  }, 12000);

  return (
    <div>
      <h3 className="self-center text-center mb-6">Web3Inbox hooks</h3>
      <div>
        {JSON.stringify(
          { isSubscribed, isSubscribing, isUnsubscribing },
          null,
          4
        )}
      </div>

      <div className="flex flex-col gap-4">
        {isSubscribed ? (
          <div className="flex flex-col gap-4 items-center">
            <button
              // leftIcon={<BsSendFill />}
              // variant="outline"
              onClick={handleTestNotification}
              disabled={!isW3iInitialized}
              // colorScheme="purple"
              // rounded="full"
              // isLoading={isSending}
              // loadingText="Sending..."
            >
              Send test notification
            </button>
            <button
              // leftIcon={isBlockNotificationEnabled ? <FaPause /> : <FaPlay />}
              // variant="outline"
              onClick={() =>
                setIsBlockNotificationEnabled((isEnabled) => !isEnabled)
              }
              disabled={!isW3iInitialized}
              // colorScheme={isBlockNotificationEnabled ? "orange" : "blue"}
              // rounded="full"
            >
              {isBlockNotificationEnabled ? "Pause" : "Resume"} block
              notifications
            </button>
            <button
              // leftIcon={<FaBellSlash />}
              onClick={unsubscribe}
              // variant="outline"
              disabled={!isW3iInitialized || !account}
              // colorScheme="red"
              // isLoading={isUnsubscribing}
              // loadingText="Unsubscribing..."
              // rounded="full"
            >
              Unsubscribe
            </button>
          </div>
        ) : (
          // <Tooltip
          //   label={
          //     !Boolean(address)
          //       ? "Connect your wallet first."
          //       : "Register your account."
          //   }
          //   hidden={Boolean(account)}
          // >
          <button
            // leftIcon={<FaBell />}
            onClick={subscribe}
            // colorScheme="cyan"
            // rounded="full"
            // variant="outline"
            // w="fit-content"
            // alignSelf="center"
            // isLoading={isSubscribing}
            // loadingText="Subscribing..."

            // disabled={!Boolean(address) || !Boolean(account)}
          >
            Subscribe
          </button>
          // </Tooltip>
        )}

        {/* {isSubscribed && ( */}
        <div className="mt-10">
          <Subscription />
          <Messages />
          {/* <Preferences /> */}
          <Subscribers />
        </div>
        {/* )} */}
      </div>
    </div>
  );
};
