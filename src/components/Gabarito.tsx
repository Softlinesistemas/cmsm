'use client';

import { useState, useEffect, useContext } from "react";
import { useQuery } from "react-query";
import api from "@/utils/api";
import LoadingIcon from "./common/LoadingIcon";
import toast from "react-hot-toast";
import { useSession } from 'next-auth/react';
import moment from "moment-timezone";
import * as XLSX from 'xlsx';

const Gabarito = () => {
  const { data: session, status } = useSession();
  const [busca, setBusca] = useState('');
  const [processando, setProcessando] = useState(false);

  const { data: candidatosGabarito, isLoading, refetch } = useQuery(
    ['candidatosGabarito', busca],
    async () => {
      const response = await api.get(`api/candidato/gabarito?query=${busca}`);
      return response.data;
    }
  );

  const enviarGabarito = async (id: number) => {
    try {
      await api.put(`api/candidato/${id}`, { 
        RevisaoGabarito: "X", 
        CodUsuImportacao: session?.user.id, 
        CodUsuRev: session?.user.id, 
        DataRevisao: moment().tz('America/Sao_Paulo').format('YYYY-MM-DD'),
        NotaMatematica: 0,
        NotaPortugues: 0,
        NotaRedacao: "",
        Status: ""
      });
      toast.success(`Gabarito enviado para inscrição ${id}`);
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.error || error.response?.data?.message || 'Erro ao enviar');
    }
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProcessando(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: null });
      const promises = rows.map(row => {
        const id = row.cod_inscricao;
        return api.put(`api/candidato/${id}`, {
          RevisaoGabarito: "X",
          CodUsuImportacao: session?.user.id,
          CodUsuRev: session?.user.id,
          DataRevisao: moment().tz('America/Sao_Paulo').format('YYYY-MM-DD'),
          NotaMatematica: row.ac_mat ?? 0,
          NotaPortugues: row.ac_port ?? 0,
          NotaRedacao: row.nlp ?? 0,
          NotaEInterp: row.npo_ei ?? 0,
          Status: row.classificacao || ''
        });
      });
      await Promise.all(promises);
      toast.success('Envio em lote finalizado!');
      refetch();
    } catch (err) {
      console.error(err);
      toast.error('Falha no processamento do arquivo');
    } finally {
      setProcessando(false);
      // reset input
      (e.target as HTMLInputElement).value = '';
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-gray-300 shadow">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">Envio de Gabaritos</h2>

      {/* Busca */}
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Buscar por nome, CPF ou inscrição..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="flex-1 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      {/* Tabela de candidatos individuais */}
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded">
          <thead className="bg-blue-800 text-white">
            <tr>
              <th className="border px-2 py-1 text-xs md:text-sm">#</th>
              <th className="border px-2 py-1 text-xs md:text-sm">Inscrição</th>
              <th className="border px-2 py-1 text-xs md:text-sm">Nome</th>
              <th className="border px-2 py-1 text-xs md:text-sm">CPF</th>
              <th className="border px-2 py-1 text-xs md:text-sm">Série</th>
              <th className="border px-2 py-1 text-xs md:text-sm">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={7}><LoadingIcon /></td></tr>
            ) : candidatosGabarito?.length ? (
              candidatosGabarito.map((inscrito: any, idx: number) => (
                <tr key={inscrito.CodIns} className="hover:bg-blue-50 transition-colors text-black">
                  <td className="border px-2 py-1 text-xs md:text-sm">{idx + 1}</td>
                  <td className="border px-2 py-1 text-xs md:text-sm">{inscrito.CodIns}</td>
                  <td className="border px-2 py-1 text-xs md:text-sm">{inscrito.Nome}</td>
                  <td className="border px-2 py-1 text-xs md:text-sm">{inscrito.CPF}</td>
                  <td className="border px-2 py-1 text-xs md:text-sm">{inscrito.Seletivo}</td>
                  <td className="border px-2 py-1 text-xs md:text-sm">
                    <span
                      className={`px-2 py-1 rounded text-white text-xs ${inscrito.RevisaoGabarito === "X" ? 'bg-green-600' : 'bg-red-600'}`}
                    >
                      {inscrito.RevisaoGabarito === "X" ? 'Recebido' : 'Pendente'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-2 text-gray-500 text-sm">
                  Nenhum inscrito encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Upload em lote */}
      <div className="mt-6">
        <label htmlFor="upload-lote" className="text-blue-700 underline cursor-pointer text-sm">
          Selecionar arquivo de gabarito (Excel)
        </label>
        <input
          type="file"
          id="upload-lote"
          accept=".xlsx, .xls"
          className="hidden"
          onChange={handleFile}
        />
        <button
          onClick={() => document.getElementById('upload-lote')?.click()}
          disabled={processando}
          className={`ml-2 px-3 py-1 text-sm rounded text-white transition ${processando ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
        >
          {processando ? 'Processando...' : 'Enviar Lote'}
        </button>
      </div>
    </div>
  );
};

export default Gabarito;