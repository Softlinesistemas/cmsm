'use client';

import { useEffect, useState } from 'react';
import { useAvaliacao } from '@/hooks/useAvaliacao';
import Header from '../../components/HeaderAdm'
import Footer from '../../components/FooterAdm'
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

export default function EnviarAvaliacao() {
  const { data: session, status } = useSession();

  const [formData, setFormData] = useState({
    codigoOrgao: '167079',
    codigoServico: '11908',
    numeroProtocolo: `PROT-${Date.now()}`,
    cpfCidadao: '',
    nomeCidadao: '',
    emailCidadao: '',
    telefoneCidadao: '',
  });

 useEffect(() => {
    if (status === "authenticated" && session.user) {
      setFormData({ ...formData, nomeCidadao: session?.user?.name || "", emailCidadao: session?.user?.email || "", cpfCidadao: String(session?.user?.cpf), telefoneCidadao: session?.user?.phone_number || ""})
    }
  }, [status]);

  const { mutate, data, isLoading, isError, error } = useAvaliacao();

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    toast.promise(
      new Promise((resolve, reject) => {
        mutate(formData, {
          onSuccess: resolve,
          onError: reject,
        });
      }),
      {
        loading: 'Acessando avaliação...',
        success: 'Link de avaliação gerado com sucesso!',
        error: 'Erro ao gerar link de avaliação.',
      }
    );
  };


  return (
     <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow px-4 py-8">
            <h2 className="text-2xl font-bold text-center text-blue-800 mb-8">
                AVALIAÇÃO DE SERVIÇO
            </h2>
            <form
            onSubmit={handleSubmit}
            className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8 space-y-6"
            >
            <h2 className="text-2xl font-bold text-blue-800 mb-4">Formulário de Avaliação</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">          

                <div>
                    <label className="block text-sm font-medium text-blue-800 mb-1">CPF</label>
                    <input
                        type="text"
                        placeholder="CPF"
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) =>
                        setFormData((prev) => ({ ...prev, cpfCidadao: e.target.value }))
                        }
                    />
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-blue-800 mb-1">Nome</label>
                    <input
                        type="text"
                        placeholder="Nome"
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) =>
                        setFormData((prev) => ({ ...prev, nomeCidadao: e.target.value }))
                        }
                    />
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-blue-800 mb-1">E-mail</label>
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) =>
                        setFormData((prev) => ({ ...prev, emailCidadao: e.target.value }))
                        }
                    />
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-blue-800 mb-1">Telefone</label>
                    <input
                        type="text"
                        placeholder="Telefone"
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) =>
                        setFormData((prev) => ({ ...prev, telefoneCidadao: e.target.value }))
                        }
                    />
                    </div>
                </div>

                <div className="pt-4">
                    <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-700 text-white px-6 py-3 rounded-md shadow hover:bg-blue-800 transition-all duration-300 disabled:opacity-50"
                    >
                    {isLoading ? 'Enviando...' : 'Acessar Avaliação'}
                    </button>

                {data && !data?.error && (
                    <div className='mt-4'>
                        <p className='text-black'><strong>Protocolo:</strong> {data.protocoloAvaliacao}</p>
                        <p className='text-black'><strong>Validade:</strong> {data.validade}</p>
                        <p><a href={data.urlFormulario} target="_blank">Acessar Formulário</a></p>
                    </div>
                )}
                </div>
            </form>
        </main>
      <Footer />
    </div>
  );
}
