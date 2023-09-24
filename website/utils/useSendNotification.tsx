import { useCallback, useState } from "react";
import { useW3iAccount } from "@web3inbox/widget-react";
import { INotification } from "./types";
import { sendNotification } from "./fetchNotify";
import toast from "react-hot-toast";
import { toastError } from "../components/Notifications";
import { sfxAtom } from "../components/core/Navbar";
import { useAtom } from "jotai";

function useSendNotification() {
  const [isSending, setIsSending] = useState<boolean>(false);
  const { account } = useW3iAccount();
  const [audioEnabled] = useAtom(sfxAtom);

  const handleSendNotification = useCallback(
    async (notification: INotification, accountDestination?: string) => {
      if (!account) {
        return;
      }
      setIsSending(true);
      try {
        const { success, message } = await sendNotification({
          accounts: [accountDestination || account],
          notification,
        });
        setIsSending(false);

        if (success) {
          toast.success(notification.title);
        } else {
          toastError(audioEnabled, "Message failed");
        }
        // toast({
        //   status: success ? "success" : "error",
        //   position: "top",
        //   variant: "subtle",
        //   colorScheme: success ? "purple" : "red",
        //   title: success ? notification.title : "Message failed.",
        // });
      } catch (error: any) {
        setIsSending(false);
        console.error({ sendNotificationError: error });
        toastError(audioEnabled, `${error.message}:${error.cause}`);
      }
    },
    [toast, account]
  );

  return {
    handleSendNotification,
    isSending,
  };
}

export default useSendNotification;
