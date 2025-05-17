"use client";
import { useState, useContext, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { signOut } from "next-auth/react";
import useSideNavItems from "./sideNavItemMock";
import SideNavItem from "./SideNavItem";
import { DashboardContext } from "@/context/DashboardContext";
import Image from "next/image";
import { logo } from "../../../../public";
import "flag-icons/css/flag-icons.min.css";
import { MainContext } from "@/context/MainContext";
import normalizeKey from "@/helpers/normalizeKey";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { AnimatePresence } from "framer-motion";

export default function SideNavItems() {
  const { setActiveItem } = useContext(DashboardContext);
  const { showSidebar, setShowSidebar, showCommands, setShowCommands, openSettingsShortcut  } = useContext(MainContext);
  const sideNavItems = useSideNavItems();
  const router = useRouter();
  const pathname = usePathname();
  const isPhone = useMediaQuery({ maxWidth: 890 });
  const segments = pathname.split("/");

  const [isOpenSettings, setIsOpenSettings] = useState(false);
  const [currentHash, setCurrentHash] = useState<string>(
    typeof window !== "undefined"
      ? normalizeKey(window.location.hash.replace("#", "") || "main")
      : "main"
  );

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      const normalized = normalizeKey(hash || "main");
      setCurrentHash(normalized);
      setActiveItem(normalized);
    };

    window.addEventListener("hashchange", onHashChange);
    onHashChange(); // Inicial
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [setActiveItem]);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const index = sideNavItems.findIndex(
      (item) => normalizeKey(item.text) === currentHash
    );
    if (index !== -1) setActiveIndex(index);
  }, [currentHash, sideNavItems]);

  const handleNavigate = (itemText: string, index: number) => {
    setActiveIndex(index);
    window.location.hash = normalizeKey(itemText);
  };


  return (
    <>
    
    </>
  );
}
