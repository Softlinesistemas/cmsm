'use client'

import React, { useState, useContext, useEffect, useCallback, memo } from 'react'
import { useRouter } from 'next/navigation'
import { MainContext } from '@/context/MainContext'
import { ChevronDown, ChevronUp, Menu, X } from 'lucide-react'

type MenuItem = { label: string; key: string }

const adminMenuItems: MenuItem[] = [
  { label: 'Processo', key: 'Processo' },
  { label: 'Inscrições', key: 'Inscricoes' },
  { label: 'Baixa Pagamentos', key: 'BaixaPagamentos' },
  { label: 'Upload Arquivos', key: 'UploadArquivos' },
  { label: 'Relatórios', key: 'Relatorios' },
  { label: 'Avaliação Recursos', key: 'AvaliacaoRecursos' },
  { label: 'Resultados', key: 'Resultados' },
  { label: 'Gabarito', key: 'Gabarito' },
  { label: 'Cadastro Editais', key: 'CadastroEditais' },
  { label: 'Comunicados', key: 'Comunicados' },
  { label: 'Email em Massa', key: 'EmailMassa' },
  { label: 'Gestão Admins', key: 'GestaoAdmins' },
  { label: 'Logs de Acesso', key: 'LogsAcesso' },
  { label: 'Backup', key: 'Backup' },
  { label: 'Configurações', key: 'Configuracoes' },
]

// Componente memoizado para os itens do submenu Admin
const AdminSubMenu = memo(
  ({
    isOpen,
    selectedKey,
    onNavigate,
  }: {
    isOpen: boolean
    selectedKey: string
    onNavigate: (item: MenuItem) => void
  }) => {
    if (!isOpen) return null
    return (
      <div className="ml-6 flex flex-col space-y-1 mt-1 border-l-2 border-blue-700 pl-2">
        {adminMenuItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onNavigate(item)}
            className={`text-sm text-left px-3 py-1 rounded-md hover:bg-blue-700 transition
              ${
                selectedKey === item.key
                  ? 'bg-yellow-400 text-blue-900 font-bold'
                  : ''
              }
            `}
          >
            {item.label}
          </button>
        ))}
      </div>
    )
  }
)

const Sidebar: React.FC = () => {
  const router = useRouter()
  const { selectedComponent, setSelectedComponent } = useContext(MainContext)

  const [isAdminOpen, setIsAdminOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Memoiza o callback pra evitar recriação em cada render
  const toggleAdminMenu = useCallback(() => {
    setIsAdminOpen((v) => !v)
  }, [])

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((v) => !v)
  }, [])

  // Memoiza handler de navegação
  const handleNavigate = useCallback(
    (item: MenuItem) => {
      setSelectedComponent(item.key)
      setIsSidebarOpen(false)
    },
    [setSelectedComponent]
  )

  // Navega para rotas simples (sem alterar contexto)
  const handleRoute = useCallback(
    (path: string, key: string) => {
      router.push(path)
      setSelectedComponent(key)
      setIsSidebarOpen(false)
    },
    [router, setSelectedComponent]
  )

  return (
    <div>
      {/* Toggle botão para mobile */}
      <div className="md:hidden flex justify-between items-center bg-blue-900 p-3 text-white shadow-md">
        <span className="font-bold text-lg select-none">MENU</span>
        <button
          onClick={toggleSidebar}
          aria-label="Toggle menu"
          className="text-yellow-400 focus:outline-none"
        >
          {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 w-64 bg-blue-900 text-white p-4 z-50
          transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 md:flex md:flex-col
          shadow-lg md:shadow-none
          overflow-y-auto
          scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-blue-900
        `}
      >
        {/* Cabeçalho no desktop */}
        <div className="hidden md:flex justify-between items-center mb-6 px-2 border-b border-blue-700 pb-2">
          <span className="font-bold text-xl select-none">MENU</span>
          <button
            onClick={toggleAdminMenu}
            aria-label="Toggle administração"
            className="text-yellow-400 hover:text-yellow-300 transition"
          >
            {isAdminOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        <nav className="flex flex-col space-y-1">
          {/* Botão do menu ADMINISTRAÇÃO */}
          <button
            onClick={toggleAdminMenu}
            className={`
              flex justify-between items-center w-full px-4 py-2 font-semibold
              rounded-md hover:bg-blue-800 transition
              ${isAdminOpen ? 'bg-blue-800' : ''}
            `}
          >
            ADMINISTRAÇÃO
            {isAdminOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {/* Itens submenu ADMIN memoizados */}
          <AdminSubMenu
            isOpen={isAdminOpen}
            selectedKey={selectedComponent}
            onNavigate={handleNavigate}
          />

          {/* Botão Dashboard */}
          <button
            onClick={() => handleRoute('/dashboard', 'Dashboard')}
            className={`
              px-4 py-2 rounded-md hover:bg-blue-700 transition font-semibold
              ${
                selectedComponent === 'Dashboard'
                  ? 'bg-yellow-400 text-blue-900 font-bold'
                  : ''
              }
            `}
          >
            DASHBOARD
          </button>

          {/* Seção Cadastro */}
          <div className="mt-6 mb-1 bg-yellow-400 text-blue-900 font-bold px-4 py-2 rounded">
            CADASTRO
          </div>
          {[
            { label: 'CANDIDATOS', path: '/candidatos', key: 'Candidatos' },
            { label: 'USUÁRIOS', path: '/usuarios', key: 'Usuarios' },
            { label: 'SALAS', path: '/salas', key: 'Salas' },
            { label: 'COTAS', path: '/cotas', key: 'Cotas' },
          ].map(({ label, path, key }) => (
            <button
              key={key}
              onClick={() => handleRoute(path, key)}
              className={`
                text-left px-4 py-2 rounded-md hover:bg-blue-700 transition
                ${
                  selectedComponent === key
                    ? 'bg-yellow-400 text-blue-900 font-bold'
                    : ''
                }
              `}
            >
              {label}
            </button>
          ))}

          {/* Seção Processo Seletivo */}
          <div className="mt-6 mb-1 bg-yellow-400 text-blue-900 font-bold px-4 py-2 rounded">
            PROCESSO SELETIVO
          </div>
          <button
            onClick={() => {
              setSelectedComponent('Configuracoes')
              setIsSidebarOpen(false)
            }}
            className={`
              px-4 py-2 rounded-md hover:bg-blue-700 transition font-semibold
              ${
                selectedComponent === 'Configuracoes'
                  ? 'bg-yellow-400 text-blue-900 font-bold'
                  : ''
              }
            `}
          >
            CONFIGURAÇÕES
          </button>
        </nav>
      </aside>
    </div>
  )
}

export default Sidebar