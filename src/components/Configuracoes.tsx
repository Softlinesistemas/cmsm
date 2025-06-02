'use client'

import { useState } from "react";

// Componente para configurações gerais do sistema
const Configuracoes = () => {
  const [config, setConfig] = useState({
    temaEscuro: false,
    notificacoes: true,
  });

  // Alterna tema escuro
  const toggleTema = () => {
    setConfig(prev => ({ ...prev, temaEscuro: !prev.temaEscuro }));
  };

  // Alterna notificações
  const toggleNotificacoes = () => {
    setConfig(prev => ({ ...prev, notificacoes: !prev.notificacoes }));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Configurações</h2>
      <div className="mb-4">
        <label className="inline-flex items-center space-x-2 text-black">
          <input
            type="checkbox"
            checked={config.temaEscuro}
            onChange={toggleTema}
            className="form-checkbox"
          />
          <span>Tema Escuro</span>
        </label>
      </div>
      <div>
        <label className="inline-flex items-center space-x-2 text-black">
          <input
            type="checkbox"
            checked={config.notificacoes}
            onChange={toggleNotificacoes}
            className="form-checkbox"
          />
          <span>Notificações</span>
        </label>
      </div>
    </div>
  );
};

export default Configuracoes;
