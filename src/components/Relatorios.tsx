'use client'

import { useState } from 'react'

// Tipo para o histórico de relatórios
type HistoricoRelatorio = {
  id: number
  tipo: string
  data: string
  usuario: string
  dados: any // para exportar o dado exato do relatório
}

// Dados fixos dos relatórios disponíveis
const relatoriosData = {
  total: { label: 'Total de Inscritos', dados: 1257 },
  pagamentos6: { label: 'Pagamentos 6º Ano', dados: { pagos: 800, pendentes: 57 } },
  pagamentos1: { label: 'Pagamentos 1º Ano', dados: { pagos: 374, pendentes: 26 } },
  exames6: { label: 'Exames 6º Ano', dados: { aprovados: 600, reprovados: 57, ausentes: 10 } },
  exames1: { label: 'Exames 1º Ano', dados: { aprovados: 500, reprovados: 50, ausentes: 5 } },
  forcaSexo: {
    label: 'Classificados por Força e Sexo',
    dados: [
      { forca: 'Exército', masculino: 1200, feminino: 600 },
      { forca: 'Marinha', masculino: 700, feminino: 300 },
    ],
  },
}

export default function Relatorios() {
  // Estado do relatório selecionado
  const [relatorioSelecionado, setRelatorioSelecionado] = useState<keyof typeof relatoriosData | ''>('')
  // Estado do histórico de relatórios gerados (máx 5)
  const [historico, setHistorico] = useState<HistoricoRelatorio[]>([])

  const usuarioLogado = 'ramon.dev' // Exemplo fixo, substitua pelo contexto real

  // Função para adicionar relatório ao histórico e mostrar
  function adicionarAoHistorico(id: keyof typeof relatoriosData) {
    const novoRelatorio: HistoricoRelatorio = {
      id: Date.now(),
      tipo: relatoriosData[id].label,
      data: new Date().toLocaleString(),
      usuario: usuarioLogado,
      dados: relatoriosData[id].dados,
    }

    setRelatorioSelecionado(id)
    setHistorico(prev => [novoRelatorio, ...prev.slice(0, 4)]) // mantém máximo 5 itens
  }

  // Função para exportar JSON
  function exportarJSON(dados: any, nomeArquivo: string) {
    const jsonStr = JSON.stringify(dados, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = nomeArquivo + '.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  // Função para exportar CSV
  function exportarCSV(dados: any, nomeArquivo: string) {
    let csv = ''

    // Se for array de objetos, faz cabeçalho e linhas
    if (Array.isArray(dados)) {
      if (dados.length === 0) return alert('Dados vazios para exportar CSV.')

      const headers = Object.keys(dados[0])
      csv += headers.join(',') + '\n'
      dados.forEach(item => {
        const row = headers.map(h => JSON.stringify(item[h] ?? '')).join(',')
        csv += row + '\n'
      })
    }
    // Se for objeto simples, transforma em duas colunas: chave, valor
    else if (typeof dados === 'object') {
      const entries = Object.entries(dados)
      csv += 'Chave,Valor\n'
      entries.forEach(([key, val]) => {
        csv += `${JSON.stringify(key)},${JSON.stringify(val)}\n`
      })
    }
    // Se for número ou string simples, exporta só o valor
    else {
      csv = String(dados)
    }

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = nomeArquivo + '.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-900 mb-6">Relatórios</h2>

      {/* Botões para gerar relatórios */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {Object.entries(relatoriosData).map(([key, val]) => (
          <button
            key={key}
            onClick={() => adicionarAoHistorico(key as keyof typeof relatoriosData)}
            className="bg-blue-600 text-white px-5 py-3 rounded hover:bg-blue-700 transition font-semibold"
          >
            {val.label}
          </button>
        ))}
      </div>

      {/* Relatório selecionado com exportação */}
      {relatorioSelecionado && (
        <section className="bg-white p-6 rounded shadow mb-12">
          <h3 className="text-2xl font-semibold mb-4">{relatoriosData[relatorioSelecionado].label}</h3>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto mb-4">
            {JSON.stringify(relatoriosData[relatorioSelecionado].dados, null, 2)}
          </pre>

          <div className="flex gap-4">
            <button
              onClick={() =>
                exportarJSON(relatoriosData[relatorioSelecionado].dados, relatoriosData[relatorioSelecionado].label.replace(/\s+/g, '_'))
              }
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
              aria-label="Exportar JSON"
              title="Exportar JSON"
            >
              {/* Ícone JSON (simples SVG) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                className="w-5 h-5"
              >
                <path d="M4 4h16v16H4z" />
                <path d="M8 8h8M8 12h8M8 16h8" />
              </svg>
              JSON
            </button>

            <button
              onClick={() =>
                exportarCSV(relatoriosData[relatorioSelecionado].dados, relatoriosData[relatorioSelecionado].label.replace(/\s+/g, '_'))
              }
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded flex items-center gap-2"
              aria-label="Exportar CSV"
              title="Exportar CSV"
            >
              {/* Ícone CSV (simples SVG) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                className="w-5 h-5"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M8 8h8M8 12h8M8 16h8" />
              </svg>
              CSV
            </button>
          </div>
        </section>
      )}

      {/* Histórico dos últimos 5 relatórios com exportação individual */}
      <section>
        <h3 className="text-xl font-bold mb-4 text-gray-700">Histórico de Relatórios (Últimos 5)</h3>
        {historico.length === 0 ? (
          <p className="text-gray-500">Nenhum relatório gerado ainda.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300 shadow rounded overflow-hidden">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Tipo</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Data</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Usuário</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Exportar JSON</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Exportar CSV</th>
              </tr>
            </thead>
            <tbody className="bg-white text-black">
              {historico.map(item => (
                <tr key={item.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.tipo}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.data}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.usuario}</td>

                  {/* Botão exportar JSON individual */}
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      onClick={() => exportarJSON(item.dados, item.tipo.replace(/\s+/g, '_') + '_historico')}
                      aria-label={`Exportar JSON do relatório ${item.tipo}`}
                      title={`Exportar JSON do relatório ${item.tipo}`}
                      className="text-green-700 hover:text-green-900"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                        className="w-6 h-6 mx-auto"
                      >
                        <path d="M4 4h16v16H4z" />
                        <path d="M8 8h8M8 12h8M8 16h8" />
                      </svg>
                    </button>
                  </td>

                  {/* Botão exportar CSV individual */}
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      onClick={() => exportarCSV(item.dados, item.tipo.replace(/\s+/g, '_') + '_historico')}
                      aria-label={`Exportar CSV do relatório ${item.tipo}`}
                      title={`Exportar CSV do relatório ${item.tipo}`}
                      className="text-yellow-700 hover:text-yellow-900"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                        className="w-6 h-6 mx-auto"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M8 8h8M8 12h8M8 16h8" />
                      </svg>
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
