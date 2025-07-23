"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import api from "@/utils/api";
import { useQuery } from "react-query";

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

  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

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
    if (!arquivos.edital && !arquivos.cronograma && !arquivos.documentos) {
      setMensagem("Por favor, envie pelo menos um arquivo antes de salvar.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      if (arquivos.edital) {
        formData.append("EditalCaminho", arquivos.edital);
      }
      if (arquivos.cronograma) {
        formData.append("CronogramaCaminho", arquivos.cronograma);
      }
      if (arquivos.documentos) {
        formData.append("DocumentosCaminho", arquivos.documentos);
      }
      await api.put("api/arquivos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Arquivos salvos.");
      setMensagem("Arquivos salvos com sucesso!");
    } catch (error: any) {
      toast.error(error.response.data.error || error.response.data.message);
    }
    setLoading(false);
  };

  const fetchConfig = async () => {
    try {
      const response = await api.get("api/configuracao");
      const configuracao = response?.data;
      return configuracao;
    } catch (error) {
      // Não retorna nada pois é um fetch
    }
  };

  const { data: dataConfiguracao, isLoading: configLoading } = useQuery(
    ["configuracao"],
    fetchConfig,
    {
      retry: 5,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Upload de Arquivos</h2>

      {/* Edital */}
      <div>
        <h3 className="font-semibold">Edital 01</h3>
        <p className="text-sm text-gray-600">
          Contém todas as regras, critérios e informações oficiais do processo
          seletivo.
        </p>
        <input
          type="file"
          accept=".txt,.csv,.pdf"
          onChange={(e) => handleArquivoChange(e, "edital")}
          className="mt-2"
        />
        {arquivos.edital && (
          <p className="text-sm mt-1">
            Arquivo selecionado: {arquivos.edital.name}
          </p>
        )}
        {dataConfiguracao?.EditalCaminho && (
          <p className="text-sm mt-1">
            Arquivo atual: {dataConfiguracao?.EditalCaminho}
          </p>
        )}
      </div>

      {/* Cronograma */}
      <div>
        <h3 className="font-semibold">Cronograma</h3>
        <p className="text-sm text-gray-600">
          Lista todas as datas importantes: inscrição, provas, resultados e
          matrícula.
        </p>
        <input
          type="file"
          accept=".txt,.csv,.pdf"
          onChange={(e) => handleArquivoChange(e, "cronograma")}
          className="mt-2"
        />
        {arquivos.cronograma && (
          <p className="text-sm mt-1">
            Arquivo selecionado: {arquivos.cronograma.name}
          </p>
        )}
        {dataConfiguracao?.CronogramaCaminho && (
          <p className="text-sm mt-1">
            Arquivo atual: {dataConfiguracao?.CronogramaCaminho}
          </p>
        )}
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
        {arquivos.documentos && (
          <p className="text-sm mt-1">Arquivo: {arquivos.documentos.name}</p>
        )}
        {dataConfiguracao?.DocumentosCaminho && (
          <p className="text-sm mt-1">
            Arquivo atual: {dataConfiguracao?.DocumentosCaminho}
          </p>
        )}
      </div>

      {/* Botão de Salvar */}
      <div className="pt-4">
        <button
          onClick={handleSalvar}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {!loading ? "Salvar" : "Salvando..."}
        </button>
        {mensagem && <p className="mt-2 text-sm text-green-600">{mensagem}</p>}
      </div>
    </div>
  );
};

export default UploadArquivos;
