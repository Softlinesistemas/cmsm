'use client'

import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

// Componente reutilizável para campo de texto
const CampoTexto = ({ label, value, onChange, placeholder, textarea = false }) => (
  <div className="mb-2">
    <label className="block font-semibold mb-1">{label}</label>
    {textarea ? (
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border rounded w-full p-2 h-32"
      />
    ) : (
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border rounded w-full p-2"
      />
    )}
  </div>
);

// Componente para exibir o relatório final
const RelatorioEnvio = ({ relatorio }) => {
  if (!relatorio) return null;

  return (
    <div className="mt-4 border rounded p-4 bg-gray-50">
      <h3 className="font-semibold text-lg mb-2">📊 Relatório de Envio</h3>

      <p className="text-green-600 font-medium">
        ✅ Emails enviados com sucesso: {relatorio.sucesso}
      </p>

      {relatorio.invalidos && relatorio.invalidos.length > 0 && (
        <div className="mt-2">
          <p className="text-red-600 font-medium">❌ Emails inválidos:</p>
          <ul className="list-disc ml-6 text-sm">
            {relatorio.invalidos.map((email, i) => (
              <li key={i}>{email}</li>
            ))}
          </ul>
        </div>
      )}

      {relatorio.erros && relatorio.erros.length > 0 && (
        <div className="mt-2">
          <p className="text-yellow-600 font-medium">⚠️ Erros de envio:</p>
          <ul className="list-disc ml-6 text-sm">
            {relatorio.erros.map((item, i) => (
              <li key={i}>{item.email}: {item.erro}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Componente principal de envio em massa
const EmailMassa = () => {
  const [assunto, setAssunto] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [relatorio, setRelatorio] = useState(null);
  const [loading, setLoading] = useState(false);

  // Função para enviar os e-mails em massa
  const enviarEmails = async () => {
    if (!assunto || !mensagem) {
      toast.error('Preencha o assunto e a mensagem antes de enviar.');
      return;
    }

    setLoading(true);
    setRelatorio(null);
    toast.loading('⏳ Enviando emails em lotes...');

    try {
      const response = await axios.post('/api/enviar-emails', { assunto, mensagem });
      setRelatorio(response.data);
      toast.dismiss(); // Remove loading
      toast.success('✅ Envio concluído com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar emails:', error);
      toast.dismiss();
      toast.error('Erro ao enviar emails. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Notificações visuais */}
      <Toaster position="top-right" />

      <h2 className="text-2xl font-bold mb-4">Envio de Email em Massa</h2>

      {/* Campos de assunto e mensagem */}
      <CampoTexto
        label="Assunto:"
        value={assunto}
        onChange={(e) => setAssunto(e.target.value)}
        placeholder="Digite o assunto"
      />
      <CampoTexto
        label="Mensagem:"
        value={mensagem}
        onChange={(e) => setMensagem(e.target.value)}
        placeholder="Digite a mensagem"
        textarea
      />

      {/* Botão de envio */}
      <button
        onClick={enviarEmails}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? 'Enviando...' : 'Enviar'}
      </button>

      {/* Relatório final */}
      <RelatorioEnvio relatorio={relatorio} />
    </div>
  );
};

export default EmailMassa;
