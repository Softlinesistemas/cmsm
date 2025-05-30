"use client"
import React, { createContext, useState, useEffect, useMemo, ReactNode } from "react";
import { useTranslation } from "react-i18next";

const LOCAL_STORAGE_KEY = "appSettings"; 

export const MainContext = createContext({} as any);

export const getStoredSettings = () => {
  if (typeof window === "undefined") return {};
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
};


const saveSettings = (settings: Partial<Record<string, unknown>>) => {
  if (typeof window !== "undefined") {
    const current = getStoredSettings();
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({ ...current, ...settings })
    );
  }
};

export const MainProvider = ({ children }: { children: ReactNode }) => {
  const stored = getStoredSettings();
  const { i18n } = useTranslation();
  const currentLocale = i18n.language;

  const [selectedComponent, setSelectedComponent] = useState('Inscrição');
  const [showSidebar, setShowSidebar] = useState(true);

  const value = useMemo(
    () => ({
      selectedComponent, setSelectedComponent,
      showSidebar, setShowSidebar
    }),
    [selectedComponent, showSidebar]
  );

  return <MainContext.Provider value={value}>{children}</MainContext.Provider>;
};
