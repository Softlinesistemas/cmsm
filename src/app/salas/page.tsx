'use client'

import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/HeaderAdm';
import { Pencil, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { useState, useEffect, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '@/utils/api';
import toast from 'react-hot-toast';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { unparse as jsonToCSV } from "papaparse";

export default function SalasPage() {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    CodSala: '',
    Sala: '',
    QtdCadeiras: '',
    Predio: '',
    Andar: '',
    PortadorNec: '',
    Turma: '6º Ano',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: salas = [], isLoading, refetch } = useQuery('salas', async () => {
    const res = await api.get('api/sala');
    return res.data.salas;
  });

  const { data: ensalamento = [], isLoading: loadingEnsalamento } = useQuery(
    'ensalamento',
    async () => {
      const res = await api.get('api/sala/ensalamento');
      return res.data;
    }
  );

  const saveMut = useMutation(
    async () => {
      const payload = {
        CodSala: Number(form.CodSala),
        Sala: form.Sala,
        QtdCadeiras: Number(form.QtdCadeiras),
        Predio: form.Predio || null,
        Andar: form.Andar || null,
        PortadorNec: form.PortadorNec,
        Turma: form.Turma,
      };
      if (editingId) {
        await api.put(`api/sala/${editingId}`, payload);
      } else {
        await api.post('api/sala', payload);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('salas');
        toast.success("Lista de salas atualizada.");
        resetForm();
      },
    }
  );

  const gerarMut = useMutation(
    () => api.post('api/sala/ensalamento'),
    { onSuccess: () => {
        queryClient.invalidateQueries('ensalamento');
        toast.success('Ensalamento gerado com sucesso.');
      }
    }
  );

  const deleteMut = useMutation(
    async (id: number) => api.delete(`api/sala/${id}`),
    { onSuccess: () => {
      queryClient.invalidateQueries('salas')
      toast.success("Sala excluída");
    } }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = () => saveMut.mutate();

  const handleEdit = (s: any) => {
    setEditingId(String(s.CodSala));
    setForm({
      CodSala: String(s.CodSala),
      Sala: s.Sala,
      QtdCadeiras: String(s.QtdCadeiras),
      Predio: s.Predio || '',
      Andar: s.Andar || '',
      PortadorNec: s.PortadorNec || 'N',
      Turma: s.Turma || '',
    });
  };

  const alterarStatus = async (id: number, novoStatus: string) => {
    try {    
      const response = await api.put(`api/sala/${id}`, { Status: novoStatus })
      toast.success(response.data.message);
      refetch();
    } catch (error: any) {
      toast.error(error.response.data.error || error.response.data.message)
    }
    queryClient.invalidateQueries('cotas')
  }

  const handleDelete = (id: number) => {
    if (confirm('Confirmar exclusão da sala?')) deleteMut.mutate(id);
  };

  const resetForm = () => {
    setForm({ CodSala: '', Sala: '', QtdCadeiras: '', Predio: '', Andar: '', PortadorNec: 'N', Turma: '' });
    setEditingId(null);
  };

  function exportToPDF(sala: string, participantes: any[], codSala: number) {
    const doc = new jsPDF({ unit: "pt", format: "A4" });

    doc.setFontSize(16);
    doc.text(`Ensalamento - Sala ${sala} (Cód: ${codSala})`, 40, 40);

    const columns = [
      { header: "Nome", dataKey: "Nome" },
      { header: "CPF", dataKey: "CPF" },
      { header: "Sexo", dataKey: "Sexo" },
      { header: "Email", dataKey: "Email" },
      { header: "Cidade", dataKey: "Cidade" },
      { header: "UF", dataKey: "UF" },
    ];

    const rows = participantes.map((p: any) => ({
      Nome: p.Nome,
      CPF: p.CPF,
      Sexo: p.Sexo,
      Email: p.Email,
      Cidade: p.Cidade,
      UF: p.UF,
    }));

    autoTable(doc, {
      startY: 60,
      columns,
      body: rows,
      headStyles: { fillColor: [0, 102, 204] },
    });

    doc.save(`sala_${codSala}_participantes.pdf`);
  }

  function exportToCSV(sala: string, participantes: any[], codSala: number) {
    const rows = participantes.map((p: any) => ({
      CodIns: p.CodIns,
      Nome: p.Nome,
      Seletivo: p.Seletivo,
      DataCad: p.DataCad,
      HoraCad: p.HoraCad,
      CPF: p.CPF,
      Nasc: p.Nasc,
      Sexo: p.Sexo,
      Email: p.Email,
      Cep: p.Cep,
      Endereco: p.Endereco,
      Complemento: p.Complemento,
      Bairro: p.Bairro,
      Cidade: p.Cidade,
      UF: p.UF,
      CodCot1: p.CodCot1,
      CodCot2: p.CodCot2,
      CodCot3: p.CodCot3,
      CodCot4: p.CodCot4,
      CodCot5: p.CodCot5,
      CodCot6: p.CodCot6,
      CodCot7: p.CodCot7,
      CodCot8: p.CodCot8,
      CodCot9: p.CodCot9,
      CodCot10: p.CodCot10,
      PortadorNec: p.PortadorNec,
      AtendimentoEsp: p.AtendimentoEsp,
      Responsavel: p.Responsavel,
      CPFResp: p.CPFResp,
      NascResp: p.NascResp,
      SexoResp: p.SexoResp,
      CepResp: p.CepResp,
      EnderecoResp: p.EnderecoResp,
      ComplementoResp: p.ComplementoResp,
      BairroResp: p.BairroResp,
      CidadeResp: p.CidadeResp,
      UFResp: p.UFResp,
      ProfissaoResp: p.ProfissaoResp,
      EmailResp: p.EmailResp,
      TelResp: p.TelResp,
      Parentesco: p.Parentesco,
      PertenceFA: p.PertenceFA,
      CaminhoFoto: p.CaminhoFoto,
      CaminhoDoc1: p.CaminhoDoc1,
      CaminhoDoc2: p.CaminhoDoc2,
      RegistroGRU: p.RegistroGRU,
      GRUData: p.GRUData,
      GRUValor: p.GRUValor,
      GRUHora: p.GRUHora,
      CodSala: p.CodSala,
      DataEnsalamento: p.DataEnsalamento,
      HoraEnsalamento: p.HoraEnsalamento,
      CodUsuEnsalamento: p.CodUsuEnsalamento,
      Status: p.Status,
      CaminhoResposta: p.CaminhoResposta,
      CaminhoRedacao: p.CaminhoRedacao,
      RevisaoGabarito: p.RevisaoGabarito,
      DataImportacao: p.DataImportacao,
      HoraImportacao: p.HoraImportacao,
      CodUsuImportacao: p.CodUsuImportacao,
      NotaMatematica: p.NotaMatematica,
      NotaPortugues: p.NotaPortugues,
      NotaRedacao: p.NotaRedacao,
      DataRevisao: p.DataRevisao,
      CodUsuRev: p.CodUsuRev
    }));

    const csv = jsonToCSV(rows, {
      delimiter: ";",
      header: true,
      skipEmptyLines: true
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `sala_${codSala}_participantes.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 overflow-auto min-w-0">
          <h1 className="text-3xl font-bold text-blue-900 text-center mb-8">SALAS</h1>

          {/* Cadastro de Salas */}
          <section className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 max-w-full mx-auto mb-8">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">Cadastro de Salas</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-700">Nome ou número da sala</label>
                <input
                  name="Sala"
                  value={form.Sala}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Andar</label>
                <input
                  name="Andar"
                  value={form.Andar}
                  onChange={handleChange}
                  disabled={!!editingId}
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Capacidade</label>
                <input
                  name="QtdCadeiras"
                  type="number"
                  min="1"
                  value={form.QtdCadeiras}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Ano</label>
                <div className="flex flex-wrap gap-4 text-red-800">
                  <label className="text-sm flex items-center gap-1">
                    <input
                      type="checkbox"
                      className="mr-1"
                      checked={form.Turma === '6º Ano'}
                      onChange={() => setForm((f) => ({ ...f, Turma: f.Turma === '6º Ano' ? '' : '6º Ano' }))}
                    />
                    6º Ano
                  </label>
                  <label className="text-sm flex items-center gap-1">
                    <input
                      type="checkbox"
                      className="mr-1"
                      checked={form.Turma === '1º Ano'}
                      onChange={() => setForm((f) => ({ ...f, Turma: f.Turma === '1º Ano' ? '' : '1º Ano' }))}
                    />
                    1º Ano
                  </label>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Portadores de necessidades especiais?</label>
                <div className="flex gap-6 text-red-800">
                  <label className="text-sm flex items-center gap-1">
                    <input
                      type="radio"
                      name="PortadorNec"
                      className="mr-1"
                      value="X"
                      checked={form.PortadorNec === 'X'}
                      onChange={handleChange}
                    />
                    Sim
                  </label>
                  <label className="text-sm flex items-center gap-1">
                    <input
                      type="radio"
                      name="PortadorNec"
                      className="mr-1"
                      value=""
                      checked={form.PortadorNec === ''}
                      onChange={handleChange}
                    />
                    Não
                  </label>
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="bg-green-900 text-white px-6 py-2 rounded-md hover:bg-green-800 transition block mx-auto"
            >
              {editingId ? 'Atualizar' : 'Gravar'}
            </button>
          </section>

          {/* Grid de Salas Cadastradas */}
          <section className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 max-w-full mx-auto mb-10 overflow-x-auto">
            <h2 className="text-xl font-semibold text-blue-900 mb-6">Salas Cadastradas</h2>
            <table className="w-full text-sm border-collapse min-w-[600px]">
              <thead className="bg-gray-100 sticky top-0 text-blue-900">
                <tr>
                  {/* <th className="p-3 border text-center">Cód</th> */}
                  <th className="p-3 border">Nome</th>
                  <th className="p-3 border text-center">Andar</th>
                  <th className="p-3 border text-center">Capacidade</th>
                  <th className="p-3 border text-center">Ano</th>
                  <th className="p-3 border text-center">Especial</th>
                  <th className="p-3 border text-center">Status</th>
                  <th className="p-3 border text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={7} className="p-3 text-center">Carregando...</td></tr>
                ) : (
                  salas.map((s: any, idx: number) => (
                    <tr key={idx} className="hover:bg-gray-50 text-black">
                      {/* <td className="p-3 border text-center">{s.CodSala}</td> */}
                      <td className="p-3 border">{s.Sala}</td>
                      <td className="p-3 border text-center">{s.Andar}</td>
                      <td className={`p-3 border text-center ${s.cadeirasOcupadas >= s.QtdCadeiras ? "text-red-600" : ""}`}>{s.cadeirasOcupadas}/{s.QtdCadeiras}</td>
                      <td className="p-3 border text-center">{s.Turma}</td>
                      <td className="p-3 border text-center">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          s.PortadorNec === 'X' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {s.PortadorNec === 'X' ? 'Sim' : 'Não'}
                        </span>
                      </td>   
                      <td className="p-3 border text-center">
                         <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          s.Status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {s.Status === 'Inativo' ? 'Inativo' : 'Ativo'}
                        </span>
                      </td>   
                      <td className="p-3 border text-center space-x-2">
                        <button onClick={() => handleEdit(s)} className="text-yellow-500 hover:text-yellow-600 transition-transform hover:scale-110">
                          <Pencil size={18} />
                        </button>
                        <button onClick={() => alterarStatus(s.CodSala, "Ativo")} className="text-green-500 hover:text-green-600 transition-transform hover:scale-110">
                          <CheckCircle size={18} />
                        </button>
                        <button onClick={() => alterarStatus(s.CodSala, "Inativo")} className="text-red-500 hover:text-red-600 transition-transform hover:scale-110">
                          <XCircle size={18} />
                        </button>
                        <button onClick={() => handleDelete(s.CodSala)} className="text-gray-500 hover:text-gray-700 transition-transform hover:scale-110">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>

          {/* Botão de Geração de Ensalamento */}
          <div className="flex justify-center mb-10">
            <button
              onClick={() => gerarMut.mutate()}
              disabled={gerarMut.isLoading}
              className="bg-blue-900 text-white px-8 py-3 rounded-md hover:bg-blue-800 transition disabled:opacity-50"
            >
              {gerarMut.isLoading ? 'Gerando...' : 'Gerar Ensalamento'}
            </button>
          </div>

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
                {ensalamento?.map((item: any, idx: number) => (
                  <tr key={idx} className="hover:bg-gray-50 text-black">
                    <td className="p-3 border text-center">{item.cod}</td>
                    <td className="p-3 border">{item.sala}</td>
                    <td className="p-3 border">
                      {item.participantes.map((p: any) => p.Nome).join(', ')}
                    </td>
                    <td className="p-3 border text-center space-x-2">
                      <button
                        className="bg-red-700 text-white px-4 py-1 rounded hover:bg-red-600 transition"
                        onClick={() => exportToPDF(item.sala, item.participantes, item.cod)}
                      >
                        Exportar PDF
                      </button>
                      <button
                        className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-400 transition ml-2"
                        onClick={() => exportToCSV(item.sala, item.participantes, item.cod)}
                      >
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
