'use client'

import { useState } from 'react'
import { useQuery } from 'react-query'
import api from '@/utils/api'

type HistoricoRelatorio = {
  id: number
  tipo: string
  data: string
  usuario: string
  dados: any
}

export default function Relatorios() {
  const [relatorioSelecionado, setRelatorioSelecionado] = useState<string>('')
  const [historico, setHistorico] = useState<HistoricoRelatorio[]>([])
  const usuarioLogado = 'ramon.dev'

  const { data, isLoading, error } = useQuery('dashboard', () =>
    api.get('/api/candidato/dashboard').then(res => res.data)
  )

  if (isLoading) return <div>Carregando relatórios...</div>
  if (error) return <div>Erro ao carregar dados de relatórios.</div>

  const relatoriosData: Record<string, { label: string; dados: any }> = {
    total: { label: 'Inscritos', dados: data.total },
    pagamentos6: { label: 'Pagamentos 6º Ano', dados: data.pagamentos['6'] },
    pagamentos1: { label: 'Pagamentos 1º Ano', dados: data.pagamentos['1'] },
    exames6: { label: 'Exames 6º Ano', dados: data.exames.find((e: any) => e.Seletivo === '6º ano') },
    exames1: { label: 'Exames 1º Ano', dados: data.exames.find((e: any) => e.Seletivo === '1º ano') },
    forcaSexo: { label: 'Classificados por Força e Sexo', dados: data.barrasForcaSexo }
  }

  function adicionarAoHistorico(key: string) {
    const rel = relatoriosData[key]
    const novo: HistoricoRelatorio = {
      id: Date.now(),
      tipo: rel.label,
      data: new Date().toLocaleString(),
      usuario: usuarioLogado,
      dados: rel.dados
    }
    setRelatorioSelecionado(key)
    setHistorico(prev => [novo, ...prev.slice(0, 4)])
  }

  function exportarJSON(dados: any, nome: string) {
    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = nome + '.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function exportarCSV(dados: any, nome: string) {
    let csv = ''
    if (Array.isArray(dados)) {
      const headers = Object.keys(dados[0])
      csv += headers.join(',') + '\n'
      dados.forEach((item: any) => {
        csv += headers.map(h => JSON.stringify(item[h] ?? '')).join(',') + '\n'
      })
    } else if (typeof dados === 'object') {
      csv += 'Chave,Valor\n'
      Object.entries(dados).forEach(([k, v]) => {
        csv += `${JSON.stringify(k)},${JSON.stringify(v)}\n`
      })
    } else {
      csv = String(dados)
    }
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = nome + '.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-900 mb-6">Relatórios</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {Object.entries(relatoriosData).map(([key, val]) => (
          <button
            key={key}
            onClick={() => adicionarAoHistorico(key)}
            className="bg-blue-600 text-white px-5 py-3 rounded hover:bg-blue-700 transition font-semibold"
          >
            {val.label}
          </button>
        ))}
      </div>
      {relatorioSelecionado && (
        <section className="bg-white p-6 rounded shadow mb-12">
          <h3 className="text-2xl font-semibold mb-4">{relatoriosData[relatorioSelecionado].label}</h3>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto mb-4 text-black">
            {JSON.stringify(relatoriosData[relatorioSelecionado].dados, null, 2)}
          </pre>
          <div className="flex gap-4">
            <button onClick={() => exportarJSON(relatoriosData[relatorioSelecionado].dados, relatoriosData[relatorioSelecionado].label)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
              JSON
            </button>
            <button onClick={() => exportarCSV(relatoriosData[relatorioSelecionado].dados, relatoriosData[relatorioSelecionado].label)} className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded">
              CSV
            </button>
          </div>
        </section>
      )}
      <section>
        <h3 className="text-xl font-bold mb-4 text-gray-700">Histórico de Relatórios (Últimos 5)</h3>
        {historico.length === 0 ? (
          <p className="text-gray-500">Nenhum relatório gerado ainda.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300 shadow rounded overflow-hidden">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Tipo</th>
                <th className="border px-4 py-2">Data</th>
                <th className="border px-4 py-2">Usuário</th>
                <th className="border px-4 py-2">JSON</th>
                <th className="border px-4 py-2">CSV</th>
              </tr>
            </thead>
            <tbody>
              {historico.map(item => (
                <tr key={item.id} className="hover:bg-gray-100">
                  <td className="border px-4 py-2 text-black">{item.id}</td>
                  <td className="border px-4 py-2 text-black">{item.tipo}</td>
                  <td className="border px-4 py-2 text-black">{item.data}</td>
                  <td className="border px-4 py-2 text-black">{item.usuario}</td>
                  <td className="border px-4 py-2 text-black text-center">
                    <button onClick={() => exportarJSON(item.dados, item.tipo)} className="text-green-700 hover:text-green-900">
                      JSON
                    </button>
                  </td>
                  <td className="border px-4 py-2 text-black text-center">
                    <button onClick={() => exportarCSV(item.dados, item.tipo)} className="text-yellow-700 hover:text-yellow-900">
                      CSV
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}