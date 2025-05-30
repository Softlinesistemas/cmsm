'use client'

import { useState, useContext, useEffect, ReactNode } from 'react'
import { MainProvider } from "@/context/MainContext";

import Header from '@/components/HeaderAdm'
import Footer from '@/components/FooterAdm'
import Processo from '@/components/Processo'
import Inscricoes from '@/components/Inscricoes'
// import Pagamentos from "@/components/Pagamentos";
import BaixaPagamentos from '@/components/BaixaPagamentos'
import UploadArquivos from '@/components/UploadArquivos'
import Relatorios from '@/components/Relatorios'
import AvaliacaoRecursos from '@/components/AvaliacaoRecursos'
import Resultados from '@/components/Resultados'
import Certificados from '@/components/Certificados'
import CadastroEditais from '@/components/CadastroEditais'
import Comunicados from '@/components/Comunicados'
import EmailMassa from '@/components/EmailMassa'
import GestaoAdmins from '@/components/GestaoAdmins'
import LogsAcesso from '@/components/LogsAcesso'
import Backup from '@/components/Backup'
import Configuracoes from '@/components/Configuracoes'
import Sidebar from '@/components/Sidebar'

import { MainContext } from '@/context/MainContext'

export default function PainelAdm() {
  // Estado para controlar qual componente está sendo exibido
  const { selectedComponent, setSelectedComponent } = useContext(MainContext);
  const [Component, setComponent] = useState<ReactNode | undefined>(undefined);

useEffect(() => {
  switch (selectedComponent) {
    case 'Processo':
      setComponent(<Processo />)
      break;
    case 'Inscricoes':
      setComponent(<Inscricoes />)
      break;
    // case 'Pagamentos':
    //   setComponent(<Pagamentos />)
    //   break;
    case 'BaixaPagamentos':
      setComponent(<BaixaPagamentos />)
      break;
    case 'UploadArquivos':
      setComponent(<UploadArquivos />)
      break;
    case 'Relatorios':
      setComponent(<Relatorios />)
      break;
    case 'AvaliacaoRecursos':
      setComponent(<AvaliacaoRecursos />)
      break;
    case 'Resultados':
      setComponent(<Resultados />)
      break;
    case 'Certificados':
      setComponent(<Certificados />)
      break;
    case 'CadastroEditais':
      setComponent(<CadastroEditais />)
      break;
    case 'Comunicados':
      setComponent(<Comunicados />)
      break;
    case 'EmailMassa':
      setComponent(<EmailMassa />)
      break;
    case 'GestaoAdmins':
      setComponent(<GestaoAdmins />)
      break;
    case 'LogsAcesso':
      setComponent(<LogsAcesso />)
      break;
    case 'Backup':
      setComponent(<Backup />)
      break;
    case 'Configuracoes':
      setComponent(<Configuracoes />)
      break;
    default:
      setComponent(<div>Selecione um item no menu</div>)
  }
}, [selectedComponent])

  // Função para renderizar o componente selecionado
 
  useEffect(() => {
    console.log(Component)
  }, [Component])

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <MainProvider>
        {/* Header */}
        <Header />

        {/* Sidebar e Conteúdo */}
        <div className="flex flex-1">
          {/* Sidebar à esquerda */}
          <Sidebar />

          {/* Conteúdo principal */}
          <main className="flex-1 p-4 space-y-8">
            {Component}
          </main>
        </div>

        {/* Footer */}
        <Footer />
      </MainProvider>
    </div>
  )
}
