import { useLayoutEffect, useState, useContext } from "react";
import SideNavItems from "./SideNavItems";
import { RiSidebarFoldLine, RiSidebarUnfoldLine } from "react-icons/ri";
import { MainContext } from "@/context/MainContext";
import { getStoredSettings } from "@/context/MainContext";
export default function SideNav() {
  const { showSidebar, setShowSidebar } = useContext(MainContext);
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    const stored = getStoredSettings();
    if (typeof stored.showSidebar === "boolean") {
      setShowSidebar(stored.showSidebar);
    }
    setMounted(true);
  }, [setShowSidebar]);

  if (!mounted) return null;

  return (
    <div
      style={{
        background: "linear-gradient(270deg, #5c1c1c 0%, #731515 100%)",
      }}
      className={`flex flex-col h-[calc(100vh_-_100px)] text-white-light rounded-3xl transition-all duration-300 ease-in-out z-40 relative ${
        showSidebar ? "w-64 mdx:w-16" : "w-16"
      }`}
    >
      {showSidebar ? (
        <RiSidebarFoldLine
          onClick={() => setShowSidebar(false)}
          className="absolute top-3 right-3 text-[20px] cursor-pointer"
        />
      ) : (
        <RiSidebarUnfoldLine
          onClick={() => setShowSidebar(true)}
          className="absolute top-3 left-1/2 transform -translate-x-1/2 text-[20px] cursor-pointer"
        />
      )}
      <SideNavItems />
    </div>
  );
}
