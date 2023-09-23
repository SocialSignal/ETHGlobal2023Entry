import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { TribeList } from "../TribeList";
import { sfxAtom } from "../core/Navbar";
import { useAtom } from "jotai";

export default function MainDialog({ onPlayGlobalSound }: any) {
  const router = useRouter();
  const [isClosing, setIsClosing] = useState(false);
  const [audioEnabled] = useAtom(sfxAtom);

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
      <div className="text-black shadow-inner flex flex-col min-w-[540px] max-w-[940px] bg-[#E0B779] px-8 py-10 rounded-xl">
        <h1 className="text-3xl font-bold underline">
          <Link
            href="/tribes/create"
            onClick={(e) => {
              setIsClosing(true);

              try {
                onPlayGlobalSound();

                if (audioEnabled) {
                  var audio = new Audio("/sfx/create-tribe.mp3");
                  audio.volume = 1;
                  audio.play();
                  e.preventDefault();

                  setTimeout(() => {
                    router.push("/tribes/create");
                  }, 1200);
                } else {
                  router.push("/tribes/create");
                }
              } catch (e) {}
            }}
          >
            Create tribe!
          </Link>
        </h1>
        <h1 className="text-3xl font-bold underline">
          <a href="/tribes">See your tribes</a>
        </h1>
      </div>
      <TribeList />
    </motion.div>
  );
}
