"use client";

import Image from "next/image";
import Link from "next/link";
import VideoSearch from "../video-search";

const Sidebar = () => {
  return (
    <div className="bg-neutral-100 md:w-80 lg:w-96 h-screen px-4 py-8 hidden md:flex flex-col">
      {/* Supademo Logo */}
      <Link href="/" className="mb-4 w-fit">
        <Image
          src="/logo.svg"
          alt="Supademo Logo"
          width={40}
          height={28}
          className="w-auto h-7"
          priority
        />
      </Link>

      <VideoSearch />
    </div>
  );
};
export default Sidebar;
