'use client'

import { useState } from "react";

// Componente para envio e listagem de comunicados oficiais
const Comunicados = () => {
  const [comunicados, setComunicados] = useState([
    { id: 1, titulo: 'Comunicado 1', texto: 'Texto do comunicado 1' },
  ]);
  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');

  // Adiciona novo comunicado
  const enviarComunicado = () => {
    if (!titulo || !texto) {
      alert('Preencha título e texto');
      return;
    }
    setComunicados([...comunicados, { id: Date.now(), titulo, texto }]);
    setTitulo('');
    setTexto('');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Comunicados</h2>
      <div className="mb-4 space-y-2">
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          className="border rounded w-full p-2"
        />
        <textarea
          placeholder="Texto"
          value={texto}
          onChange={e => setTexto(e.target.value)}
          className="border rounded w-full p-2"
        />
        <button onClick={enviarComunicado} className="bg-blue-600 text-white px-4 py-2 rounded">
          Enviar
        </button>
      </div>
      <ul>
        {comunicados.map(c => (
          <li key={c.id} className="border p-2 rounded mb-2">
            <h3 className="font-semibold">{c.titulo}</h3>
            <p>{c.texto}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Comunicados;
