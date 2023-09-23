"use client";
import type { NextPage } from "next";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  useInitWeb3InboxClient,
  useManageSubscription,
  useW3iAccount,
} from "@web3inbox/widget-react";
import "@web3inbox/widget-react/dist/compiled.css";

import { useAccount, usePublicClient, useSignMessage } from "wagmi";
import { FaBell, FaBellSlash, FaPause, FaPlay } from "react-icons/fa";
import { BsPersonFillCheck, BsSendFill } from "react-icons/bs";
import useSendNotification from "../utils/useSendNotification";
import { useInterval } from "usehooks-ts";
// import Preferences from "../components/Preferences";
// import Messages from "../components/Messages";
// import Subscription from "../components/Subscription";
import { sendNotification } from "../utils/fetchNotify";
// import Subscribers from "../components/Subscribers";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID as string;
const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN as string;

const Home: NextPage = () => {
  const router = useRouter();

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
  const {
    subscribe,
    unsubscribe,
    isSubscribed,
    isSubscribing,
    isUnsubscribing,
  } = useManageSubscription(account);

  const { address } = useAccount({
    onDisconnect: () => {
      setAccount("");
    },
  });
  const { signMessageAsync } = useSignMessage();
  const wagmiPublicClient = usePublicClient();

  // const { colorMode } = useColorMode();

  const { handleSendNotification, isSending } = useSendNotification();
  const [lastBlock, setLastBlock] = useState<string>();
  const [isBlockNotificationEnabled, setIsBlockNotificationEnabled] =
    useState(true);

  const signMessage = useCallback(
    async (message: string) => {
      const res = await signMessageAsync({
        message,
      });

      return res as string;
    },
    [signMessageAsync]
  );

  // We need to set the account as soon as the user is connected
  useEffect(() => {
    if (!Boolean(address)) return;
    setAccount(`eip155:1:${address}`);
  }, [signMessage, address, setAccount]);

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
              icon: `${window.location.origin}/eth-glyph-colored.png`,
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

  const [isClosing, setIsClosing] = useState(false);
  const introAudioRef = useRef<HTMLAudioElement>();

  useEffect(() => {
    try {
      var audio = new Audio("/sfx/intro2.mp3");
      audio.volume = 1;
      audio.play();
      introAudioRef.current = audio;
    } catch (e) {}
  }, []);

  return (
    <motion.div
      className="opacity-0"
      initial="hidden"
      animate={isClosing ? "hidden" : "visible"}
      variants={{
        visible: {
          opacity: 100,
          transition: { ease: "easeOut", duration: 0.85, delay: 2.3 },
        },
        hidden: {
          opacity: 0,
          transition: { ease: "easeIn", duration: 0.5, delay: 0 },
        },
      }}
    >
      <div className="flex flex-col min-w-[540px] max-w-[940px] bg-[#fefefe] px-8 py-10 rounded-xl">
        <h1 className="text-3xl font-bold underline text-red-500">
          <Link
            href="/tribes/create"
            onClick={(e) => {
              setIsClosing(true);

              try {
                if (introAudioRef.current) introAudioRef.current.pause();

                var audio = new Audio("/sfx/create-tribe.mp3");
                audio.volume = 1;
                audio.play();
                e.preventDefault();

                setTimeout(() => {
                  router.push("/tribes/create");
                }, 1200);
              } catch (e) {}
            }}
          >
            Create tribe!
          </Link>
        </h1>
        <h1 className="text-3xl font-bold underline">
          <a href="/tribes">See your tribes</a>
        </h1>

        <h3 className="self-center text-center mb-6">Web3Inbox hooks</h3>

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
              disabled={!Boolean(address) || !Boolean(account)}
            >
              Subscribe
            </button>
            // </Tooltip>
          )}

          {isSubscribed && (
            // <Accordion defaultIndex={[1]} allowToggle mt={10} rounded="xl">
            <div className="mt-10">
              {/* <Subscription />
            <Messages />
            <Preferences />
            <Subscribers /> */}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
