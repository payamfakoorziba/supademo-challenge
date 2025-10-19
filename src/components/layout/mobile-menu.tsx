"use client";

import { cn } from "@/lib/utils";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/16/solid";
import { useState } from "react";
import VideoSearch from "../video-search";

const MobileMenu = ({ className }: { className?: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className={cn("md:hidden", className)}>
      {/* Hamburger Menu Button */}
      <button
        onClick={toggleMenu}
        className="p-2 rounded-md text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
        aria-label="Toggle mobile menu"
      >
        <Bars3Icon className="w-6 h-6" />
      </button>

      {/* Full Screen Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-neutral-100 z-50 px-8 py-12">
          <VideoSearch onVideoClick={closeMenu} />

          <button
            onClick={closeMenu}
            className="absolute top-3 right-3 hover:bg-neutral-200 rounded-md p-1 transition-colors"
          >
            <XMarkIcon className="size-5 text-neutral-700" />
          </button>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
