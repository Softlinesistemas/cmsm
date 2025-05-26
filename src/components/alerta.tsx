// components/Alerta.tsx
import React from 'react'

interface AlertaProps {
  mensagem: string
  tipo?: 'info' | 'erro' | 'sucesso'
  onClose?: () => void
}

export default function Alerta({ mensagem, tipo = 'info', onClose }: AlertaProps) {
  // Cores diferentes por tipo
  const bgColor =
    tipo === 'erro' ? 'bg-red-100 border-red-400 text-red-700' :
    tipo === 'sucesso' ? 'bg-green-100 border-green-400 text-green-700' :
    'bg-blue-100 border-blue-400 text-blue-700'

  return (
    <div className={`border px-4 py-3 rounded relative ${bgColor}`} role="alert">
      <span className="block sm:inline">{mensagem}</span>
      {onClose && (
        <button
          className="absolute top-0 bottom-0 right-0 px-4 py-3"
          onClick={onClose}
        >
          ✕
        </button>
      )}
    </div>
  )
}
