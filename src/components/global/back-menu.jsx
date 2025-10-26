"use client";

import Link from "next/link";
import { buttonVariants } from "../ui/button";

const BackMenu = ({ href }) => {
  return (
    <Link href={href} className={buttonVariants({ variant: "default" })}>
      Back
    </Link>
  );
};

export default BackMenu;
