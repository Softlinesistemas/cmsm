"use client";

import React, { useState, useContext, memo } from "react";
import { useRouter } from "next/navigation";
import { MainContext } from "@/context/MainContext";
import {
  LogOutIcon,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Home,
  Settings,
  Users,
  FileText,
  Archive,
  User,
  Building2,
  ClipboardList,
  UploadCloud,
  FileBarChart,
  ShieldCheck,
  BadgeCheck,
  Megaphone,
  Mail,
  Server,
  Database,
} from "lucide-react";
import { signOut } from "next-auth/react";

type MenuItem = {
  label: string;
  key: string;
  icon: JSX.Element;
  path?: string;
};

const adminMenuItems: MenuItem[] = [
  {
    label: "Processo",
    key: "Processo",
    icon: <ClipboardList size={18} />,
    path: "/dashboardAdmin",
  },
  {
    label: "Inscrições",
    key: "Inscricoes",
    icon: <FileText size={18} />,
    path: "/dashboardAdmin",
  },
  // { label: 'Baixa Pagamentos', key: 'BaixaPagamentos', icon: <Archive size={18} />, path: '/dashboardAdmin' },
  {
    label: "Upload Arquivos",
    key: "UploadArquivos",
    icon: <UploadCloud size={18} />,
    path: "/dashboardAdmin",
  },
  {
    label: "Relatórios",
    key: "Relatorios",
    icon: <FileBarChart size={18} />,
    path: "/dashboardAdmin",
  },
  {
    label: "Avaliação Recursos",
    key: "AvaliacaoRecursos",
    icon: <ShieldCheck size={18} />,
    path: "/dashboardAdmin",
  },
  {
    label: "Resultados",
    key: "Resultados",
    icon: <BadgeCheck size={18} />,
    path: "/dashboardAdmin",
  },
  {
    label: "Gabarito",
    key: "Gabarito",
    icon: <FileText size={18} />,
    path: "/dashboardAdmin",
  },
  // { label: 'Cadastro Editais', key: 'CadastroEditais', icon: <ClipboardList size={18} />, path: '/dashboardAdmin', },
  {
    label: "Comunicados",
    key: "Comunicados",
    icon: <Megaphone size={18} />,
    path: "/dashboardAdmin",
  },
  // { label: 'Email em Massa', key: 'EmailMassa', icon: <Mail size={18} />, path: '/dashboardAdmin' },
  {
    label: "Gestão Admins",
    key: "GestaoAdmins",
    icon: <Users size={18} />,
    path: "/dashboardAdmin",
  },
  // { label: 'Logs de Acesso', key: 'LogsAcesso', icon: <Server size={18} />, path: '/dashboardAdmin' },
  // { label: 'Backup', key: 'Backup', icon: <Database size={18} />, path: '/dashboardAdmin' },
  // { label: 'Configurações', key: 'Configuracoes', icon: <Settings size={18} />, path: '/dashboardAdmin' }
];

const AdminSubMenu = memo(
  ({
    isOpen,
    selectedKey,
    onNavigate,
    isCollapsed,
  }: {
    isOpen: boolean;
    selectedKey: string;
    onNavigate: (item: MenuItem) => void;
    isCollapsed: boolean;
  }) => {
    if (!isOpen) return null;
    return (
      <div className="pl-3 mt-1 bg-blue-800 rounded-lg py-2">
        {adminMenuItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onNavigate(item)}
            className={`w-full flex items-center gap-2 text-sm text-left px-3 py-1 rounded-md hover:bg-blue-700 transition
            ${
              selectedKey === item.key
                ? "bg-yellow-400 text-blue-900 font-bold"
                : ""
            }
          `}
          >
            {item.icon}
            {!isCollapsed && <span>{item.label}</span>}
          </button>
        ))}
      </div>
    );
  }
);

const Sidebar: React.FC = () => {
  const router = useRouter();
  const { selectedComponent, setSelectedComponent } = useContext(MainContext);

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleAdminMenu = () => setIsAdminOpen((prev) => !prev);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const handleNavigate = (item: MenuItem) => {
    setSelectedComponent(item.key);
    if (item.path) router.push(item.path);
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleRoute = (path: string, key: string) => {
    router.push(path);
    setSelectedComponent(key);
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex">
      {/* Topbar Mobile */}
      {typeof window !== "undefined" && window.innerWidth < 768 && (
        <div className="md:hidden fixed top-0 left-0 w-full bg-blue-900 text-white flex items-center p-3 shadow-md z-50">
          <button
            onClick={toggleSidebar}
            className="flex items-center gap-2 text-white font-bold text-lg"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            <span>MENU</span>
          </button>
        </div>
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed top-0 left-0 h-screen z-40 p-4 bg-blue-900 text-white
        transition-all duration-300 ease-in-out
        ${isSidebarOpen ? "w-64" : "w-16"}
        md:relative md:translate-x-0 flex flex-col shadow-2xl ring-1 ring-blue-950/10 rounded-r-2xl
        pt-16 md:pt-4
      `}
      >
        {/* ADMIN MENU */}
        <button
          onClick={toggleAdminMenu}
          className={`flex items-center justify-between gap-2 px-3 py-2 font-semibold text-sm
            rounded-xl hover:bg-blue-800 transition-all duration-300
            ${isAdminOpen ? "bg-blue-800" : ""}
          `}
        >
          <div className="flex items-center gap-3">
            <Settings size={18} />
            {!isSidebarOpen ? null : <span>ADMINISTRAÇÃO</span>}
          </div>
          {!isSidebarOpen ? null : isAdminOpen ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </button>

        {/* SUBMENU ADMIN */}
        <AdminSubMenu
          isOpen={isAdminOpen}
          selectedKey={selectedComponent}
          onNavigate={handleNavigate}
          isCollapsed={!isSidebarOpen}
        />

        {/* DASHBOARD */}
        <button
          onClick={() => handleRoute("/dashboard", "Dashboard")}
          className={`mt-4 flex items-center gap-3 px-3 py-2 rounded-lg text-sm
            hover:bg-blue-800 transition-all duration-300
            ${
              selectedComponent === "Dashboard"
                ? "bg-yellow-400 text-blue-900 font-bold"
                : ""
            }
          `}
        >
          <Home size={18} />
          {!isSidebarOpen ? null : <span>DASHBOARD</span>}
        </button>

        {/* SEÇÃO CADASTRO */}
        <div className="mt-6 mb-1 px-4 py-2 bg-yellow-400 text-blue-900 font-bold text-xs rounded-xl shadow-inner">
          {!isSidebarOpen ? "C" : "CADASTRO"}
        </div>

        {[
          {
            label: "CANDIDATOS",
            path: "/candidatos",
            key: "Candidatos",
            icon: <User size={18} />,
          },
          // { label: 'USUÁRIOS', path: '/usuarios', key: 'Usuarios', icon: <Users size={18} /> },
          {
            label: "SALAS",
            path: "/salas",
            key: "Salas",
            icon: <Building2 size={18} />,
          },
          {
            label: "COTAS",
            path: "/cotas",
            key: "Cotas",
            icon: <ClipboardList size={18} />,
          },
        ].map(({ label, path, key, icon }) => (
          <button
            key={key}
            onClick={() => handleRoute(path, key)}
            className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg
              hover:bg-blue-800 transition-all duration-300
              ${
                selectedComponent === key
                  ? "bg-yellow-400 text-blue-900 font-bold"
                  : ""
              }
            `}
          >
            {icon}
            {!isSidebarOpen ? null : <span>{label}</span>}
          </button>
        ))}

        {/* SEÇÃO PROCESSO */}
        <div className="mt-6 mb-1 px-4 py-2 bg-yellow-400 text-blue-900 font-bold text-xs rounded-xl shadow-inner">
          {!isSidebarOpen ? "P" : "PROCESSO SELETIVO"}
        </div>

        {/* Link direto para Configurações */}
        <button
          onClick={() =>
            handleNavigate({
              key: "Configuracoes",
              label: "CONFIGURAÇÕES",
              icon: <Settings />,
              path: "/configuracoes",
            })
          }
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm
            hover:bg-blue-800 transition-all duration-300
            ${
              selectedComponent === "Configuracoes"
                ? "bg-yellow-400 text-blue-900 font-bold"
                : ""
            }
          `}
        >
          <Settings size={18} />
          {!isSidebarOpen ? null : <span>CONFIGURAÇÕES</span>}
        </button>
        <button
          onClick={async () =>
            await signOut({ callbackUrl: "/", redirect: true })
          }
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-blue-800 transition-all duration-300`}
        >
          <LogOutIcon size={18} />
          {!isSidebarOpen ? null : <span>Sair</span>}
        </button>
      </aside>
    </div>
  );
};

export default Sidebar;
