'use client'

import { useState } from "react";

// Componente para upload e listagem de arquivos (txt, csv, pdf)
const UploadArquivos = () => {
  const [arquivos, setArquivos] = useState<File[]>([]);

  // Atualiza lista de arquivos selecionados
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setArquivos(Array.from(e.target.files));
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Upload de Arquivos</h2>
      <input
        type="file"
        multiple
        accept=".txt,.csv,.pdf"
        onChange={handleChange}
        className="mb-4"
      />
      <ul>
        {arquivos.map((file, index) => (
          <li key={index} className="mb-1">{file.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default UploadArquivos;
