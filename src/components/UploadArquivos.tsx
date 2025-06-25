'use client'

import { useState } from "react";

const UploadArquivos = () => {
  const [arquivos, setArquivos] = useState<{
    edital: File | null;
    cronograma: File | null;
    documentos: File | null;
  }>({
    edital: null,
    cronograma: null,
    documentos: null,
  });

  const [mensagem, setMensagem] = useState('');

  const handleArquivoChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    tipo: "edital" | "cronograma" | "documentos"
  ) => {
    if (e.target.files && e.target.files[0]) {
      setArquivos((prev) => ({
        ...prev,
        [tipo]: e.target.files![0],
      }));
    }
  };

  const handleSalvar = async () => {
    if (!arquivos.edital || !arquivos.cronograma || !arquivos.documentos) {
      setMensagem('Por favor, envie todos os arquivos antes de salvar.');
      return;
    }

    console.log("Arquivos para enviar:", arquivos);
    setMensagem('Arquivos salvos com sucesso!');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Upload de Arquivos</h2>

      {/* Edital */}
      <div>
        <h3 className="font-semibold">Edital 01</h3>
        <p className="text-sm text-gray-600">
          Contém todas as regras, critérios e informações oficiais do processo seletivo.
        </p>
        <input
          type="file"
          accept=".txt,.csv,.pdf"
          onChange={(e) => handleArquivoChange(e, "edital")}
          className="mt-2"
        />
        {arquivos.edital && <p className="text-sm mt-1">Arquivo: {arquivos.edital.name}</p>}
      </div>

      {/* Cronograma */}
      <div>
        <h3 className="font-semibold">Cronograma</h3>
        <p className="text-sm text-gray-600">
          Lista todas as datas importantes: inscrição, provas, resultados e matrícula.
        </p>
        <input
          type="file"
          accept=".txt,.csv,.pdf"
          onChange={(e) => handleArquivoChange(e, "cronograma")}
          className="mt-2"
        />
        {arquivos.cronograma && <p className="text-sm mt-1">Arquivo: {arquivos.cronograma.name}</p>}
      </div>

      {/* Documentos */}
      <div>
        <h3 className="font-semibold">Documentos</h3>
        <p className="text-sm text-gray-600">
          Documentação obrigatória para inscrição e matrícula dos candidatos.
        </p>
        <input
          type="file"
          accept=".txt,.csv,.pdf"
          onChange={(e) => handleArquivoChange(e, "documentos")}
          className="mt-2"
        />
        {arquivos.documentos && <p className="text-sm mt-1">Arquivo: {arquivos.documentos.name}</p>}
      </div>

      {/* Botão de Salvar */}
      <div className="pt-4">
        <button
          onClick={handleSalvar}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Salvar
        </button>
        {mensagem && (
          <p className="mt-2 text-sm text-green-600">{mensagem}</p>
        )}
      </div>
    </div>
  );
};

export default UploadArquivos;
