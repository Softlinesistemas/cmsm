'use client'

import { useState } from "react";

// Componente para envio de email em massa aos inscritos
const EmailMassa = () => {
  const [emails, setEmails] = useState('');
  const [mensagem, setMensagem] = useState('');

  // Simula envio de email
  const enviarEmail = () => {
    if (!emails || !mensagem) {
      alert('Preencha os emails e a mensagem');
      return;
    }
    alert(`Emails enviados para: ${emails}`);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Envio de Email em Massa</h2>
      <textarea
        placeholder="Emails separados por vírgula"
        value={emails}
        onChange={e => setEmails(e.target.value)}
        className="border rounded w-full p-2 mb-2"
      />
      <textarea
        placeholder="Mensagem"
        value={mensagem}
        onChange={e => setMensagem(e.target.value)}
        className="border rounded w-full p-2 mb-2"
      />
      <button onClick={enviarEmail} className="bg-blue-600 text-white px-4 py-2 rounded">
        Enviar
      </button>
    </div>
  );
};

export default EmailMassa;
