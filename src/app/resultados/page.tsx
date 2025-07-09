'use client';

import { useSession } from 'next-auth/react';
import { useQuery } from 'react-query';
import api from '@/utils/api';
import Header from '../../components/HeaderAdm';
import Footer from '../../components/FooterAdm';
import StepsNavbar from '@/components/StepsNavbar'
import moment from 'moment-timezone';

export default function BoletimResultado() {
  const { data: session, status } = useSession();

  const { data: candidato, isLoading, isError } = useQuery(
    ['candidato'],
    () => api.get(`/api/candidato/${session?.user?.cpf}`).then(res => res.data),
    {
      enabled: !!session?.user?.cpf,
    }
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <StepsNavbar activeStep={7} />      
      <main className="flex-grow px-4 py-8">
        <h2 className="text-2xl font-bold text-center text-blue-800 mb-8">
          RESULTADO DO PROCESSO SELETIVO
        </h2>

        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8 space-y-6">
          <h3 className="text-xl font-bold text-blue-800">Boletim do Candidato</h3>

          {isLoading && <p>Carregando dados do candidato...</p>}
          {isError && <p className="text-red-600">Erro ao carregar dados.</p>}

          {candidato?.DataRevisao && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">Nome</p>
                <p className="text-lg font-semibold text-black">{candidato.Nome}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">CPF</p>
                <p className="text-lg font-semibold text-black">{candidato.CPF}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Nota de Redação</p>
                <p className="text-lg font-semibold text-black">{candidato.NotaRedacao}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Nota de Matemática</p>
                <p className="text-lg font-semibold text-black">{candidato.NotaMatematica}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Nota de Português</p>
                <p className="text-lg font-semibold text-black">{candidato.NotaPortugues}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Data de Revisão</p>
                <p className="text-lg font-semibold text-black">{moment(candidato.DataRevisao).tz("America/Sao_Paulo").format("DD/MM/YYYY HH:mm")}</p>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
