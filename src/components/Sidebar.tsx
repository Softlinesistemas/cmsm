'use client'

import { useRouter } from 'next/navigation'

export default function Sidebar() {
  const router = useRouter()

  return (
    <div className="w-64 min-h-screen bg-blue-900 text-white p-2">
      {/* Cabeçalho do menu */}
      <div className="flex justify-between items-center bg-blue-800 p-2 text-sm">
        <span className="font-semibold">MENU</span>
        <button className="text-yellow-400">≡</button>
      </div>

      {/* Navegação */}
      <nav className="flex flex-col mt-2">
        {/* Sessão 1 */}
        <button
          onClick={() => router.push('/admin')}
          className="text-left py-2 px-4 hover:bg-blue-700"
        >
          ADMINISTRAÇÃO
        </button>
        <button
          onClick={() => router.push('/dashboard')}
          className="text-left py-2 px-4 hover:bg-blue-700"
        >
          DASHBOARD
        </button>

        {/* Sessão Cadastro */}
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

        {/* Sessão Processo Seletivo */}
        <div className="bg-yellow-400 text-blue-900 font-bold px-4 py-2 mt-2">
          PROCESSO SELETIVO
        </div>
        <button
          onClick={() => router.push('/configuracoes')}
          className="text-left py-2 px-4 hover:bg-blue-700"
        >
          CONFIGURAÇÕES
        </button>
      </nav>
    </div>
  )
}
