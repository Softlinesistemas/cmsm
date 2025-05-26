'use client'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { useState } from 'react'
import { useRouter } from 'next/navigation'


export default function Formulario() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    nome: '',
    numeroInscricao: '',
    cpf: '',
    dataNascimento: '',
    sexo: '',
    cep: '',
    endereco: '',
    cidade: '',
    uf: '',
    complemento: '',
    necessidades: 'não',
    tipoNecessidade: '',
    atendimentoEspecial: 'não',
    tipoAtendimento: '',
    tipoCota: '',
    dadosVaga: '',
    nomeResponsavel: '',
    cpfResponsavel: '',
    dataNascimentoResponsavel: '',
    sexoResponsavel: '',
    cep_Resp: '',
    endereco_Resp: '',
    cidade_Resp: '',
    uf_Resp: '',
    complemento_Resp: '',
    profissao: '',
    celular: '',
    parentesco: '',
    forcas: 'não',
    emailResponsavel: '',
    emailCandidato: '',
    fotoPreview: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Enviado:', formData)
    router.push('/confirmacao')
  }

  const fetchAddress = async (cep: string, resp = false) => {
    const onlyNumbers = cep.replace(/\D/g, '')
    if (onlyNumbers.length !== 8) return
    try {
      const res = await fetch(`https://viacep.com.br/ws/${onlyNumbers}/json/`)
      const data = await res.json()
      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          ...(resp
            ? {
                cep_Resp: onlyNumbers,
                endereco_Resp: data.logradouro || '',
                complemento_Resp: data.complemento || '',
                cidade_Resp: data.localidade || '',
                uf_Resp: data.uf || ''
              }
            : {
                cep: onlyNumbers,
                endereco: data.logradouro || '',
                complemento: data.complemento || '',
                cidade: data.localidade || '',
                uf: data.uf || ''
              })
        }))
      }
    } catch (err) {
      console.error('Erro ao buscar CEP:', err)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />

      <main className="flex-grow px-4 py-8">
        <h2 className="text-2xl font-bold text-center text-green-900 mb-8">
          FORMULÁRIO DE INSCRIÇÃO
        </h2>

        <form
          onSubmit={handleSubmit}
          className="max-w-5xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden"
        >
          {/* TOPO: FOTO + NOME + Nº INSCRIÇÃO */}
          <div className="flex flex-col md:flex-row items-center gap-4 p-6 border-b border-gray-200">
            <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md relative overflow-hidden flex-shrink-0">
              <input
                type="file"
                accept="image/*"
                name="fotoCandidato"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const reader = new FileReader()
                    reader.onloadend = () =>
                      setFormData({ ...formData, fotoPreview: reader.result as string })
                    reader.readAsDataURL(file)
                  }
                }}
              />
              {formData.fotoPreview ? (
                <img src={formData.fotoPreview} className="w-full h-full object-cover" />
              ) : (
                <span className="block text-center text-gray-500 text-xs mt-8">
                  Adicionar Foto
                </span>
              )}
            </div>
            <div className="grid grid-cols-12 gap-4 flex-1">
              <input
                type="text"
                name="nome"
                placeholder="Nome do Candidato"
                value={formData.nome}
                onChange={handleChange}
                required
                className="col-span-12 md:col-span-8 border border-gray-300 rounded px-3 py-2 text-sm"
              />
              <input
                type="text"
                name="numeroInscricao"
                placeholder="Número de Inscrição"
                value={formData.numeroInscricao}
                onChange={handleChange}
                className="col-span-12 md:col-span-4 border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* DADOS DO CANDIDATO */}
            <div>
              <h3 className="text-blue-900 font-semibold border-b border-gray-200 pb-1 mb-4">
                Dados do Candidato
              </h3>
              <div className="grid grid-cols-12 gap-4">
                <input
                  type="text"
                  name="cpf"
                  placeholder="CPF"
                  value={formData.cpf}
                  onChange={handleChange}
                  required
                  className="col-span-12 md:col-span-4 border border-gray-300 rounded px-3 py-2 text-sm"
                />
                <input
                  type="date"
                  name="dataNascimento"
                  value={formData.dataNascimento}
                  onChange={handleChange}
                  className="col-span-12 md:col-span-4 border border-gray-300 rounded px-3 py-2 text-sm ">
                  </input>
                
                <select
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleChange}
                  className="col-span-12 md:col-span-4 border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value="">Sexo</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                </select>
                <input
                  type="text"
                  name="cep"
                  placeholder="CEP"
                  value={formData.cep}
                  onChange={handleChange}
                  onBlur={() => fetchAddress(formData.cep)}
                  className="col-span-12 sm:col-span-6 md:col-span-3 border border-gray-300 rounded px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  name="uf"
                  placeholder="UF"
                  value={formData.uf}
                  onChange={handleChange}
                  className="col-span-12 sm:col-span-6 md:col-span-3 border border-gray-300 rounded px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  name="cidade"
                  placeholder="Cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                  className="col-span-12 md:col-span-6 border border-gray-300 rounded px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  name="endereco"
                  placeholder="Endereço"
                  value={formData.endereco}
                  onChange={handleChange}
                  className="col-span-12 md:col-span-6 border border-gray-300 rounded px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  name="complemento"
                  placeholder="Complemento"
                  value={formData.complemento}
                  onChange={handleChange}
                  className="col-span-12 md:col-span-6 border border-gray-300 rounded px-3 py-2 text-sm"
                />
                <select
                  name="necessidades"
                  value={formData.necessidades}
                  onChange={handleChange}
                  className="col-span-12 sm:col-span-6 md:col-span-3 border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value="não">Necessidades Especiais?</option>
                  <option value="sim">Sim</option>
                </select>
                {formData.necessidades === 'sim' && (
                  <select
                    name="tipoNecessidade"
                    value={formData.tipoNecessidade}
                    onChange={handleChange}
                    required
                    className="col-span-12 sm:col-span-6 md:col-span-3 border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option value="">Tipo de Necessidade</option>
                    <option value="visual">Visual</option>
                    <option value="auditiva">Auditiva</option>
                    <option value="motora">Motora</option>
                    <option value="intelectual">Intelectual</option>
                    <option value="outra">Outra</option>
                  </select>
                )}
                <select
                  name="atendimentoEspecial"
                  value={formData.atendimentoEspecial}
                  onChange={handleChange}
                  className="col-span-12 sm:col-span-6 md:col-span-3 border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value="não">Atendimento Especial?</option>
                  <option value="sim">Sim</option>
                </select>
                {formData.atendimentoEspecial === 'sim' && (
                  <select
                    name="tipoAtendimento"
                    value={formData.tipoAtendimento}
                    onChange={handleChange}
                    required
                    className="col-span-12 sm:col-span-6 md:col-span-3 border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option value="">Tipo de Atendimento</option>
                    <option value="leitura">Leitura em voz alta</option>
                    <option value="tempo-extra">Tempo extra</option>
                    <option value="local-acessivel">Local acessível</option>
                    <option value="acompanhante">Acompanhante</option>
                    <option value="outro">Outro</option>
                  </select>
                )}
                <select
                  name="tipoCota"
                  value={formData.tipoCota}
                  onChange={handleChange}
                  className="col-span-12 md:col-span-4 border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value="">Tipo de Cota</option>
                  <option value="negra">Negra</option>
                  <option value="deficiencia">Deficiência</option>
                  <option value="publica">Escola Pública</option>
                </select>
              </div>
            </div>

            {/* DADOS DA VAGA */}
            <div>
              <h3 className="font-semibold border-b border-gray-200 pb-1 mb-4">
                Dados da Vaga
              </h3>
              <input
                type="text"
                name="dadosVaga"
                placeholder="Candidato capacitado para concorrer à vaga do 6º ano"
                value={formData.dadosVaga}
                onChange={handleChange}
                className="w-full bg-red-800 rounded px-8 py-5 shadown text-md text-center placeholder:text-white text-xl"
              />
            </div>

            {/* DADOS DO RESPONSÁVEL */}
            <div>
              <h3 className="text-green-900 font-semibold border-b border-gray-200 pb-1 mb-4">
                Dados do Responsável
              </h3>
              <div className="grid grid-cols-12 gap-4">
                <input
                  type="text"
                  name="nomeResponsavel"
                  placeholder="Nome"
                  value={formData.nomeResponsavel}
                  onChange={handleChange}
                  className="col-span-12 md:col-span-6 border border-gray-300 rounded px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  name="cpfResponsavel"
                  placeholder="CPF"
                  value={formData.cpfResponsavel}
                  onChange={handleChange}
                  className="col-span-12 md:col-span-6 border border-gray-300 rounded px-3 py-2 text-sm"
                />
                <input
                  type="date"
                  name="dataNascimentoResponsavel"
                  value={formData.dataNascimentoResponsavel}
                  onChange={handleChange}
                  className="col-span-12 md:col-span-4 border border-gray-300 rounded px-3 py-2 text-sm"
                />
                <select
                  name="sexoResponsavel"
                  value={formData.sexoResponsavel}
                  onChange={handleChange}
                  className="col-span-12 md:col-span-4 border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value="">Sexo</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                </select>
                <input
                  type="text"
                  name="profissao"
                  placeholder="Profissão"
                  value={formData.profissao}
                  onChange={handleChange}
                  className="col-span-12 md:col-span-4 border border-gray-300 rounded px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  name="cep_Resp"
                  placeholder="CEP"
                  value={formData.cep_Resp}
                  onChange={handleChange}
                  onBlur={() => fetchAddress(formData.cep_Resp, true)}
                  className="col-span-12 sm:col-span-6 md:col-span-3 border border-gray-300 rounded px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  name="uf_Resp"
                  placeholder="UF"
                  value={formData.uf_Resp}
                  onChange={handleChange}
                  className="col-span-12 sm:col-span-6 md:col-span-3 border border-gray-300 rounded px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  name="cidade_Resp"
                  placeholder="Cidade"
                  value={formData.cidade_Resp}
                  onChange={handleChange}
                  className="col-span-12 md:col-span-6 border border-gray-300 rounded px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  name="endereco_Resp"
                  placeholder="Endereço"
                  value={formData.endereco_Resp}
                  onChange={handleChange}
                  className="col-span-12 md:col-span-6 border border-gray-300 rounded px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  name="complemento_Resp"
                  placeholder="Complemento"
                  value={formData.complemento_Resp}
                  onChange={handleChange}
                  className="col-span-12 md:col-span-6 border border-gray-300 rounded px-3 py-2 text-sm"
                />
                <input
                  type="tel"
                  name="celular"
                  placeholder="Celular"
                  value={formData.celular}
                  onChange={handleChange}
                  className="col-span-12 md:col-span-6 border border-gray-300 rounded px-3 py-2 text-sm"
                />
                <select
                  name="parentesco"
                  value={formData.parentesco}
                  onChange={handleChange}
                  className="col-span-12 md:col-span-6 border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value="">Parentesco</option>
                  <option value="pai">Pai</option>
                  <option value="mae">Mãe</option>
                  <option value="responsável">Responsável</option>
                </select>
                <select
                  name="forcas"
                  value={formData.forcas}
                  onChange={handleChange}
                  className="col-span-12 md:col-span-4 border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value="">Forças Armadas?</option>
                  <option value="sim">Sim</option>
                  <option value="não">Não</option>
                </select>
                <input
                  type="email"
                  name="emailResponsavel"
                  placeholder="Email do responsável"
                  value={formData.emailResponsavel}
                  onChange={handleChange}
                  className="col-span-12 md:col-span-4 border border-gray-300 rounded px-3 py-2 text-sm"
                />
                <input
                  type="email"
                  name="emailCandidato"
                  placeholder="Email do candidato"
                  value={formData.emailCandidato}
                  onChange={handleChange}
                  className="col-span-12 md:col-span-4 border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-8 rounded transition"
              >
                ENVIAR
              </button>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  )
}
