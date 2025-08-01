"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import api from "@/utils/api";
import { useQuery } from "react-query";
import DocumentForm from "./DocumentForm";
import DocumentCategoryForm from "./DocumentCategoryForm";

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
      <div className="w-full text-center">
        <h2 className="text-2xl font-bold">Upload de Arquivos</h2>
      </div>

      <DocumentCategoryForm />
      <DocumentForm />
    </div>
  );
};

export default UploadArquivos;
