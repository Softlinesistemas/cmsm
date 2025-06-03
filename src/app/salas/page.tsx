'use client'

import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/HeaderAdm';
import { Pencil, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { MainContext } from "@/context/MainContext";
import { useState, useEffect, useContext } from "react";


export default function SalasPage() {
  const salasCadastradas = [
    { cod: '001', nome: 'Sala 101', andar: '1º', capacidade: 30, ano: '6º', especial: 'Sim' },
    { cod: '002', nome: 'Sala 102', andar: '1º', capacidade: 35, ano: '1º', especial: 'Não' },
    { cod: '003', nome: 'Sala 201', andar: '2º', capacidade: 40, ano: '6º', especial: 'Sim' },
  ];

  const ensalamento = [
    { cod: '001', sala: 'Sala 101', participantes: ['Ana', 'Bruno', 'Carlos'] },
    { cod: '002', sala: 'Sala 102', participantes: ['Daniel', 'Elisa', 'Fernanda'] },
  ];

     const { selectedComponent, setSelectedComponent, Component } = useContext(MainContext);
   
     useEffect(() => {
       console.log('PainelAdm selectedComponent:', selectedComponent);
     }, [selectedComponent]);
 
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header fixo no topo */}
      <Header />

      {/* Container flex com sidebar e conteúdo */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar com largura fixa e responsiva */}
        <Sidebar />

        {/* Conteúdo principal flexível, com padding e overflow para scroll */}
        <main className="flex-1 p-4 md:p-8 overflow-auto min-w-0">
          <h1 className="text-3xl font-bold text-blue-900 text-center mb-8">SALAS</h1>

          {/* Cadastro de Salas */}
          <section className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 max-w-full mx-auto mb-8">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">Cadastro de Salas</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-700">Nome ou número da sala</label>
                <input type="text" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Andar</label>
                <input type="text" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Capacidade</label>
                <input type="number" min="1" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Ano</label>
                <div className="flex flex-wrap gap-4 text-red-800">
                  <label className="text-sm flex items-center gap-1">
                    <input type="checkbox" className="mr-1" />
                    6º Ano
                  </label>
                  <label className="text-sm flex items-center gap-1">
                    <input type="checkbox" className="mr-1" />
                    1º Ano
                  </label>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Portadores de necessidades especiais?</label>
                <div className="flex gap-6 text-red-800">
                  <label className="text-sm flex items-center gap-1 ">
                    <input type="radio" name="especial" className="mr-1" />
                    Sim
                  </label>
                  <label className="text-sm flex items-center gap-1">
                    <input type="radio" name="especial" className="mr-1" />
                    Não
                  </label>
                </div>
              </div>
            </div>

            <button className="bg-green-900 text-white px-6 py-2 rounded-md hover:bg-green-800 transition block mx-auto">
              Gravar
            </button>
          </section>

          {/* Botão de Geração de Ensalamento */}
          <div className="flex justify-center mb-10">
            <button className="bg-blue-900 text-white px-8 py-3 rounded-md hover:bg-blue-800 transition">
              Gerar Ensalamento
            </button>
          </div>

          {/* Grid de Salas Cadastradas */}
          <section className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 max-w-full mx-auto mb-10 overflow-x-auto">
            <h2 className="text-xl font-semibold text-blue-900 mb-6">Salas Cadastradas</h2>
            <table className="w-full text-sm border-collapse min-w-[600px]">
              <thead className="bg-gray-100 sticky top-0 text-blue-900">
                <tr>
                  <th className="p-3 border text-center">Cód</th>
                  <th className="p-3 border">Nome</th>
                  <th className="p-3 border text-center">Andar</th>
                  <th className="p-3 border text-center">Capacidade</th>
                  <th className="p-3 border text-center">Ano</th>
                  <th className="p-3 border text-center">Especial</th>
                  <th className="p-3 border text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {salasCadastradas.map((sala, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 text-black">
                    <td className="p-3 border text-center">{sala.cod}</td>
                    <td className="p-3 border">{sala.nome}</td>
                    <td className="p-3 border text-center">{sala.andar}</td>
                    <td className="p-3 border text-center">{sala.capacidade}</td>
                    <td className="p-3 border text-center">{sala.ano}</td>
                    <td className="p-3 border text-center">
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded-full ${
                          sala.especial === 'Sim'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {sala.especial}
                      </span>
                    </td>
                    <td className="p-3 border text-center space-x-2">
                      <button className="text-yellow-500 hover:text-yellow-600 transition-transform hover:scale-110">
                        <Pencil size={18} />
                      </button>
                      <button className="text-green-500 hover:text-green-600 transition-transform hover:scale-110">
                        <CheckCircle size={18} />
                      </button>
                      <button className="text-red-500 hover:text-red-600 transition-transform hover:scale-110">
                        <XCircle size={18} />
                      </button>
                      <button className="text-gray-500 hover:text-gray-700 transition-transform hover:scale-110">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Grid do Ensalamento */}
          <section className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 max-w-full mx-auto overflow-x-auto">
            <h2 className="text-xl font-semibold text-blue-900 mb-6">Resultado do Ensalamento</h2>
            <table className="w-full text-sm border-collapse min-w-[600px]">
              <thead className="bg-gray-100 text-blue-900">
                <tr>
                  <th className="p-3 border">Cód Sala</th>
                  <th className="p-3 border">Sala</th>
                  <th className="p-3 border">Participantes</th>
                  <th className="p-3 border">Ações</th>
                </tr>
              </thead>
              <tbody>
                {ensalamento.map((sala, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 text-black">
                    <td className="p-3 border text-center">{sala.cod}</td>
                    <td className="p-3 border">{sala.sala}</td>
                    <td className="p-3 border">{sala.participantes.join(', ')}</td>
                    <td className="p-3 border text-center space-x-2">
                      <button className="bg-red-700 text-white px-4 py-1 rounded hover:bg-red-600 transition">
                        Exportar PDF
                      </button>
                      <button className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-400 transition ml-2">
                        Exportar CSV
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
}