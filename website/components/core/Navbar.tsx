import React from "react";
import { NavLink } from "./NavLink";

function Navbar() {
  return (
    <div className="items-center justify-between w-full">
      <div className="gap-4 items-center">
        <NavLink href="/">Home</NavLink>
      </div>
      <w3m-button label="Connect Wallet" balance="show" />
    </div>
  );
}

export default Navbar;
