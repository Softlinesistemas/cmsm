'use client';
import { useState } from "react";
import { useEditais } from "@/context/EditalContext";

const CadastroEditais = () => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const { adicionarEdital } = useEditais();

  const handleAdicionar = () => {
    if (!titulo || !descricao) {
      alert("Preencha todos os campos");
      return;
    }

    adicionarEdital({
      id: Date.now(),
      titulo,
      descricao
    });

    setTitulo('');
    setDescricao('');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Cadastro de Editais</h2>
      <div className="space-y-2 mb-4">
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          className="border rounded w-full p-2"
        />
        <textarea
          placeholder="Descrição"
          value={descricao}
          onChange={e => setDescricao(e.target.value)}
          className="border rounded w-full p-2"
        />
        <button
          onClick={handleAdicionar}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Adicionar Edital
        </button>
      </div>
    </div>
  );
};

export default CadastroEditais;