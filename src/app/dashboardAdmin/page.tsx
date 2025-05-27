'use client'; // Força renderização no cliente

import Header from "@/components/HeaderAdm";
import Footer from "@/components/FooterAdm";
import Processo from "@/components/Processo";
import Inscricoes from "@/components/Inscricoes";
// import Pagamentos from "@/components/Pagamentos";
import BaixaPagamentos from "@/components/BaixaPagamentos";
import UploadArquivos from "@/components/UploadArquivos";
import Relatorios from "@/components/Relatorios";
import AvaliacaoRecursos from "@/components/AvaliacaoRecursos";
import Resultados from "@/components/Resultados";
import Certificados from "@/components/Certificados";
import CadastroEditais from "@/components/CadastroEditais";
import Comunicados from "@/components/Comunicados";
import EmailMassa from "@/components/EmailMassa";
import GestaoAdmins from "@/components/GestaoAdmins";
import LogsAcesso from "@/components/LogsAcesso";
import Backup from "@/components/Backup";
import Configuracoes from "@/components/Configuracoes";
import Sidebar from '@/components/Sidebar';


export default function PainelAdm() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
    
          {/* Header no topo */}
          <Header />
    
          {/* Conteúdo principal com Sidebar e página */}
          <div className="flex flex-1">
            {/* Sidebar à esquerda */}
            <Sidebar />
      <main className="flex-1 p-4 space-y-8">
        <Processo />
        <Inscricoes />
        {/* <Pagamentos /> */}
        <BaixaPagamentos />
        <UploadArquivos />
        <Relatorios />
        <AvaliacaoRecursos />
        <Resultados />
        <Certificados />
        <CadastroEditais />
        <Comunicados />
        <EmailMassa />
        <GestaoAdmins />
        <LogsAcesso />
        <Backup />
        <Configuracoes />
      </main>
     
    </div>
     <Footer />
    </div>
  );
}
