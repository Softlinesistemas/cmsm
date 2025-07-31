"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/HeaderAdm";
import Footer from "@/components/FooterAdm";
import api from "@/utils/api";
import { Save, LoaderIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { useSession } from "next-auth/react";

export default function Configuracoes() {
  const { data: session } = useSession();
  const [processoSel, setProcessoSel] = useState(
    "Processo Seletivo de Admissão ao CMSM 2025/2026"
  );
  const [valInscricao, setValInscricao] = useState("0,00");

  const [dataIniEF, setDataIniEF] = useState("");
  const [horaIniEF, setHoraIniEF] = useState("");
  const [dataFimEF, setDataFimEF] = useState("");
  const [horaFimEF, setHoraFimEF] = useState("23:59");

  const [nascIniEM, setNascIniEM] = useState("");
  const [nascFimEM, setNascFimEM] = useState("");
  const [nascIniEF, setNascIniEF] = useState("");
  const [nascFimEF, setNascFimEF] = useState("");

  const [vagasEF, setVagasEF] = useState<number | null>(null);
  const [vagasEM, setVagasEM] = useState<number | null>(null);

  function formatarValor(valor: string) {
    let valorNumerico = valor.replace(/\D/g, "");
    valorNumerico = (parseInt(valorNumerico, 10) / 100).toFixed(2);
    return valorNumerico.toString().replace(".", ",");
  }

  function handleChangeCurrency(e: any) {
    const valorInput = e.target.value;

    const valorFormatado = formatarValor(valorInput);
    setValInscricao(valorFormatado !== "NaN" ? valorFormatado : "0");
  }

  const handleSendNewConfig = async () => {
    try {
      const payload = {
        ProcessoSel: processoSel,
        ValInscricao: parseFloat(valInscricao.replace(",", ".")),
        GRUDataFim: dataFimEF,
        GRUHoraFim: horaFimEF,
        DataIniEF: dataIniEF,
        HoraIniEF: horaIniEF,
        HoraFimEF: horaFimEF,
        NascIniEM: nascIniEM,
        NascFimEM: nascFimEM,
        NascIniEF: nascIniEF,
        NascFimEF: nascFimEF,
        VagasEF: vagasEF,
        VagasEM: vagasEM,
      };

      await api.post("api/configuracao", payload);
      toast.success("Configurações salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao gravar configurações", error);
      toast.error("Erro ao gravar configurações");
    }
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

  const { data, isLoading: configLoading } = useQuery(
    ["configuracao"],
    fetchConfig,
    {
      retry: 5,
      refetchOnWindowFocus: false,
    }
  );

  function formatDateForInput(dateString: string | null | undefined) {
    if (!dateString) return "";
    return dateString.split("T")[0]; // Pega só "YYYY-MM-DD"
  }

  useEffect(() => {
    if (data) {
      setProcessoSel(data.ProcessoSel || processoSel);
      setValInscricao(
        data.ValInscricao != null
          ? formatarValor((data.ValInscricao * 100).toString())
          : valInscricao
      );

      setNascIniEF(formatDateForInput(data.NascIniEF));
      setNascFimEF(formatDateForInput(data.NascFimEF));
      setNascIniEM(formatDateForInput(data.NascIniEM));
      setNascFimEM(formatDateForInput(data.NascFimEM));

      setDataIniEF(formatDateForInput(data.DataIniEF));
      setHoraIniEF(data.HoraIniEF || "");
      setHoraFimEF(data.HoraFimEF || "");

      setDataFimEF(formatDateForInput(data.GRUDataFim));
      setHoraFimEF(data.GRUHoraFim || "");
      setVagasEF(data.VagasEF);
      setVagasEM(data.VagasEM);

      // Se usar essas notas mínimas
      // setNotaMinMat(data.NotaMinMat ?? '');
      // setNotaMinPor(data.NotaMinPor ?? '');
    }
  }, [data]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-10">
            CONFIGURAÇÕES
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Processo Seletivo */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                INSIRA O NOME DO PROCESSO SELETIVO
              </label>
              <input
                type="text"
                value={processoSel}
                onChange={(e) => setProcessoSel(e.target.value)}
                className="w-full border px-4 py-2 rounded"
              />
            </div>

            {/* Valor da Inscrição */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                INSIRA O VALOR DA INSCRIÇÃO
              </label>
              <div className="flex items-center border rounded">
                <span className="bg-green-700 text-white px-4 py-2 font-semibold">
                  R$
                </span>
                <input
                  type="text"
                  value={valInscricao}
                  onChange={handleChangeCurrency}
                  className="w-full px-4 py-2"
                />
              </div>
            </div>

            {/* Tempo de Inscrições */}
            <div className="bg-white p-6 rounded-xl shadow-md col-span-1 md:col-span-2">
              <label className="block font-semibold text-gray-700 mb-3">
                CONFIGURAR TEMPO DE INSCRIÇÕES
              </label>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-sm text-gray-600 mb-1 block">
                    Data e Hora Inicial
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      className="border rounded px-3 py-2 w-1/2"
                      value={dataIniEF}
                      onChange={(e) => setDataIniEF(e.target.value)}
                    />
                    <input
                      type="time"
                      className="border rounded px-3 py-2 w-1/2"
                      value={horaIniEF}
                      onChange={(e) => setHoraIniEF(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="text-sm text-gray-600 mb-1 block">
                    Data e Hora Final
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      className="border rounded px-3 py-2 w-1/2"
                      value={dataFimEF}
                      onChange={(e) => setDataFimEF(e.target.value)}
                    />
                    <input
                      type="time"
                      className="border rounded px-3 py-2 w-1/2 bg-gray-100 text-gray-500 cursor-not-allowed"
                      value="23:59:59"
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Datas de Nascimento */}
            <div className="bg-white p-6 rounded-xl shadow-md col-span-1 md:col-span-2">
              <label className="block font-semibold text-gray-700 mb-4">
                CONFIGURAR DATA DE NASCIMENTO
              </label>

              <div className="mb-6">
                <div className="text-sm font-medium text-gray-600 mb-1">
                  6° ANO
                </div>
                <div className="flex gap-4">
                  <input
                    type="date"
                    className="border px-3 py-2 rounded w-full"
                    value={nascIniEF}
                    onChange={(e) => setNascIniEF(e.target.value)}
                  />
                  <input
                    type="date"
                    className="border px-3 py-2 rounded w-full"
                    value={nascFimEF}
                    onChange={(e) => setNascFimEF(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">
                  1° ANO
                </div>
                <div className="flex gap-4">
                  <input
                    type="date"
                    className="border px-3 py-2 rounded w-full"
                    value={nascIniEM}
                    onChange={(e) => setNascIniEM(e.target.value)}
                  />
                  <input
                    type="date"
                    className="border px-3 py-2 rounded w-full"
                    value={nascFimEM}
                    onChange={(e) => setNascFimEM(e.target.value)}
                  />
                </div>
              </div>
            </div>
            {/* Vagas Disponíveis*/}
            <div className="bg-white p-6 rounded-xl shadow-md col-span-1 md:col-span-2">
              <label className="block font-semibold text-gray-700 mb-4">
                CONFIGURAR NÚMERO DE VAGAS
              </label>
              <div className="flex gap-4 w-full">
                <div className="mb-6 w-1/2">
                  <div className="text-sm font-medium text-gray-600 mb-1">
                    6° ANO
                  </div>
                  <div className="">
                    <input
                      type="number"
                      className="border px-3 py-2 rounded w-full"
                      value={vagasEF || 0}
                      onChange={(e) => setVagasEF(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="w-1/2">
                  <div className="text-sm font-medium text-gray-600 mb-1">
                    1° ANO
                  </div>
                  <div className="">
                    <input
                      type="number"
                      className="border px-3 py-2 rounded w-full"
                      value={vagasEM || 0}
                      onChange={(e) => setVagasEM(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botão Gravar */}
          <div className="flex justify-center mt-10">
            <button
              onClick={handleSendNewConfig}
              disabled={configLoading}
              className="bg-green-900 text-white font-semibold px-10 py-3 rounded-lg flex items-center gap-2 hover:bg-green-800 hover:scale-105 transition shadow-md"
            >
              {configLoading ? <LoaderIcon size={18} /> : <Save size={18} />}
              GRAVAR
            </button>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
