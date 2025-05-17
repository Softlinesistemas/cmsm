"use client";

import { createContext, useEffect, useState } from "react";
import normalizeKey from "@/helpers/normalizeKey";

export type SideNavItemKey = "main" ;

interface DashboardContextProps {
  activeItem: SideNavItemKey;
  setActiveItem: (value: SideNavItemKey) => void;
  navigateTo: (key: string) => void;
}

export const DashboardContext = createContext({} as DashboardContextProps);

export const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeItem, setActiveItem] = useState<SideNavItemKey>("main");

  const updateActiveFromHash = () => {
    const hash = window.location.hash.replace("#", "") || "main";
    const normalizedKey = normalizeKey(hash);
    setActiveItem(normalizedKey);
  };

  const navigateTo = (key: string) => {
    const normalizedKey = normalizeKey(key);
    if (typeof window !== "undefined") {
      window.location.hash = normalizedKey;
    }
  };

  useEffect(() => {
    updateActiveFromHash();
    window.addEventListener("hashchange", updateActiveFromHash);
    return () => window.removeEventListener("hashchange", updateActiveFromHash);
  }, []);

  return (
    <DashboardContext.Provider value={{ activeItem, setActiveItem, navigateTo }}>
      {children}
    </DashboardContext.Provider>
  );
};
