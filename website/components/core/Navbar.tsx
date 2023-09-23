import React from "react";
import { NavLink } from "./NavLink";
import { motion } from "framer-motion";
import { atomWithStorage, createJSONStorage } from "jotai/utils";
import { useAtom } from "jotai";
import { IconMusicNote } from "../Icons/IconMusicNote";
import { IconMusicNoteSlash } from "../Icons/IconMusicNoteSlash";

const storage = createJSONStorage(() => sessionStorage);
export const sfxAtom = atomWithStorage("sfx-enabled", "false", storage);

function Navbar() {
  const [audioEnabled, setAudioEnabled] = useAtom(sfxAtom);

  function playNavigationSound() {
    if (!audioEnabled) return;
    try {
      const sfx = new Audio("/sfx/go-home.mp3");
      sfx.currentTime = 0;
      sfx.volume = 1;
      sfx.play();
    } catch (e) {}
  }

  return (
    <div className="w-full">
      {/* <div className="absolute top-0 mx-auto">
        <img src="/obelisk_banner.jpg" />
      </div> */}

      <motion.div
        animate={{ opacity: 100 }}
        transition={{ ease: "easeIn", duration: 4, delay: 0.025 }}
        className="image_preview_container h-[750px] absolute top-0 w-full opacity-0 z-0"
      >
        <div className="image_preview h-full"></div>
      </motion.div>
      <div className="relative items-center justify-between w-full z-10 px-8 py-4">
        <div className="gap-4 items-center flex flex-row">
          <NavLink
            href="/"
            onClick={() => {
              playNavigationSound();
            }}
          >
            Home
          </NavLink>
          <span>|</span>
          <NavLink
            href="/tribes/create"
            onClick={() => {
              playNavigationSound();
            }}
          >
            Create
          </NavLink>
          <span>|</span>
          <NavLink
            href="/explore"
            onClick={() => {
              playNavigationSound();
            }}
          >
            Explore
          </NavLink>
          <span>|</span>
          <NavLink
            href="/me"
            onClick={() => {
              playNavigationSound();
            }}
          >
            Mine
          </NavLink>
        </div>
        <w3m-button label="Connect Wallet" balance="show" />
        <div className="absolute top-1 right-4">
          <div
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="cursor-pointer w-5 h-5 opacity-80 hover:opacity-100 fill-white ml-2 mt-2"
          >
            {audioEnabled ? <IconMusicNote /> : <IconMusicNoteSlash />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
