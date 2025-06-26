'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Footer from '../../components/FooterAdm'
import Header from '../../components/HeaderAdm'
import { signIn, getSession } from "next-auth/react";
import { ripplesLoading } from '../../../public'
import Image from 'next/image'
import toast from 'react-hot-toast'

const LoadingImage = () => (
  <div className="flex justify-center items-center h-full">
    <Image className="w-6 h-w-6" src={ripplesLoading} alt="Loading..." />
  </div>
);


const login = () => {
  const [primeiroAcesso, setPrimeiroAcesso] = useState(false)
  const [loading, setLoading] = useState(false);
  const [cpf, setCpf] = useState('')
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handlePrimeiroAcesso = () => {
    router.push(`/cadColaborador/?cpf=${cpf}`)
  }

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      user,
      password,
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
      return;
    }

    const session = await getSession();
    toast.success("Login concluído, redirecionando...")
    
    if (session?.user?.admin) {
      router.push("/dashboard");
    } else {
      router.push("/acompanhamento");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <Header />

      <main className="flex flex-col items-center px-4 py-8">
        <div className="bg-blue-900 rounded-[60px] p-6 pt-10 pb-6 w-full max-w-xs flex flex-col items-center shadow-xl relative border-2 border-blue-300">
          <div className="w-[100px] h-[100px] bg-blue-900 border-4 border-blue-700 rounded-full absolute -top-10 flex items-center justify-center">
            <svg className="w-[60px] h-[60px] text-white shadow-xl" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14c4.418 0 8 1.79 8 4v2H4v-2c0-2.21 3.582-4 8-4zm0-2a4 4 0 100-8 4 4 0 000 8z" />
            </svg>
          </div>

          <div className="mt-12 w-full space-y-4">
            {!primeiroAcesso ? (
              <>
                <div className="flex items-center bg-blue-600 rounded-full px-4 py-2">
                  <span className="text-black mr-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 12H8m0 0l4-4m0 4l4 4" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="USUÁRIO"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    className="bg-transparent placeholder-gray-300 text-white text-sm w-full focus:outline-none"
                  />
                </div>
                <div className="flex items-center bg-blue-600 rounded-full px-4 py-2">
                  <span className="text-gray-300 mr-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.104 0 2 .896 2 2v2H10v-2c0-1.104.896-2 2-2zM6 12v2a6 6 0 0012 0v-2" />
                    </svg>
                  </span>
                  <input
                    type="password"
                    placeholder="SENHA"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-transparent placeholder-gray-300 text-white text-sm w-full focus:outline-none"
                  />
                </div>
              </>
            ) : (
              <div className="flex items-center bg-blue-600 rounded-full px-4 py-2">
                <span className="text-gray-300 mr-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.104 0 2 .896 2 2v2H10v-2c0-1.104.896-2 2-2z" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Digite seu CPF"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  className="bg-transparent placeholder-gray-300 text-white text-sm w-full focus:outline-none"
                />
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 text-sm text-red-300 text-center">
              {error}
            </div>
          )}

          <div className="mt-6 w-44">
            <button
              onClick={primeiroAcesso ? handlePrimeiroAcesso : handleLogin}
              className="bg-yellow-400 text-black font-bold py-2 px-6 rounded-full hover:bg-yellow-500 transition w-full text-center"
            >
              {loading ? LoadingImage() : primeiroAcesso ? 'CONTINUAR' : 'ENTRAR'}
            </button>
          </div>

          {/* <a href="/recuperarSenha" className="text-xs text-gray-300 mt-3 hover:underline">
            RECUPERAR SENHA
          </a> */}

          {/* <button
            onClick={() => setPrimeiroAcesso(!primeiroAcesso)}
            className="text-xs text-gray-300 mt-3 hover:underline"
          >
            {primeiroAcesso ? 'Voltar ao login' : 'Primeiro acesso'}
          </button> */}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default login
