import React from "react";
import { NavLink } from "./NavLink";
import { motion } from "framer-motion";

function Navbar() {
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
        <div className="gap-4 items-center">
          <NavLink
            href="/"
            onClick={() => {
              try {
                const sfx = new Audio("/sfx/go-home.mp3");
                sfx.currentTime = 0;
                sfx.volume = 1;
                sfx.play();
              } catch (e) {}
            }}
          >
            Home
          </NavLink>
        </div>
        {/* <w3m-button label="Connect Wallet" balance="show" /> */}
      </div>
    </div>
  );
}

export default Navbar;
