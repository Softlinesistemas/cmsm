'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

interface StepsNavbarProps {
  activeStep: number 
}

const steps = [
  'Dados da Inscrição',
  'Local e Horário',
  'Pagamento',
  'Sair',
]

export default function StepsNavbar({ activeStep }: StepsNavbarProps) {
  const router = useRouter()

  const handleClick = (index: number) => {
    switch (index) {
      case 0:
        router.push('/acompanhamento')
        break
      case 1:
        router.push('/local')
        break
      case 2:
        router.push('/pagamento')
        break
      case 3:
        router.push('/')
        break
      default:
        break
    }
  }

  return (
    <nav className="border-b border-gray-300">
      <ul className="max-w-5xl mx-auto flex text-xs uppercase text-gray-500">
        {steps.map((label, idx) => (
          <li
            key={label}
            onClick={() => handleClick(idx)}
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

// Usage in pages/inscricao/pagamento.tsx or Confirmacao.tsx: 
// import StepsNavbar from '../../../components/StepsNavbar'
//
// <StepsNavbar activeStep={2} /> // for Pagamento page
