'use client'

import LoginPage from '@/app/LoginAdm/page';
import React from 'react';
import { useRouter } from 'next/navigation';

const Footer: React.FC = () => {
  const router = useRouter()
  return (
    <footer className="w-full bg-blue-900 text-white flex flex-col mt-8">
      {/* Container principal com flex e espaçamento interno
      <div className="flex flex-col md:flex-row justify-between items-start px-6 py-4">
        {/* Bloco do Mapa e endereço */}
        {/* <div className="flex items-start">
          <iframe
            title="Mapa"
            width="240"
            height="80"
            className="rounded-md border border-white"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3455.201155968051!2d-53.812712184886595!3d-29.684047181997557!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94fee5e5f6f2b8e7%3A0x3a65f9f8f79997aa!2sRua%20Radialista%20Osvaldo%20Nobre%2C%20132%20-%20Juscelino%20Kubitschek%2C%20Santa%20Maria%20-%20RS%2C%2097035-000!5e0!3m2!1spt-BR!2sbr!4v1716264520972!5m2!1spt-BR!2sbr"
          />
          <div className="ml-4 text-sm">
            <p className="font-bold text-yellow-300">COLÉGIO MILITAR DE SANTA MARIA</p>
            <p>Rua Radialista Osvaldo Nobre, Nº 132 - Juscelino Kubitschek</p>
            <p>Santa Maria - RS, CEP: 97035-000</p>
          </div>
        </div> */}

        {/* Bloco Institucional */}
        {/* <div className="text-sm mt-4 md:mt-0 md:ml-6">
          <p className="font-bold mb-1">Institucional</p>
          <ul>
            <li>Histórico da OM</li>
            <li>Legislação</li>
            <li>Projeto Pedagógico</li>
          </ul>
        </div> */}

        {/* Bloco Contato */}
        {/* <div className="text-sm mt-4 md:mt-0 md:ml-6">
          <p className="font-bold mb-1">Contato</p>
          <ul>
            <li>Central de Atendimento</li>
            <li>Fale conosco</li>
            <li>Perguntas frequentes</li>
          </ul>
        </div> */}

        {/* Botão Entrar */}
        {/* <div className="text-sm mt-4 md:mt-0 md:ml-6 text-center">
          <p className="font-bold mb-2">INSTITUCIONAL</p>
          <button
            className="bg-yellow-400 text-black font-semibold px-6 py-2 rounded-full hover:bg-yellow-500 transition"
            onClick={() => router.push("/LoginAdm")}
          >
            ENTRAR
          </button>
        </div>
      </div> */}

      {/* Linha final separada e fixa abaixo */}
      <div className="bg-blue-950 text-center text-xs py-2 w-full">
        Desenvolvido por Soft line Sistemas
      </div>
    </footer>
  );
};

export default Footer;