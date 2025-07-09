"use client" 
import React, { createContext, useState, useEffect, useMemo, ReactNode } from "react";
import Processo from '@/components/Processo'
import Inscricoes from '@/components/Inscricoes'
import BaixaPagamentos from '@/components/BaixaPagamentos'
import UploadArquivos from '@/components/UploadArquivos'
import Relatorios from '@/components/Relatorios'
import AvaliacaoRecursos from '@/components/AvaliacaoRecursos'
import Resultados from '@/components/Resultados'
import Gabarito from '@/components/Gabarito'
import CadastroEditais from '@/components/CadastroEditais'
import EmailMassa from '@/components/EmailMassa'
import GestaoAdmins from '@/components/GestaoAdmins'
import LogsAcesso from '@/components/LogsAcesso'
import Backup from '@/components/Backup'

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

  const [selectedComponent, setSelectedComponent] = useState('Inscrição');
  const [showSidebar, setShowSidebar] = useState(true);
  const [Component, setComponent] = useState<ReactNode | undefined>(undefined);

    useEffect(() => {
    switch (selectedComponent) {
      case 'Processo':
        setComponent(<Processo />);
        break;
      case 'Inscricoes':
        setComponent(<Inscricoes />);
        break;
      case 'BaixaPagamentos':
        setComponent(<BaixaPagamentos />);
        break;
      case 'UploadArquivos':
        setComponent(<UploadArquivos />);
        break;
      case 'Relatorios':
        setComponent(<Relatorios />);
        break;
      case 'AvaliacaoRecursos':
        setComponent(<AvaliacaoRecursos />);
        break;
      case 'Resultados':
        setComponent(<Resultados />);
        break;
      case 'Gabarito':
        setComponent(<Gabarito />);
        break;
      case 'CadastroEditais':
        setComponent(<CadastroEditais />);
        break;
      case 'Comunicados':
        setComponent(<EmailMassa />);
        break;
      case 'EmailMassa':
        setComponent(<EmailMassa />);
        break;
      case 'GestaoAdmins':
        setComponent(<GestaoAdmins />);
        break;
      case 'LogsAcesso':
        setComponent(<LogsAcesso />);
        break;
      case 'Backup':
        setComponent(<Backup />);
        break;
      default:
        setComponent(<div>Selecione um item no menu</div>);
    }
  }, [selectedComponent]);

  const value = useMemo(
    () => ({
      selectedComponent, setSelectedComponent,
      showSidebar, setShowSidebar,
      Component, setComponent
    }),
    [Component, selectedComponent, showSidebar]
  );

  return <MainContext.Provider value={value}>{children}</MainContext.Provider>;
};
