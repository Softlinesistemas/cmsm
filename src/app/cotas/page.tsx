'use client'

import { useState } from 'react'
import FooterAdm from '@/components/FooterAdm'
import Header from '@/components/HeaderAdm'
import Sidebar from '@/components/Sidebar'
import { Pencil, CheckCircle, XCircle, Trash2 } from 'lucide-react'
import api from '@/utils/api'
import { useQuery, useQueryClient } from 'react-query'
import toast from 'react-hot-toast'

export default function CotasPage() {
  const queryClient = useQueryClient()

  const [novaDescricao, setNovaDescricao] = useState('')
  const [cotaEditando, setCotaEditando] = useState<any | null>(null)
  const [descricaoEdit, setDescricaoEdit] = useState('')
  const [statusEdit, setStatusEdit] = useState('Ativo')

  const { data: cotas, isLoading, refetch } = useQuery('cotas', async () => {
    const response = await api.get('api/cotas')
    return response.data
  })

  const inserirCota = async () => {
    if (!novaDescricao.trim()) return
    try {    
      const response = await api.post('api/cotas', {
        Descricao: novaDescricao,
        Status: 'Ativo',
      })
      toast.success(response.data.message)
      refetch();
    } catch (error: any) {
      toast.error(error.response.data.error || error.response.data.message)
    }
    setNovaDescricao('')
    queryClient.invalidateQueries('cotas')
  }

  // Função para abrir modal de edição
  const abrirModalEdicao = (cota: any) => {
    setCotaEditando(cota)
    setDescricaoEdit(cota.Descricao)
    setStatusEdit(cota.Status)
  }

  const salvarEdicao = async () => {
    if (!descricaoEdit.trim()) return
    try {      
      const response = await api.put(`api/cotas/${cotaEditando.id}`, {
        Descricao: descricaoEdit,
        Status: statusEdit,
      })
      toast.success(response.data.message)
      refetch();
    } catch (error: any) {
      toast.error(error.response.data.error || error.response.data.message)    
    }
    setCotaEditando(null)
    queryClient.invalidateQueries('cotas')
  }

  const alterarStatus = async (id: number, novoStatus: string) => {
    try {    
      const response = await api.put(`api/cotas/${id}`, { Status: novoStatus })
      toast.success(response.data.message);
      refetch();
    } catch (error: any) {
      toast.error(error.response.data.error || error.response.data.message)
    }
    queryClient.invalidateQueries('cotas')
  }

  const removerCota = async (id: number) => {
    try {
      const response = await api.delete(`api/cotas/${id}`);
      toast.success(response.data.message);
      refetch();
    } catch (error: any) {
      toast.error(error.response.data.error || error.response.data.message);
    }
    queryClient.invalidateQueries('cotas')
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <Header />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-blue-900 text-center mb-6">COTAS</h1>

          {/* Formulário nova cota */}
          <div className="max-w-4xl mx-auto flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Insira o nome da cota"
              className="flex-1 border rounded px-3 py-2"
              value={novaDescricao}
              onChange={(e) => setNovaDescricao(e.target.value)}
            />
            <button
              className="bg-green-900 text-white px-4 py-2 rounded"
              onClick={inserirCota}
            >
              INSERIR
            </button>
          </div>

          {/* Lista de cotas */}
          <div className="bg-white p-6 rounded shadow-md max-w-4xl mx-auto">
            {isLoading ? (
              <p>Carregando cotas...</p>
            ) : !isLoading && !cotas.length ?
              <p>Não foi encontrado cotas.</p>
            : (
              <table className="w-full table-auto text-sm text-black">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-2 border">COD.</th>
                    <th className="p-2 border">DESCRIÇÃO</th>
                    <th className="p-2 border">STATUS</th>
                    <th className="p-2 border">AÇÕES</th>
                  </tr>
                </thead>
                <tbody>
                  {cotas?.map((cota: any) => (
                    <tr key={cota.id}>
                      <td className="p-2 border text-center">{cota.id}</td>
                      <td className="p-2 border">{cota.Descricao}</td>
                      <td className="p-2 border text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            cota.Status === 'Ativo'
                              ? 'bg-green-200 text-green-800'
                              : 'bg-red-200 text-red-800'
                          }`}
                        >
                          {cota.Status}
                        </span>
                      </td>
                      <td className="p-2 border text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            title="Editar cota"
                            className="text-yellow-500 hover:text-yellow-600 hover:scale-110 transition-transform"
                            onClick={() => abrirModalEdicao(cota)}
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            title="Ativar"
                            className="text-green-500 hover:text-green-600 hover:scale-110 transition-transform"
                            onClick={() => alterarStatus(cota.id, 'Ativo')}
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button
                            title="Desativar"
                            className="text-red-500 hover:text-red-600 hover:scale-110 transition-transform"
                            onClick={() => alterarStatus(cota.id, 'Inativo')}
                          >
                            <XCircle size={18} />
                          </button>
                          <button
                            title="Remover"
                            className="text-gray-500 hover:text-gray-700 hover:scale-110 transition-transform"
                            onClick={() => removerCota(cota.id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>

      <FooterAdm />

      {/* Modal de edição */}
      {cotaEditando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-blue-900">Editar Cota</h2>

            <div className="mb-4">
              <label className="block text-sm mb-1 text-gray-700">Descrição</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={descricaoEdit}
                onChange={(e) => setDescricaoEdit(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1 text-gray-700">Status</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={statusEdit}
                onChange={(e) => setStatusEdit(e.target.value)}
              >
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                onClick={() => setCotaEditando(null)}
              >
                Cancelar
              </button>
              <button
                className="bg-blue-900 text-white px-4 py-2 rounded"
                onClick={salvarEdicao}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
