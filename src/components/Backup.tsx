'use client'
import { useState } from "react";
import { FaDownload, FaUpload } from "react-icons/fa";

// Componente de Backup e Restauração de Dados
const Backup = () => {
  // Estado para armazenar o backup em formato de texto JSON
  const [backupData, setBackupData] = useState<string | null>(null);

  // Função para exportar os dados do sistema (simulação)
  const exportarBackup = () => {
    // Simulação de dados reais (você pode buscar de uma API)
    const dados = {
      usuarios: [
        { id: 1, nome: "João", email: "joao@exemplo.com" },
        { id: 2, nome: "Maria", email: "maria@exemplo.com" }
      ],
      configuracoes: {
        temaEscuro: true,
        notificacoes: true
      }
    };

    // Converter dados em JSON formatado
    const jsonString = JSON.stringify(dados, null, 2);
    setBackupData(jsonString);

    // Criar um link para download automático do arquivo JSON
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "backup_sistema.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Função para importar backup a partir de um arquivo JSON
  const importarBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const texto = e.target?.result;
        if (typeof texto === "string") {
          const dadosImportados = JSON.parse(texto);
          alert("Backup importado com sucesso!");
          // Aqui você pode enviar os dados para seu backend para restaurar
        }
      } catch (error) {
        alert("Arquivo inválido ou corrompido.");
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="p-4 bg-blue-50 rounded-xl text-black">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">Backup e Restauração</h2>

      {/* Botão para exportar backup */}
      <button
        onClick={exportarBackup}
        className="flex items-center gap-2 bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
      >
        <FaDownload /> Exportar Backup
      </button>

      {/* Exibição do JSON exportado (opcional) */}
      {backupData && (
        <div className="mt-4">
          <h3 className="font-semibold text-blue-800">JSON Exportado:</h3>
          <pre className="bg-white p-2 rounded text-sm text-black border overflow-auto max-h-60">
            {backupData}
          </pre>
        </div>
      )}
    </div>
  );
};

export default Backup;
