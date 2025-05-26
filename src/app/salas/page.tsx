import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import {
  Pencil,
  CheckCircle,
  XCircle,
  Trash2
} from 'lucide-react';

export default function SalasPage() {
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-blue-900 text-center mb-8">SALAS</h1>

        {/* Formulário de cadastro */}
        <div className="bg-white p-6 rounded-2xl shadow-md max-w-4xl mx-auto border border-gray-200">
          <h2 className="text-xl font-semibold text-blue-900 mb-6">Cadastro de Salas</h2>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium text-gray-700">Nome ou número da sala</label>
              <input type="text" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Andar</label>
              <input type="text" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Capacidade</label>
              <select className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>30</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Selecione o ano</label>
              <div className="flex gap-4">
                <label className="text-sm"><input type="checkbox" className="mr-1" />6º Ano</label>
                <label className="text-sm"><input type="checkbox" className="mr-1" />1º Ano</label>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Portadores de necessidades especiais?</label>
              <div className="flex gap-4">
                <label className="text-sm"><input type="radio" name="especial" className="mr-1" />Sim</label>
                <label className="text-sm"><input type="radio" name="especial" className="mr-1" />Não</label>
              </div>
            </div>
          </div>
          <button className="bg-green-900 text-white px-6 py-2 rounded-md hover:bg-green-800 transition block mx-auto">Gravar</button>
        </div>

        {/* Grid de salas cadastradas */}
        <div className="mt-10 bg-white p-6 rounded-2xl shadow-md max-w-6xl mx-auto border border-gray-200">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Salas cadastradas</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="p-2 border">Cód</th>
                  <th className="p-2 border">Nome</th>
                  <th className="p-2 border">Andar</th>
                  <th className="p-2 border">Cadeiras</th>
                  <th className="p-2 border">Ano</th>
                  <th className="p-2 border">Especial</th>
                  <th className="p-2 border">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50">
                  <td className="p-2 border text-center">001</td>
                  <td className="p-2 border">Sala 101</td>
                  <td className="p-2 border text-center">1º</td>
                  <td className="p-2 border text-center">30</td>
                  <td className="p-2 border text-center">6º</td>
                  <td className="p-2 border text-center">
                    <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Sim</span>
                  </td>
                  <td className="p-2 border text-center space-x-1">
                    <button
                      title="Editar sala"
                      className="text-yellow-500 hover:text-yellow-600 transition-transform hover:scale-110"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      title="Ativar sala"
                      className="text-green-500 hover:text-green-600 transition-transform hover:scale-110"
                    >
                      <CheckCircle size={18} />
                    </button>
                    <button
                      title="Desativar sala"
                      className="text-red-500 hover:text-red-600 transition-transform hover:scale-110"
                    >
                      <XCircle size={18} />
                    </button>
                    <button
                      title="Remover sala"
                      className="text-gray-500 hover:text-gray-700 transition-transform hover:scale-110"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            
          </div>
        </div>
         <Footer />
      </div>
      
    </div>
   
  );
}