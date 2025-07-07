'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import api from '@/utils/api'
import { useSession } from 'next-auth/react'
import { useQuery } from 'react-query'

interface StepsNavbarProps {
  activeStep: number 
}

const initialSteps = [
  'Dados da Inscrição',
  'Sair',
]


// Obtendo os dados de inscrição ganha acesso ao pagamento
const middleSteps = [
  'Dados da Inscrição',
  'Pagamento',
  'Sair',
]

// Obtendo os dados de pagamento ganha acesso ao local e horário
const fullSteps = [
  'Dados da Inscrição',
  'Local e Horário',
  'Pagamento',
  'Sair',
]

export default function StepsNavbar({ activeStep }: StepsNavbarProps) {
  const router = useRouter()
  const { data: session } = useSession()

  const { data: candidato, isLoading, refetch } = useQuery(
    ['candidatoData'],
    async () => {
      const response = await api.get(`api/candidato/${session?.user.cpf}`);
      return response.data;
    },
    {
      retry: 5,
      refetchOnWindowFocus: false,
      enabled: !!session?.user.cpf
    }
  );

  const handleClick = async (label: string) => {
    switch (label) {
      case "Dados da Inscrição":
        router.push('/acompanhamento')
        break
      case "Local e Horário":
        router.push('/local')
        break
      case "Pagamento":
        router.push('/pagamento')
        break
      case "Sair":
        await signOut({ callbackUrl: "/", redirect: true });
        break
      default:
        break
    }
  }

  return (
    <nav className="border-b border-gray-300">
      <ul className="max-w-5xl mx-auto flex text-xs uppercase text-gray-500">
        {(candidato?.RegistroGru ? fullSteps : candidato?.Responsavel && !candidato?.RegistroGru ? middleSteps : initialSteps).map((label, idx) => (
          <li
            key={label}
            onClick={() => handleClick(label)}
            className={
              `flex-1 py-3 text-center cursor-pointer ${
              (idx === activeStep
                ? 'text-green-900 font-semibold border-b-2 border-green-900'
                : '')} ${label === "Sair" ? "text-red-600 hover:text-red-800" : ""} `
            }
          >
            {label}
          </li>
        ))}
      </ul>
    </nav>
  )
}
