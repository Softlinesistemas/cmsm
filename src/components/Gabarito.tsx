'use client';

import { useState, useEffect, useContext } from "react";


const Gabarito = () => {
  const [inscritos, setInscritos] = useState([
    { id: 1, nome: 'João Silva', cpf: '000.000.000-00', numeroInscricao: '123456', serie: '6º Ano', gabaritoRecebido: false },
    { id: 2, nome: 'Maria Souza', cpf: '111.111.111-11', numeroInscricao: '654321', serie: '1º Ano', gabaritoRecebido: true },
    { id: 3, nome: 'Carlos Lima', cpf: '222.222.222-22', numeroInscricao: '111222', serie: '6º Ano', gabaritoRecebido: false },
  ]);

  const [busca, setBusca] = useState('');

  const enviarGabarito = (id: number, file: File | null) => {
    if (!file) {
      alert("Selecione um arquivo para enviar!");
      return;
    }

    console.log(`Enviando gabarito para ID ${id} - ${file.name}`);
    setInscritos(prev =>
      prev.map(inscrito =>
        inscrito.id === id ? { ...inscrito, gabaritoRecebido: true } : inscrito
      )
    );

    alert(`Gabarito ${file.name} enviado para inscrito ${id}!`);
  };

  const inscritosFiltrados = inscritos.filter(inscrito =>
    inscrito.nome.toLowerCase().includes(busca.toLowerCase()) ||
    inscrito.cpf.includes(busca) ||
    inscrito.numeroInscricao.includes(busca)
  );

  return (
    <div className="p-4 bg-white rounded-xl shadow shadow-gray-300">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">Envio de Gabaritos</h2>

      {/* Busca */}
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Buscar por nome, CPF ou inscrição..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="flex-1 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded">
          <thead className="bg-blue-800 text-white">
            <tr>
              <th className="border px-2 py-1 text-xs md:text-sm">ID</th>
              <th className="border px-2 py-1 text-xs md:text-sm">Nome</th>
              <th className="border px-2 py-1 text-xs md:text-sm">CPF</th>
              <th className="border px-2 py-1 text-xs md:text-sm">Inscrição</th>
              <th className="border px-2 py-1 text-xs md:text-sm">Série</th>
              <th className="border px-2 py-1 text-xs md:text-sm">Status</th>
              <th className="border px-2 py-1 text-xs md:text-sm">Ação</th>
            </tr>
          </thead>
          <tbody>
            {inscritosFiltrados.map((inscrito) => (
              <tr key={inscrito.id} className="hover:bg-blue-50 transition-colors text-black">
                <td className="border px-2 py-1 text-xs md:text-sm">{inscrito.id}</td>
                <td className="border px-2 py-1 text-xs md:text-sm">{inscrito.nome}</td>
                <td className="border px-2 py-1 text-xs md:text-sm">{inscrito.cpf}</td>
                <td className="border px-2 py-1 text-xs md:text-sm">{inscrito.numeroInscricao}</td>
                <td className="border px-2 py-1 text-xs md:text-sm">{inscrito.serie}</td>
                <td className="border px-2 py-1 text-xs md:text-sm">
                  <span
                    className={`px-2 py-1 rounded text-white text-xs
                      ${inscrito.gabaritoRecebido ? 'bg-green-600' : 'bg-red-600'}`}
                  >
                    {inscrito.gabaritoRecebido ? 'Recebido' : 'Pendente'}
                  </span>
                </td>
                <td className="border px-2 py-1 text-xs md:text-sm">
                  {/* Upload */}
                  <div className="flex flex-col md:flex-row items-center gap-1">
                    <label className="cursor-pointer text-blue-700 underline text-xs">
                      <input
                        type="file"
                        id={`file-${inscrito.id}`}
                        className="hidden"
                      />
                      Selecionar
                    </label>
                    <button
                      onClick={() => {
                        const inputFile = document.getElementById(`file-${inscrito.id}`) as HTMLInputElement;
                        const file = inputFile?.files?.[0] || null;
                        enviarGabarito(inscrito.id, file);
                      }}
                      disabled={inscrito.gabaritoRecebido}
                      className={`px-2 py-1 rounded text-xs text-white transition
                        ${inscrito.gabaritoRecebido ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                      Enviar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {inscritosFiltrados.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-2 text-gray-500 text-sm">Nenhum inscrito encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Observação para futuro envio em lote */}
      <div className="mt-4">
        {/* Botão de upload em lote */}
        <div className="flex flex-col md:flex-row items-center gap-2 mb-2">
          <label htmlFor="upload-lote" className="text-blue-700 underline cursor-pointer text-xs">
            Selecionar arquivo em lote
          </label>
          <input
            type="file"
            id="upload-lote"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                alert(`Arquivo de gabaritos em lote selecionado: ${file.name}`);
                // Aqui futuramente: chamada para API ou processamento do lote
              }
            }}
          />
          <button
            onClick={() => {
              const inputFile = document.getElementById('upload-lote') as HTMLInputElement;
              const file = inputFile?.files?.[0] || null;
              if (file) {
                alert(`Enviando gabaritos em lote: ${file.name}`);
                // TODO: Integrar com backend para envio real!
              } else {
                alert('Selecione um arquivo em lote antes de enviar.');
              }
            }}
            className="px-3 py-1 text-xs rounded bg-purple-600 hover:bg-purple-700 text-white transition"
          >
            Enviar Lote
          </button>
        </div>

        {/* Texto de observação */}
        <div className="text-xs text-gray-500 italic">
          💡 Envio em lote de gabaritos já está em preparação!
        </div>
      </div>

    </div>
  );
};

export default Gabarito;