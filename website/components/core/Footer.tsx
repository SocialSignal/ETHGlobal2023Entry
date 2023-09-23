import React from "react";
import Link from "next/link";
import { FaGithub, FaMoon, FaSun } from "react-icons/fa";

function Footer() {
  return (
    <div
    //  justifyContent="flex-end" position="fixed" right="36px" bottom="36px"
    >
      <div
      // alignItems="center" gap={2}
      >
        <a
          // aria-label="Github repo"
          // size="md"
          // as={Link}
          // rounded="full"
          // target="_blank"
          // rel="noopener noreferrer"
          // variant="outline"
          // icon={<FaGithub />}
          href="https://github.com/SocialSignal/ETHGlobal2023Entry"
        />
        {/* <IconButton
          aria-label="toggle theme"
          size="md"
          rounded={"full"}
          onClick={toggleColorMode}
          icon={colorMode === "dark" ? <FaSun /> : <FaMoon />}
        /> */}
      </div>
    </div>
  );
}

export default Footer;
