import FooterAdm from '@/components/FooterAdm'
import Header from '@/components/HeaderAdm';
import Sidebar from '@/components/Sidebar';
import {
  Pencil,
  CheckCircle,
  XCircle,
  Trash2
} from 'lucide-react';

export default function CotasPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      
      {/* Header no topo da estrutura flex-col */}
      <Header />

      {/* Conteúdo principal com sidebar + conteúdo */}
      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-blue-900 text-center mb-6">COTAS</h1>

          {/* Inserir nova cota */}
          <div className="max-w-4xl mx-auto flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Insira o nome da cota"
              className="flex-1 border rounded px-3 py-2"
            />
            <button className="bg-green-900 text-white px-4 py-2 rounded">INSERIR</button>
          </div>

          {/* Tabela de cotas */}
          <div className="bg-white p-6 rounded shadow-md max-w-4xl mx-auto">
            <table className="w-full table-auto text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2 border">COD.</th>
                  <th className="p-2 border">DESCRIÇÃO</th>
                  <th className="p-2 border">AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border text-center">001</td>
                  <td className="p-2 border">Cota Exemplo</td>
                  <td className="p-2 border text-center">
                    <div className="flex justify-center gap-2">
                      <button title="Editar sala" className="text-yellow-500 hover:text-yellow-600 hover:scale-110 transition-transform">
                        <Pencil size={18} />
                      </button>
                      <button title="Ativar sala" className="text-green-500 hover:text-green-600 hover:scale-110 transition-transform">
                        <CheckCircle size={18} />
                      </button>
                      <button title="Desativar sala" className="text-red-500 hover:text-red-600 hover:scale-110 transition-transform">
                        <XCircle size={18} />
                      </button>
                      <button title="Remover sala" className="text-gray-500 hover:text-gray-700 hover:scale-110 transition-transform">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <FooterAdm />
        </main>
      </div>
    </div>
  );
}