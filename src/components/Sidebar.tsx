'use client'

import { useState, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { MainContext } from '@/context/MainContext'

const Sidebar: React.FC = () => {
  const router = useRouter()
  const { setSelectedComponent } = useContext(MainContext)

  const [isAdminOpen, setIsAdminOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleAdminMenu = () => setIsAdminOpen(!isAdminOpen)
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  const adminMenuItems = [
    { label: 'Processo', key: 'Processo' },
    { label: 'Inscrições', key: 'Inscricoes' },
    { label: 'Baixa Pagamentos', key: 'BaixaPagamentos' },
    { label: 'Upload Arquivos', key: 'UploadArquivos' },
    { label: 'Relatórios', key: 'Relatorios' },
    { label: 'Avaliação Recursos', key: 'AvaliacaoRecursos' },
    { label: 'Resultados', key: 'Resultados' },
    { label: 'Certificados', key: 'Certificados' },
    { label: 'Cadastro Editais', key: 'CadastroEditais' },
    { label: 'Comunicados', key: 'Comunicados' },
    { label: 'Email em Massa', key: 'EmailMassa' },
    { label: 'Gestão Admins', key: 'GestaoAdmins' },
    { label: 'Logs de Acesso', key: 'LogsAcesso' },
    { label: 'Backup', key: 'Backup' },
    { label: 'Configurações', key: 'Configuracoes' },
  ]

  const handleNavigate = (item: any) => {
    setSelectedComponent(item.key)
    setIsSidebarOpen(false)
  }

  return (
    <div>
      {/* Botão Toggle apenas em telas menores */}
      <div className="md:hidden flex justify-between items-center bg-blue-800 p-2 text-white">
        <span className="font-semibold">MENU</span>
        <button
          onClick={toggleSidebar}
          className="text-yellow-400 text-2xl focus:outline-none"
        >
          {isSidebarOpen ? '✕' : '≡'}
        </button>
      </div>

      {/* Sidebar Responsiva */}
      <div
        className={`
          fixed inset-y-0 left-0 w-64 bg-blue-900 text-white p-2 z-50
          transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 md:block
        `}
      >
        <div className="hidden md:flex justify-between items-center bg-blue-800 p-2 text-sm">
          <span className="font-semibold">MENU</span>
        </div>

        <nav className="flex flex-col mt-2">
          <button
            onClick={toggleAdminMenu}
            className="text-left py-2 px-4 hover:bg-blue-700"
          >
            ADMINISTRAÇÃO
          </button>

          {isAdminOpen && (
            <div className="ml-4 border-l border-blue-700">
              {adminMenuItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleNavigate(item)}
                  className="block w-full text-left py-1 px-4 hover:bg-blue-800 text-sm"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => router.push('/dashboard')}
            className="text-left py-2 px-4 hover:bg-blue-700"
          >
            DASHBOARD
          </button>

          <div className="bg-yellow-400 text-blue-900 font-bold px-4 py-2 mt-2">
            CADASTRO
          </div>
          <button
            onClick={() => router.push('/candidatos')}
            className="text-left py-2 px-4 hover:bg-blue-700"
          >
            CANDIDATOS
          </button>
          <button
            onClick={() => router.push('/usuarios')}
            className="text-left py-2 px-4 hover:bg-blue-700"
          >
            USUÁRIOS
          </button>
          <button
            onClick={() => router.push('/salas')}
            className="text-left py-2 px-4 hover:bg-blue-700"
          >
            SALAS
          </button>
          <button
            onClick={() => router.push('/cotas')}
            className="text-left py-2 px-4 hover:bg-blue-700"
          >
            COTAS
          </button>

          <div className="bg-yellow-400 text-blue-900 font-bold px-4 py-2 mt-2">
            PROCESSO SELETIVO
          </div>
          <button
            onClick={() => {
              setSelectedComponent('Configuracoes')
              setIsSidebarOpen(false)
            }}
            className="text-left py-2 px-4 hover:bg-blue-700"
          >
            CONFIGURAÇÕES
          </button>
        </nav>
      </div>
    </div>
  )
}

export default Sidebar