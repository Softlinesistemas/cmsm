import React, { createContext, useState, useEffect, useMemo, ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  products: any;
  setProducts: (value: any[]) => void;
  selectedCustomer: number | null;
  setSelectedCustomer: (value: number | null) => void;
  showSidebar: boolean;
  setShowSidebar: (value: boolean) => void;
  showCommands: boolean;
  setShowCommands: (value: boolean) => void;
  abbreviateState: boolean;
  setAbbreviateState: (value: boolean) => void;
  navigateSidebar: boolean;
  setNavigateSidebar: (value: boolean) => void;
  openSettingsShortcut: boolean;
  setOpenSettingsShortcut: (value: boolean) => void;
  focusTable: boolean;
  setFocusTable: (value: boolean) => void;
  focusSearchInput: boolean;
  setFocusSearchInput: (value: boolean) => void;
  reorderedStates: boolean;
  setReorderedStates: (value: boolean) => void;
}

const LOCAL_STORAGE_KEY = "appSettings";

export const MainContext = createContext({} as Props);

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

  const [products, setProducts] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [showSidebar, setShowSidebar] = useState<boolean>(stored.showSidebar ?? true);
  const [showCommands, setShowCommands] = useState<boolean>(stored.showCommands ?? false);
  const [reorderedStates, setReorderedStates] = useState<boolean>(stored.reorderedStates ?? currentLocale === "en-US");
  const [abbreviateState, setAbbreviateState] = useState<boolean>(stored.abbreviateState ?? true);
  const [navigateSidebar, setNavigateSidebar] = useState<boolean>(stored.navigateSidebar ?? true);
  const [openSettingsShortcut, setOpenSettingsShortcut] = useState<boolean>(stored.openSettingsShortcut ?? true);
  const [focusTable, setFocusTable] = useState<boolean>(stored.focusTable ?? true);
  const [focusSearchInput, setFocusSearchInput] = useState<boolean>(stored.focusSearchInput ?? true);

  useEffect(() => { saveSettings({ showSidebar }); }, [showSidebar]);
  useEffect(() => { saveSettings({ showCommands }); }, [showCommands]);
  useEffect(() => { saveSettings({ abbreviateState }); }, [abbreviateState]);
  useEffect(() => { saveSettings({ navigateSidebar }); }, [navigateSidebar]);
  useEffect(() => { saveSettings({ openSettingsShortcut }); }, [openSettingsShortcut]);
  useEffect(() => { saveSettings({ focusTable }); }, [focusTable]);
  useEffect(() => { saveSettings({ focusSearchInput }); }, [focusSearchInput]);
  useEffect(() => { saveSettings({ reorderedStates }); }, [reorderedStates]);

  const value = useMemo(
    () => ({
      products, setProducts,
      selectedCustomer, setSelectedCustomer,
      showSidebar, setShowSidebar,
      showCommands, setShowCommands,
      abbreviateState, setAbbreviateState,
      navigateSidebar, setNavigateSidebar,
      openSettingsShortcut, setOpenSettingsShortcut,
      focusTable, setFocusTable,
      focusSearchInput, setFocusSearchInput,
      reorderedStates, setReorderedStates
    }),
    [selectedCustomer, showSidebar, showCommands, abbreviateState, navigateSidebar, openSettingsShortcut, focusTable, focusSearchInput, products, reorderedStates]
  );

  return <MainContext.Provider value={value}>{children}</MainContext.Provider>;
};