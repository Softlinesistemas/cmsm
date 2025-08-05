"use client";

import { useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaUserSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "@/utils/api";
import { useQuery } from "react-query";

const modulosDisponiveis: string[] = ["Admin", "Financeiro", "Dashboard"];

export default function GestaoUsuarios() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [novoUsuario, setNovoUsuario] = useState({
    nome: "",
    cpf: "",
    senha: "",
    modulos: [] as string[],
  });

  const {
    data: usuariosArray,
    isLoading,
    refetch,
  } = useQuery(
    "adms",
    async () => {
      const response = await api.get("api/user/novo");
      setUsuarios(response.data);
      return response.data;
    },
    {
      refetchOnWindowFocus: false,
      retry: 5,
    }
  );

  const toggleModulo = (modulo: string) => {
    setNovoUsuario((prev: any) => ({
      ...prev,
      modulos: prev.modulos.includes(modulo) ? [] : [modulo],
    }));
  };

  function validarCPF(cpf: string) {
    cpf = cpf.replace(/\D/g, "");
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
      return false;
    }

    const calcDigito = (base: any) => {
      let soma = 0;
      for (let i = 0; i < base.length; i++) {
        soma += parseInt(base.charAt(i), 10) * (base.length + 1 - i);
      }
      const resto = (soma * 10) % 11;
      return resto === 10 ? 0 : resto;
    };

    const digito1 = calcDigito(cpf.substr(0, 9));
    const digito2 = calcDigito(cpf.substr(0, 10));

    return (
      digito1 === parseInt(cpf.charAt(9), 10) &&
      digito2 === parseInt(cpf.charAt(10), 10)
    );
  }

  const adicionarUsuario = async () => {
    const { nome, cpf, modulos, senha } = novoUsuario;

    if (!nome.trim()) {
      toast.error("Preencha o nome!");
      return;
    }

    if (!cpf.trim()) {
      toast.error("Preencha o CPF!");
      return;
    }

    if (!validarCPF(cpf)) {
      toast.error("CPF inválido!");
      return;
    }

    if (modulos.length === 0) {
      toast.error("Selecione o segmento!");
      return;
    }

    let codSeg = null;

    switch (modulos[0]) {
      case "Admin":
        codSeg = 2;
        break;
      case "Financeiro":
        codSeg = 3;
        break;
      case "Dashboard":
        codSeg = 4;
        break;
      default:
        codSeg = 2;
    }

    const payload = {
      CodSeg: codSeg,
      user: nome,
      password: senha,
      cpf: cpf,
    };

    try {
      await api.post("api/user/novo", { ...payload });
      refetch();
    } catch (error: any) {
      toast.error(error.response.data.error || error.response.data.message);
    }
    setNovoUsuario({ nome: "", cpf: "", senha: "", modulos: [] });
    setShowModal(false);
  };

  const excluirUsuario = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir?")) {
      try {
        await api.delete("api/user/delete", {
          data: { id: id },
        });
        toast.success("Usuário excluído.");
        refetch();
      } catch (error) {
        toast.error("Erro ao excluir usuário.");
      }
    }
  };

  const einCpfMask = (value: string) => {
    let cleaned = value.replace(/\D/g, "");

    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6)
      return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
    if (cleaned.length <= 9)
      return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(
        6
      )}`;
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(
      6,
      9
    )}-${cleaned.slice(9, 11)}`;
  };

  return (
    <div className="p-6 bg-blue-200 max-h-screen rounded-xl shadow-gray-400 shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-blue-900">
        Gestão de Admins
      </h2>

      <div className="mb-4">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
        >
          <FaPlus className="mr-2" /> Adicionar Usuário
        </button>
      </div>

      {/* Tabela de usuários */}
      <div className="bg-white rounded shadow overflow-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200 !text-gray-700">
              <th className="px-4 py-2 text-left">Nome</th>
              <th className="px-4 py-2">CPF</th>
              <th className="px-4 py-2">Segmento</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios?.map((u) => (
              <tr
                key={u.id}
                className="border-t hover:bg-gray-100 transition-colors"
              >
                <td className="px-4 py-2 text-black">{u.nome}</td>
                <td className="px-4 py-2 text-center text-black">{u.cpf}</td>
                <td className="px-4 py-2 text-center  text-red-800">
                  {u.modulos.join(", ")}
                </td>
                <td className="px-4 py-2 text-center">
                  <span
                    className={`font-semibold ${
                      u.ativo ? "text-green-700" : "text-red-600"
                    }`}
                  >
                    {u.ativo ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="px-4 py-2 flex items-center justify-center gap-3">
                  <button
                    onClick={() => excluirUsuario(u.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Excluir"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para adicionar usuário */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded p-6 w-full max-w-md space-y-4 shadow-lg">
            <h3 className="text-lg font-semibold text-blue-900">
              Novo Usuário
            </h3>
            <input
              type="text"
              placeholder="Nome"
              value={novoUsuario.nome}
              onChange={(e) =>
                setNovoUsuario((prev) => ({
                  ...prev,
                  nome: e.target.value,
                }))
              }
              className="border rounded w-full p-2"
            />
            <input
              type="text"
              placeholder="CPF"
              value={einCpfMask(novoUsuario.cpf)}
              max={14}
              onChange={(e) =>
                setNovoUsuario((prev) => ({
                  ...prev,
                  cpf: e.target.value,
                }))
              }
              className="border rounded w-full p-2"
            />
            <input
              type="password"
              placeholder="Senha"
              value={novoUsuario.senha}
              onChange={(e) =>
                setNovoUsuario((prev) => ({
                  ...prev,
                  senha: e.target.value,
                }))
              }
              className="border rounded w-full p-2"
            />
            <div>
              <h4 className="font-semibold text-gray-700">Segmento</h4>
              <div className="flex flex-wrap gap-2">
                {modulosDisponiveis?.map((m: string) => (
                  <button
                    key={m}
                    onClick={() => toggleModulo(m)}
                    className={`px-3 py-1 rounded border ${
                      novoUsuario?.modulos?.includes(m)
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={adicionarUsuario}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
