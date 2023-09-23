import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { toastError } from "../../components/Notifications";
import { sfxAtom } from "../../components/core/Navbar";
import { useAtom } from "jotai";

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

export default () => {
  const router = useRouter();
  const [audioEnabled] = useAtom(sfxAtom);

  const [isActionInProgress, setIsActionInProgress] = useState(false);
  const [name, setName] = useState<string>();
  const [network, setNetwork] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [ensName, setENSName] = useState<string>();
  const [tribeValues, setTribeValues] = useState<string>();
  const [largeAvatar, setLargeAvatar] = useState<File>();
  const [smallAvatar, setSmallAvatar] = useState<File>();
  const lastAudioRef = useRef<HTMLAudioElement>();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!largeAvatar) {
      toastError(audioEnabled, "Large avatar is required");
      return;
    } else if (!name?.trim().length) {
      toastError(audioEnabled, "Name is required");
      return;
    } else if (!network?.trim().length) {
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
      data.set("network", network);
      data.set("ensName", ensName);
      data.set("tribeValues", tribeValues);

      if (description) data.set("description", description);
      if (smallAvatar) data.set("smallAvatar", smallAvatar);

      const res = await fetch("/api/tribes/create", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        toastError(audioEnabled, await res.text());
      } else {
        try {
          if (lastAudioRef.current) lastAudioRef.current.pause();

          if (audioEnabled) {
            const sfx = new Audio("/sfx/tribe-create-succeed.mp3");
            sfx.currentTime = 0;
            sfx.volume = 1;
            sfx.play();
          }
        } catch (e) {}

        router.push(res.url);
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
          className="input input-bordered input-primary w-full max-w-xs"
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
          className="textarea textarea-primary w-full"
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
          placeholder="ENS name"
          className="textarea textarea-primary w-full"
          value={ensName}
          onChange={(e) => setENSName(e.target.value)}
        />
      </div>

      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text text-black">Declare your values</span>
        </label>
        <textarea
          className="textarea textarea-primary w-full"
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
        onChange={(e) => setNetwork(e.target.value)}
      >
        <option disabled selected>
          Network
        </option>
        {networkOptions.map((x) => (
          <option key={x} value={x}>
            {x}
          </option>
        ))}
      </select>

      {isActionInProgress ? (
        <button className="btn" disabled>
          <span className="loading loading-spinner text-black"></span>
          loading
        </button>
      ) : (
        <button
          className="btn"
          onClick={(e: any) => {
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
