"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { useRouter } from "next/navigation";
import { useEditais } from "@/context/EditalContext";
import { useQuery } from "react-query";
import api from "@/utils/api";
import moment from "moment-timezone";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import CategoriasAccordion from "@/components/CategoriasAccordion";

interface Doc {
  CodDoc: number;
  DocNome: string;
  DocCaminho: string;
  DocCategoria: number;
}
interface Categoria {
  CodCategoria: number;
  CategoriaNome: string;
  CategoriaCor: string;
  CategoriaDescricao: string;
  docs: Doc[];
}

export default function Home() {
  const router = useRouter();
  const { editais } = useEditais();
  const { data: session, status } = useSession();

  const handleGovLogin = async () => {
    await signIn("govbr", { callbackUrl: "/acompanhamento" });
  };

  const {
    data: categorias = [],
    isLoading,
    isError,
  } = useQuery<Categoria[]>("docs", async () => {
    const res = await fetch("/api/arquivos/docs");
    if (!res.ok) throw new Error("Erro ao carregar dados");
    return res.json();
  });

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

  const ajustaFuso = (dataStr: string) => {
    return moment.utc(dataStr).add(3, "hours").format("DD/MM/YYYY");
  };

  const prazoTerminou = dataConfiguracao
    ? moment
        .utc(dataConfiguracao.GRUDataFim)
        .tz("America/Sao_Paulo")
        .isBefore(moment.tz("America/Sao_Paulo"))
    : true;

  const prazoNaoComecou = dataConfiguracao
    ? moment
        .utc(dataConfiguracao.DataIniEF)
        .tz("America/Sao_Paulo")
        .isAfter(moment.tz("America/Sao_Paulo"))
    : true;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-grow px-4 py-12">
        <h2 className="text-center text-blue-900 font-semibold uppercase text-md sm:text-md mb-12">
          PROCESSO SELETIVO DE ADMISSÃO AO CMSM 2025/2026
        </h2>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-300">
          <div className="px-6 py-4 flex flex-col items-center">
            <h3 className="font-bold text-lg text-red-900 mb-4">Vagas</h3>
            <div className="space-y-3 w-full">
              {dataConfiguracao?.VagasEF && (
                <div className="mx-auto flex items-center justify-between bg-gray-200 rounded-full px-4 py-2 w-40">
                  <span className="text-sm text-blue-700 text-bold">
                    6° ano
                  </span>
                  <span className="text-sm font-bold text-green-800">
                    {dataConfiguracao?.VagasEF} vagas
                  </span>
                </div>
              )}
              {dataConfiguracao?.VagasEM && (
                <div className="mx-auto flex items-center justify-between bg-gray-200 rounded-full px-4 py-2 w-40">
                  <span className="text-sm text-blue-700 text-bold">
                    1° ano
                  </span>
                  <span className="text-sm font-bold text-green-800">
                    {dataConfiguracao?.VagasEM} vagas
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="px-6 py-4 flex flex-col items-center">
            <h3 className="font-bold text-lg text-red-900 mb-4">
              Período de inscrição
            </h3>
            {dataConfiguracao && (
              <p className="text-green-900 font-semibold text-lg">
                {ajustaFuso(dataConfiguracao?.DataIniEF)}{" "}
                <span className="mx-2">à</span>{" "}
                {ajustaFuso(dataConfiguracao?.GRUDataFim)}
              </p>
            )}
          </div>

          <div className="px-6 py-4 flex flex-col items-center">
            <h3 className="font-bold text-lg text-red-900 mb-4">Inscrições</h3>
            {dataConfiguracao && prazoNaoComecou ? (
              <p className="mb-3 text-sm text-yellow-600 font-bold">
                Inscrição ainda não disponível
              </p>
            ) : dataConfiguracao && !prazoTerminou ? (
              <p className="mb-3 text-sm text-green-900">Fazer inscrição</p>
            ) : (
              dataConfiguracao && (
                <p className="mb-3 text-sm text-red-900 font-bold">
                  Inscrição indisponível
                </p>
              )
            )}
            {!prazoNaoComecou ||
              (process.env.NEXT_PUBLIC_PREVIEW_ENV === "homologacao" && (
                <button
                  onClick={handleGovLogin}
                  className="flex items-center space-x-2 bg-white border border-gray-300 rounded px-4 py-2 hover:scale-105 transition-transform"
                >
                  <img
                    src="https://www.gov.br/++theme++padrao_govbr/img/govbr-colorido-b.png"
                    alt="gov.br"
                    className="h-6"
                  />
                  <span className="text-gray-700 font-medium">
                    Entrar com gov.br
                  </span>
                </button>
              ))}
            <div className="w-full">
              {/* <Link href={status !== "authenticated" ? "/formulario" : session?.user?.admin ? "/dashboard" :"/acompanhamento"} className='mt-1 text-sm text-blue-500 hover:underline hover:text-blue-700 cursor-pointer'>Pular etapa (provisório)</Link> */}
            </div>
          </div>
        </div>

        <CategoriasAccordion categorias={categorias} />
      </main>

      <Footer />
    </div>
  );
}
