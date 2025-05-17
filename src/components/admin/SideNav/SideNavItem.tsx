"use client";
import React, { useState, useEffect } from "react";
import normalizeKey from "@/helpers/normalizeKey";

export default function SideNavItem({
  item,
  isActive,
  setIsActive,
  isPhone,
  showSidebar,
  setShowSidebar,
}: any) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentHash, setCurrentHash] = useState<string>("");

  const handleClick = () => {
    const key = normalizeKey(item.text);
    setIsActive(key);
    window.location.hash = key;
  };

  useEffect(() => {
    const updateHash = () => {
      setCurrentHash(window.location.hash.replace("#", ""));
    };

    updateHash();

    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  const isActiveHash = normalizeKey(item.text) === currentHash;

  return (
    <div
      tabIndex={isActiveHash ? 0 : undefined}
      autoFocus={isActiveHash}
      className={`flex items-center mdx:justify-center w-full h-12 px-3 md:px-1 mt-2 rounded-md relative cursor-pointer
        hover-bg-gray-700 transition-colors
        ${isActiveHash ? "bg-[#3e0a0a]" : ""}
      `}
      onMouseEnter={() => isPhone && setIsHovered(true)}
      onMouseLeave={() => isPhone && setIsHovered(false)}
      onTouchStart={() => isPhone && setIsHovered(true)}
      onTouchEnd={() => isPhone && setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="flex items-center justify-center w-8 h-8">
        {item.icon && React.cloneElement(item.icon, { className: "w-6 h-6" })}
      </div>
      <span
        className={`text-sm font-medium mt-1 ml-1 ${
          showSidebar ? "mdx:hidden" : "hidden"
        }`}
      >
        {item.text}
      </span>
    </div>
  );
}
