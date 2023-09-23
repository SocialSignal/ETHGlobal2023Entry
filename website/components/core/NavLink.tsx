import React, { useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import classnames from "classnames";

interface Props {
  children: React.ReactNode;
  href: string;
  onClick?: () => void;
}

export const NavLink = (props: Props) => {
  const { children, href } = props;
  const router = useRouter();
  const isActive = useMemo(
    () => router?.pathname === href,
    [router?.pathname, href]
  );
  // const hoverBg = useColorModeValue("gray.200", "gray.700");

  return (
    <Link
      className={classnames(
        "text-white hover:underline mx-2 w-[45px] block text-center",
        {
          "text-gray-200 font-bold": isActive,
        }
      )}
      {...props}
    >
      {children}
    </Link>
  );
};
