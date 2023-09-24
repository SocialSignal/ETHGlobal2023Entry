import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { toastError } from "../../components/Notifications";
import { sfxAtom } from "../../components/core/Navbar";
import { useAtom } from "jotai";
import { useAccount } from "wagmi";
import { useTribeENSRepair } from "../../components/hooks/useTribeENSRepair";
import {
  Provider,
  Signer,
  Transaction,
  TransactionReceipt,
  ZeroAddress,
} from "ethers";

const networkIds = {
  gnosis: 100,
  arbitrum: 42161,
  scroll: 534352,
  base: 8453,
  mantle: 5000,
  celo: 42220,
  linea: 59144,
  neonevm: 1,
  polygon: 137,
  zkSync: 324,
};

const networkOptions = [
  "gnosis",
  "arbitrum",
  "scroll",
  "base",
  "mantle",
  "celo",
  "linea",
  "neonevm",
  "polygon",
];

function waitForTx(txHash: string, provider: Provider) {
  return new Promise<void>((resolve, reject) => {
    provider.once(txHash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations. `,
        { transactionReceipt }
      );

      resolve();
    });
  });
}

export default () => {
  const router = useRouter();
  const [audioEnabled] = useAtom(sfxAtom);
  const [actionMessage, setActionMessage] = useState<string>();

  const { address, connector } = useAccount();

  // const {provider} = useProvider();
  // const { data: primaryENS } = useEnsName({
  //   address,
  // });

  // console.log({ address, primaryENS });

  const [isActionInProgress, setIsActionInProgress] = useState(false);
  const [name, setName] = useState<string>();
  const [network, setNetwork] = useState<number>();
  const [description, setDescription] = useState<string>();
  const [ensName, setENSName] = useState<string>();
  const [tribeValues, setTribeValues] = useState<string>();
  const [largeAvatar, setLargeAvatar] = useState<File>();
  const [smallAvatar, setSmallAvatar] = useState<File>();
  const lastAudioRef = useRef<HTMLAudioElement>();

  const { configureTribeRecords } = useTribeENSRepair();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setActionMessage("");
    e.preventDefault();
    if (!largeAvatar) {
      toastError(audioEnabled, "Large avatar is required");
      return;
    } else if (!name?.trim().length) {
      toastError(audioEnabled, "Name is required");
      return;
    } else if (!network) {
      toastError(audioEnabled, "Network is required");
      return;
    } else if (!ensName?.trim().length) {
      toastError(audioEnabled, "ensName is required");
      return;
    } else if (!tribeValues?.trim().length) {
      toastError(audioEnabled, "Tribe values are required");
      return;
    }

    try {
      try {
        if (lastAudioRef.current) lastAudioRef.current.pause();

        if (audioEnabled) {
          const sfx = new Audio("/sfx/create-tribe-press.mp3");
          sfx.currentTime = 0;
          sfx.volume = 1;
          sfx.play();
        }
      } catch (e) {}

      setIsActionInProgress(true);
      const data = new FormData();
      data.set("largeAvatar", largeAvatar);
      data.set("name", name);
      data.set("chainId", network.toString());
      data.set("ensName", ensName);
      data.set("tribeValues", tribeValues);

      if (description) data.set("description", description);
      if (smallAvatar) data.set("smallAvatar", smallAvatar);
      if (address) data.set("owner", address); // TODO make this mandatory

      setActionMessage("Uploading data");
      const res = await fetch("/api/tribes/create", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        toastError(
          audioEnabled,
          (await res.text()) || "Failed to create tribe"
        );
      } else {
        try {
          setActionMessage("Configuring ENS");
          await configureTribeRecords(ensName, {
            displayName: name,
            values: tribeValues?.split(",").map((x) => x.trim()),
            description: description || "",
            // largeAvatarIPFS,
            tribeId: {
              chainId: network,
              // Get this from CreateTribe
              address: ZeroAddress,
            },
            // smallAvatarIPFS,
          } as any);
        } catch (e) {
          toastError(
            audioEnabled,
            "Failed to set ENS records. Tribe was created, but please try to repair ENS later."
          );
        }

        const { address: tribeAddress } = await res.json();

        console.log({ tribeAddress });
        await waitForTx(tribeAddress.hash, await connector!.getProvider());

        try {
          if (lastAudioRef.current) lastAudioRef.current.pause();

          if (audioEnabled) {
            const sfx = new Audio("/sfx/tribe-create-succeed.mp3");
            sfx.currentTime = 0;
            sfx.volume = 1;
            sfx.play();
          }
        } catch (e) {}

        // router.push(`/tribes/${network}/${tribeAddress}}`);
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsActionInProgress(false);
    }
  };

  return (
    <motion.div
      className="opacity-0 bg-[#fefefe] p-8 pt-5 flex flex-col gap-y-2 rounded-xl text-black"
      animate={{ opacity: 100 }}
      transition={{ ease: "easeOut", duration: 0.85, delay: 2.3 }}
    >
      <h1 className="text-3xl py-0">Create a tribe</h1>

      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text text-black">
            What is your tribe&apos;s name
          </span>
        </label>
        <input
          type="text"
          placeholder="tribe name"
          className="text-white input input-bordered input-primary w-full max-w-xs"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text text-black">
            How would you describe your tribe
          </span>
        </label>
        <textarea
          className="text-white textarea textarea-primary w-full"
          placeholder="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text text-black">ENS name</span>
        </label>
        <input
          type="text"
          placeholder="mytribe.eth"
          className="text-white textarea textarea-primary w-full"
          value={ensName}
          onChange={(e) => setENSName(e.target.value)}
        />
      </div>

      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text text-black">Declare your values</span>
        </label>
        <textarea
          className="text-white textarea textarea-primary w-full"
          placeholder="tribe values"
          value={tribeValues}
          onChange={(e) => setTribeValues(e.target.value)}
        />
      </div>

      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text text-black">
            Select a large avatar size (ideally 350x350px)
          </span>
        </label>
        <input
          type="file"
          className="file-input file-input-bordered file-input-primary w-full max-w-xs text-white"
          onChange={(e) => setLargeAvatar(e.target.files?.[0])}
        />
      </div>

      {/* TODO: Automatically resize, but give user option to upload a different image specifically for small sizes */}
      <div className="form-control w-full max-w-xs mb-4">
        <label className="label">
          <span className="label-text text-black">
            Select a small avatar size
          </span>
        </label>
        <input
          type="file"
          className="file-input file-input-bordered file-input-primary w-full max-w-xs text-white"
          onChange={(e) => setSmallAvatar(e.target.files?.[0])}
        />
      </div>

      <select
        className="select select-bordered select-xs w-full max-w-xs text-white"
        value={network}
        onChange={(e) => setNetwork(parseInt(e.target.value))}
      >
        <option disabled selected>
          Network
        </option>
        {networkOptions.map((x) => (
          <option key={x} value={(networkIds as any)[x]?.toString()}>
            {x}
          </option>
        ))}
      </select>

      {isActionInProgress ? (
        <button className="btn">
          <span className="loading loading-spinner"></span>
          {actionMessage || "loading"}
        </button>
      ) : (
        <button
          className="btn"
          onClick={(e: any) => {
            console.log("onclick", { audioEnabled });
            onSubmit(e);
          }}
          disabled={isActionInProgress}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="#be123c"
            stroke="#be123c"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          Create
        </button>
      )}
    </motion.div>
  );
};
