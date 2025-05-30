'use client'

import LoginPage from '@/app/LoginAdm/page';
import React from 'react';
import { useRouter } from 'next/navigation';

const Footer: React.FC = () => {
  const router = useRouter();

  return (
    <footer className="w-full bg-blue-900 text-white flex flex-col mt-8">
      {/* Container principal com espaçamento interno e gap para melhor responsividade */}
      <div className="flex flex-col md:flex-row justify-between items-start px-6 py-4 gap-4">
        {/* Bloco do Mapa e Endereço */}
        <div className="flex flex-col sm:flex-row items-start gap-4 flex-1">
          {/* Mapa responsivo */}
          <div className="w-full sm:w-60 flex-shrink-0">
            <iframe
              title="Mapa"
              width="100%"
              height="120"
              className="rounded-md border border-white"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3455.201155968051!2d-53.812712184886595!3d-29.684047181997557!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94fee5e5f6f2b8e7%3A0x3a65f9f8f79997aa!2sRua%20Radialista%20Osvaldo%20Nobre%2C%20132%20-%20Juscelino%20Kubitschek%2C%20Santa%20Maria%20-%20RS%2C%2097035-000!5e0!3m2!1spt-BR!2sbr!4v1716264520972!5m2!1spt-BR!2sbr"
            />
          </div>

          {/* Endereço */}
          <div className="text-sm flex-1">
            <p className="font-bold text-yellow-300">COLÉGIO MILITAR DE SANTA MARIA</p>
            <p>Rua Radialista Osvaldo Nobre, Nº 1132 - Juscelino Kubitschek</p>
            <p>Santa Maria - RS, CEP: 97035-000</p>
          </div>
        </div>

        {/* Blocos Institucional e Contato */}
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Institucional */}
          <div className="text-sm">
            <p className="font-bold mb-1">Institucional</p>
            <ul>
              <li>Histórico da OM</li>
              <li>Legislação</li>
              <li>Projeto Pedagógico</li>
            </ul>
          </div>

          {/* Contato */}
          <div className="text-sm">
            <p className="font-bold mb-1">Contato</p>
            <ul>
              <li>Central de Atendimento</li>
              <li>Fale conosco</li>
              <li>Perguntas frequentes</li>
            </ul>
          </div>
        </div>

        {/* Botão Entrar */}
        <div className="text-sm text-center flex flex-col items-center flex-shrink-0">
          <p className="font-bold mb-2">INSTITUCIONAL</p>
          <button
            className="bg-yellow-400 text-black font-semibold px-6 py-2 rounded-full hover:bg-yellow-500 transition w-full sm:w-auto"
            onClick={() => router.push("/LoginAdm")}
          >
            ENTRAR
          </button>
        </div>
      </div>

      {/* Linha final separada */}
      <div className="bg-blue-950 text-center text-xs py-2 w-full">
        Desenvolvido por Soft line Sistemas
      </div>
    </footer>
  );
};

export default Footer;