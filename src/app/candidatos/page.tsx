'use client'

import React, { useState, useContext } from 'react'
import Header from '@/components/HeaderAdm'
import Sidebar from '@/components/Sidebar'
import Footer from '@/components/FooterAdm'
import { MainContext } from '@/context/MainContext'

export default function AdminEditarCandidato() {
const { selectedComponent, setSelectedComponent } = useContext(MainContext)
  // Estados
  const [busca, setBusca] = useState('')
  const [candidato, setCandidato] = useState<any | null>(null)
  const [editando, setEditando] = useState(false)
  const [motivoAlteracao, setMotivoAlteracao] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  // Busca candidato por nome, cpf ou inscrição
  async function handleBuscar() {
    if (!busca.trim()) {
      setErro('Digite nome, CPF ou número da inscrição para buscar')
      setCandidato(null)
      return
    }
    setErro('')
    setLoading(true)
    try {
      const res = await fetch(`/api/candidatos?query=${encodeURIComponent(busca)}`)
      if (!res.ok) throw new Error('Erro ao buscar candidato')
      const data = await res.json()
      if (data.length === 0) {
        setErro('Nenhum candidato encontrado.')
        setCandidato(null)
      } else {
        setCandidato(data[0])
      }
    } catch (e: any) {
      setErro('Erro na busca: ' + e.message)
      setCandidato(null)
    } finally {
      setLoading(false)
      setEditando(false)
      setMotivoAlteracao('')
    }
  }

  // Atualiza campos do candidato
  function handleChange(e: any) {
    const { name, value, type, checked } = e.target
    if (type === 'checkbox' && name === 'transtornoTipos') {
      const current = candidato.transtornoTipos || []
      if (checked) {
        setCandidato({ ...candidato, transtornoTipos: [...current, value] })
      } else {
        setCandidato({ ...candidato, transtornoTipos: current.filter((t: any) => t !== value) })
      }
    } else {
      setCandidato({ ...candidato, [name]: value })
    }
  }

  // Salvar alterações do candidato
  async function handleSalvar(e: any) {
    e.preventDefault()
    setErro('')

    if (!motivoAlteracao.trim()) {
      setErro('Informe o motivo da alteração.')
      return
    }

    try {
      setLoading(true)
      const res = await fetch(`/api/candidatos/${candidato.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...candidato, motivoAlteracao }),
      })
      if (!res.ok) throw new Error('Falha ao salvar alterações')
      alert('Alterações salvas com sucesso!')
      setEditando(false)
      setMotivoAlteracao('')
    } catch (e: any) {
      setErro('Erro ao salvar: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header fixo no topo */}
      <Header />

      {/* Container principal: sidebar + conteúdo */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar: ocupa largura fixa e altura 100vh, fixo */}
        <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r border-gray-200">
          <Sidebar />
        </aside>

        {/* Conteúdo principal: ocupa restante do espaço, scroll vertical */}
        <main className="flex-1 overflow-auto p-6 max-w-4xl mx-auto w-full">
          <h1 className="text-3xl font-bold mb-6 text-blue-800">Editar Candidato</h1>

          {/* Campo de busca */}
          <div className="mb-8">
            <label htmlFor="busca" className="block font-semibold text-blue-700 mb-2">
              Buscar por nome, CPF ou número da inscrição:
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id="busca"
                type="text"
                value={busca}
                onChange={e => setBusca(e.target.value)}
                className="flex-grow border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Digite para buscar..."
                onKeyDown={e => e.key === 'Enter' && handleBuscar()}
                disabled={loading}
              />
              <button
                onClick={handleBuscar}
                disabled={loading}
                className="bg-blue-800 text-white px-5 py-2 rounded hover:bg-blue-900 disabled:opacity-50 transition"
              >
                {loading ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
            {erro && <p className="text-red-600 mt-2 font-medium">{erro}</p>}
          </div>

          {/* Formulário de edição */}
          {candidato && (
            <form
              onSubmit={handleSalvar}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-6"
            >
              {/* Número da inscrição - somente leitura */}
              <div>
                <label className="block font-semibold text-blue-700 mb-1">Número da Inscrição</label>
                <input
                  type="text"
                  name="numeroInscricao"
                  value={candidato.numeroInscricao || ''}
                  disabled
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
                />
              </div>

              {/* Nome completo */}
              <div>
                <label className="block font-semibold text-blue-700 mb-1">Nome Completo</label>
                <input
                  type="text"
                  name="nomeCompleto"
                  value={candidato.nomeCompleto || ''}
                  onChange={handleChange}
                  disabled={!editando}
                  required
                  className={`w-full border rounded px-3 py-2 ${
                    editando
                      ? 'border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white'
                      : 'border-gray-300 bg-gray-50 cursor-not-allowed'
                  } transition`}
                />
              </div>

              {/* CPF */}
              <div>
                <label className="block font-semibold text-blue-700 mb-1">CPF</label>
                <input
                  type="text"
                  name="cpf"
                  value={candidato.cpf || ''}
                  onChange={handleChange}
                  disabled={!editando}
                  required
                  className={`w-full border rounded px-3 py-2 ${
                    editando
                      ? 'border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white'
                      : 'border-gray-300 bg-gray-50 cursor-not-allowed'
                  } transition`}
                />
              </div>

              {/* Outros campos podem ser adicionados aqui seguindo o mesmo padrão */}

              {/* Motivo da alteração */}
              <div>
                <label className="block font-semibold text-red-700 mb-1">
                  Motivo da Alteração <span className="text-red-600">*</span>
                </label>
                <textarea
                  name="motivoAlteracao"
                  value={motivoAlteracao}
                  onChange={e => setMotivoAlteracao(e.target.value)}
                  required
                  disabled={!editando}
                  placeholder="Descreva o motivo da alteração"
                  className="w-full border border-red-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 resize-y min-h-[80px]"
                />
              </div>

              {/* Botões */}
              <div className="flex flex-wrap gap-4">
                {!editando ? (
                  <button
                    type="button"
                    onClick={() => setEditando(true)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded transition"
                  >
                    Editar
                  </button>
                ) : (
                  <>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded disabled:opacity-50 transition"
                    >
                      {loading ? 'Salvando...' : 'Salvar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditando(false)
                        setMotivoAlteracao('')
                        handleBuscar() // recarregar os dados para desfazer alterações
                      }}
                      className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded transition"
                    >
                      Cancelar
                    </button>
                  </>
                )}
              </div>
            </form>
          )}
        </main>
      </div>

      {/* Footer fixo no final */}
      <Footer />
    </div>
  )
}
