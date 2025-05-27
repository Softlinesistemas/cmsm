'use client'

import Header from '../../components/HeaderAdm'
import Footer from '../../components/FooterAdm'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Formulario() {
  const router = useRouter()
  const dataLimiteEdicao = new Date('2025-06-01')
  const [podeEditarExtras, setPodeEditarExtras] = useState(true)

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
    numero: '',
    complemento: '',
    necessidades: '',
    tipoNecessidade: '',
    transtornoFuncional: '',
    transtornoTipos: [] as string[],
    atendimentoEspecial: '',
    tipoAtendimento: '',
    tipoCota: '',
    necessitaCondicoes: '',
    tipoAtendimentoProva: '',
    forcas: '',
    ramoForcas: '',
    dadosVaga: 'Candidato Apto para realizar a prova do 6° ano',
    nomeResponsavel: '',
    cpfResponsavel: '',
    dataNascimentoResponsavel: '',
    sexoResponsavel: '',
    cep_Resp: '',
    endereco_Resp: '',
    cidade_Resp: '',
    uf_Resp: '',
    numero_Resp: '',
    complemento_Resp: '',
    profissao: '',
    celular: '',
    parentesco: '',
    emailResponsavel: '',
    emailCandidato: '',
    fotoPreview: ''
  })

  useEffect(() => {
    setPodeEditarExtras(new Date() <= dataLimiteEdicao)
  }, [])

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type, checked } = e.target
    if (name === 'transtornoTipos') {
      setFormData(prev => {
        const list = prev.transtornoTipos.includes(value)
          ? prev.transtornoTipos.filter(v => v !== value)
          : [...prev.transtornoTipos, value]
        return { ...prev, transtornoTipos: list }
      })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(formData)
    router.push('/confirmacao')
  }

  const fetchAddress = async (cep: string, resp = false) => {
    const num = cep.replace(/\D/g, '')
    if (num.length !== 8) return
    try {
      const res = await fetch(`https://viacep.com.br/ws/${num}/json/`)
      const data = await res.json()
      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          ...(resp
            ? {
              cep_Resp: num,
              endereco_Resp: data.logradouro || '',
              complemento_Resp: data.complemento || '',
              cidade_Resp: data.localidade || '',
              uf_Resp: data.uf || ''
            }
            : {
              cep: num,
              endereco: data.logradouro || '',
              complemento: data.complemento || '',
              cidade: data.localidade || '',
              uf: data.uf || ''
            })
        }))
      }
    } catch { }
  }

  const baseInput = `
    w-full bg-white text-gray-900 border border-blue-300 rounded px-3 py-2 text-sm
    focus:outline-none focus:ring focus:ring-blue-100 focus:border-blue-600
  `

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow px-4 py-8">
        <h2 className="text-2xl font-bold text-center text-blue-800 mb-8">
          FORMULÁRIO DE INSCRIÇÃO
        </h2>
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white shadow rounded-lg p-6 space-y-8">

          {/* FOTO + NOME + Nº INSCRIÇÃO */}
          <div className="grid grid-cols-12 gap-4 items-end">
            <div className="col-span-12 md:col-span-2">
              <label className="text-blue-800 font-medium mb-1 block">Foto</label>
              <div className="w-24 h-24 border-2 border-dashed border-blue-300 rounded-md relative">
                <input
                  type="file"
                  name="fotoCandidato"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={e => {
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
                  <span className="absolute inset-0 flex items-center justify-center text-blue-300 text-xs">
                    Adicionar
                  </span>
                )}
              </div>
            </div>
            <div className="col-span-12 md:col-span-7">
              <label className="text-blue-800 font-medium mb-1 block">Nome do Candidato</label>
              <input name="nome" value={formData.nome} onChange={handleChange} required className={baseInput}  readOnly/>
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className="text-blue-800 font-medium mb-1 block">Nº Inscrição</label>
              <input name="numeroInscricao" value={formData.numeroInscricao} onChange={handleChange} className={baseInput}  readOnly/>
            </div>
          </div>

          {/* DADOS DO CANDIDATO */}
          <div className="space-y-4">
            <h3 className="text-blue-800 font-semibold border-b border-blue-200 pb-2">Dados do Candidato</h3>
            <div className="grid grid-cols-12 gap-4">
              {/* Linha 1 */}
              <div className="col-span-12 md:col-span-4">
                <label className="block text-blue-800 font-medium mb-1">CPF</label>
                <input name="cpf" value={formData.cpf} onChange={handleChange} required className={baseInput}  readOnly/>
              </div>
              <div className="col-span-12 md:col-span-4">
                <label className="block text-blue-800 font-medium mb-1">Data de Nasc.</label>
                <input type="date" name="dataNascimento" value={formData.dataNascimento} onChange={handleChange} className={baseInput}  readOnly/>
              </div>
              <div className="col-span-12 md:col-span-4">
                <label className="block text-blue-800 font-medium mb-1">Sexo</label>
                <select name="sexo" value={formData.sexo} onChange={handleChange} className={baseInput}>
                  <option value="">Selecione</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                </select>
              </div>
              {/* Linha 2 */}
              <div className="col-span-12 md:col-span-3">
                <label className="block text-blue-800 font-medium mb-1">CEP</label>
                <input name="cep" value={formData.cep} onChange={handleChange} onBlur={() => fetchAddress(formData.cep)} className={baseInput}  readOnly/>
              </div>
              <div className="col-span-12 md:col-span-3">
                <label className="block text-blue-800 font-medium mb-1">UF</label>
                <input name="uf" value={formData.uf} onChange={handleChange} className={baseInput}  readOnly/>
              </div>
              <div className="col-span-12 md:col-span-6">
                <label className="block text-blue-800 font-medium mb-1">Cidade</label>
                <input name="cidade" value={formData.cidade} onChange={handleChange} className={baseInput}  readOnly/>
              </div>
              {/* Linha 3 */}
              <div className="col-span-12 md:col-span-8">
                <label className="block text-blue-800 font-medium mb-1">Endereço</label>
                <input name="endereco" value={formData.endereco} onChange={handleChange} className={baseInput}  readOnly/>
              </div>
              <div className="col-span-6 md:col-span-2">
                <label className="block text-blue-800 font-medium mb-1">Número</label>
                <input name="numero" value={formData.numero} onChange={handleChange} className={baseInput}  readOnly/>
              </div>
              <div className="col-span-6 md:col-span-2">
                <label className="block text-blue-800 font-medium mb-1">Complemento</label>
                <input name="complemento" value={formData.complemento} onChange={handleChange} className={baseInput}  readOnly/>
              </div>
            </div>
          </div>

          {/* BLOCOS SIM/NAO organizados em grid 2-3 colunas */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Necessidades */}
              <div>
                <label className="text-blue-800 font-medium mb-1 block">Necessidades Especiais?</label>
                <select name="necessidades" value={formData.necessidades} onChange={handleChange} className={baseInput}>
                  <option value="">Selecione</option>
                  <option value="não">Não</option>
                  <option value="sim">Sim</option>
                </select>
                {formData.necessidades === 'sim' && (
                  <select name="tipoNecessidade" value={formData.tipoNecessidade} onChange={handleChange} required className={`${baseInput} mt-2`}>
                    <option value="">Tipo de Necessidade</option>
                    <option value="visual">Visual</option>
                    <option value="auditiva">Auditiva</option>
                    <option value="motora">Motora</option>
                    <option value="intelectual">Intelectual</option>
                    <option value="outra">Outra</option>
                  </select>
                )}
              </div>

              {/* Transtorno Funcional */}
              <div>
                <label className="text-blue-800 font-medium mb-1 block">Transtorno Funcional?</label>
                <select name="transtornoFuncional" value={formData.transtornoFuncional} onChange={handleChange} className={baseInput}>
                  <option value="">Selecione</option>
                  <option value="não">Não</option>
                  <option value="sim">Sim</option>
                </select>
                {formData.transtornoFuncional === 'sim' && (
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    {['TDA', 'TDAH', 'TOD', 'DISLEXIA', 'DISCALCULIA', 'OUTROS'].map(tipo => (
                      <label key={tipo} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          name="transtornoTipos"
                          value={tipo}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        {tipo}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Atendimento Especial */}
              <div>
                <label className="text-blue-800 font-medium mb-1 block">Atendimento Especial?</label>
                <select name="atendimentoEspecial" value={formData.atendimentoEspecial} onChange={handleChange} className={baseInput}>
                  <option value="">Selecione</option>
                  <option value="não">Não</option>
                  <option value="sim">Sim</option>
                </select>
                {formData.atendimentoEspecial === 'sim' && (
                  <select name="tipoAtendimento" value={formData.tipoAtendimento} onChange={handleChange} required className={`${baseInput} mt-2`}>
                    <option value="">Tipo de Atendimento</option>
                    <option value="leitura">Leitura em voz alta</option>
                    <option value="tempo-extra">Tempo extra</option>
                    <option value="local-acessivel">Local acessível</option>
                    <option value="acompanhante">Acompanhante</option>
                    <option value="outro">Outro</option>
                  </select>
                )}
              </div>

              {/* Tipo de Cota */}
              <div>
                <label className="text-blue-800 font-medium mb-1 block">Tipo de Cota</label>
                <select
                  name="tipoCota"
                  value={formData.tipoCota}
                  onChange={handleChange}
                  disabled={!podeEditarExtras}
                  className={`${baseInput} ${!podeEditarExtras ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                >
                  <option value="">Selecione</option>
                  <option value="negra">Negra</option>
                  <option value="deficiência">Deficiência</option>
                  <option value="publica">Escola Pública</option>
                </select>
              </div>

              {/* Condições na Prova */}
              <div>
                <label className="text-blue-800 font-medium mb-1 block">Condições Especiais na Prova?</label>
                <select
                  name="necessitaCondicoes"
                  value={formData.necessitaCondicoes}
                  onChange={handleChange}
                  disabled={!podeEditarExtras}
                  className={`${baseInput} ${!podeEditarExtras ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                >
                  <option value="">Selecione</option>
                  <option value="não">Não</option>
                  <option value="sim">Sim</option>
                </select>
                {formData.necessitaCondicoes === 'sim' && (
                  <select name="tipoAtendimentoProva" value={formData.tipoAtendimentoProva} onChange={handleChange} required className={`${baseInput} mt-2`}>
                    <option value="">Tipo de Condição</option>
                    <option value="tempoExtra">Tempo Extra</option>
                    <option value="localAcessivel">Local Acessível</option>
                    <option value="acompanhante">Acompanhante</option>
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* DADOS DA VAGA - status automático */}
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
          <div className="space-y-4">
            <h3 className="text-blue-800 font-semibold border-b border-blue-200 pb-2">Dados do Responsável</h3>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-6">
                <label className="block text-blue-800 font-medium mb-1">Nome</label>
                <input name="nomeResponsavel" value={formData.nomeResponsavel} onChange={handleChange} className={baseInput}  readOnly/>
              </div>
              <div className="col-span-12 md:col-span-6">
                <label className="block text-blue-800 font-medium mb-1">CPF</label>
                <input name="cpfResponsavel" value={formData.cpfResponsavel} onChange={handleChange} className={baseInput}  readOnly/>
              </div>
              <div className="col-span-12 md:col-span-4">
                <label className="block text-blue-800 font-medium mb-1">Data de Nasc.</label>
                <input type="date" name="dataNascimentoResponsavel" value={formData.dataNascimentoResponsavel} onChange={handleChange} className={baseInput}  readOnly/>
              </div>
              <div className="col-span-12 md:col-span-4">
                <label className="block text-blue-800 font-medium mb-1">Sexo</label>
                <select name="sexoResponsavel" value={formData.sexoResponsavel} onChange={handleChange} className={baseInput}>
                  <option value="">Selecione</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                </select>
              </div>
              <div className="col-span-12 md:col-span-4">
                <label className="block text-blue-800 font-medium mb-1">Profissão</label>
                <input name="profissao" value={formData.profissao} onChange={handleChange} className={baseInput}  readOnly/>
              </div>

              {/* Endereço Responsável */}
              <div className="col-span-12 md:col-span-3">
                <label className="block text-blue-800 font-medium mb-1">CEP</label>
                <input name="cep_Resp" value={formData.cep_Resp} onChange={handleChange} onBlur={() => fetchAddress(formData.cep_Resp, true)} className={baseInput}  readOnly/>
              </div>
              <div className="col-span-12 md:col-span-3">
                <label className="block text-blue-800 font-medium mb-1">UF</label>
                <input name="uf_Resp" value={formData.uf_Resp} onChange={handleChange} className={baseInput}  readOnly/>
              </div>
              <div className="col-span-12 md:col-span-6">
                <label className="block text-blue-800 font-medium mb-1">Cidade</label>
                <input name="cidade_Resp" value={formData.cidade_Resp} onChange={handleChange} className={baseInput}  readOnly/>
              </div>
              <div className="col-span-12 md:col-span-8">
                <label className="block text-blue-800 font-medium mb-1">Endereço</label>
                <input name="endereco_Resp" value={formData.endereco_Resp} onChange={handleChange} className={baseInput}  readOnly/>
              </div>
              <div className="col-span-6 md:col-span-2">
                <label className="block text-blue-800 font-medium mb-1">Número</label>
                <input name="numero_Resp" value={formData.numero_Resp} onChange={handleChange} className={baseInput}  readOnly/>
              </div>
              <div className="col-span-6 md:col-span-2">
                <label className="block text-blue-800 font-medium mb-1">Complemento</label>
                <input name="complemento_Resp" value={formData.complemento_Resp} onChange={handleChange} className={baseInput}  readOnly/>
              </div>

              <div className="col-span-12 md:col-span-4">
                <label className="block text-blue-800 font-medium mb-1">Celular</label>
                <input type="tel" name="celular" value={formData.celular} onChange={handleChange} className={baseInput}  readOnly/>
              </div>
              <div className="col-span-12 md:col-span-4">
                <label className="block text-blue-800 font-medium mb-1">Parentesco</label>
                <select name="parentesco" value={formData.parentesco} onChange={handleChange} className={baseInput}>
                  <option value="">Selecione</option>
                  <option value="pai">Pai</option>
                  <option value="mãe">Mãe</option>
                  <option value="responsável">Responsável</option>
                </select>
              </div>
              {/* Forças Armadas */}
              <div className="col-span-12 md:col-span-4">
                <label className="text-blue-800 font-medium mb-1 block">Forças Armadas?</label>
                <select name="forcas" value={formData.forcas} onChange={handleChange} className={baseInput} >
                  <option value="">Selecione</option>
                  <option value="não">Não</option>
                  <option value="sim">Sim</option>
                </select>
                {formData.forcas === 'sim' && (
                  <select name="ramoForcas" value={formData.ramoForcas} onChange={handleChange} required className={`${baseInput} mt-2`}>
                    <option value="">Ramo das Forças</option>
                    <option value="exercito">Exército</option>
                    <option value="marinha">Marinha</option>
                    <option value="aeronautica">Aeronáutica</option>
                  </select>
                )}
              </div>


              <div className="col-span-12 md:col-span-4">
                <label className="block text-blue-800 font-medium mb-1">Email Responsavel</label>
                <input type="email" name="emailResponsavel" value={formData.emailResponsavel} onChange={handleChange} className={baseInput}  readOnly/>
              </div>
              <div className="col-span-12 md:col-span-4">
                <label className="block text-blue-800 font-medium mb-1">Email Candidato</label>
                <input type="email" name="emailCandidato" value={formData.emailCandidato} onChange={handleChange} className={baseInput}  readOnly/>
              </div>
            </div>
          </div>

          {/* BOTÃO */}
          <div className="text-center">
            <button type="submit" className="bg-blue-800 hover:bg-blue-900 text-white font-semibold py-3 px-8 rounded">
              ENVIAR
            </button>
          </div>

        </form>
      </main>
      <Footer />
    </div>
  )
}