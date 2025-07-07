'use client';
import React, { createContext, useContext, useState } from "react";

export interface Edital {
  id: number;
  titulo: string;
  descricao: string;
}

interface EditalContextProps {
  editais: Edital[];
  adicionarEdital: (novo: Edital) => void;
}
 
const EditalContext = createContext<EditalContextProps | undefined>(undefined);

export const EditalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [editais, setEditais] = useState<Edital[]>([
    { id: 1, titulo: "Edital 01", descricao: "Contém todas as regras, critérios e informações oficiais do processo seletivo." }
  ]);

  const adicionarEdital = (novo: Edital) => {
    setEditais(prev => [...prev, novo]);
  };

  return (
    <EditalContext.Provider value={{ editais, adicionarEdital }}>
      {children}
    </EditalContext.Provider>
  );
};

export const useEditais = () => {
  const context = useContext(EditalContext);
  if (!context) throw new Error("useEditais deve ser usado dentro de EditalProvider");
  return context;
};
