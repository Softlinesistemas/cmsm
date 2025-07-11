'use client'
import React, { useState, useContext } from 'react'
import Header from '@/components/HeaderAdm'
import Sidebar from '@/components/Sidebar'
import Footer from '@/components/FooterAdm'
import api from '@/utils/api'
import { useQuery } from 'react-query'
import LoadingIcon from '@/components/common/LoadingIcon';
import Image from 'next/image'
import toast from 'react-hot-toast'

export default function AdminEditarCandidato() {
  const [busca, setBusca] = useState('')
  const [editando, setEditando] = useState(false)
  const [motivoAlteracao, setMotivoAlteracao] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const [podeEditarExtras, setPodeEditarExtras] = useState(true);

  const { data: cotas, isLoading, refetch } = useQuery('cotas', async () => {
    const response = await api.get('api/cotas')
    return response.data
  }, {
    refetchOnWindowFocus: false,
    retry: 5,
  });

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
      dadosVaga: '',
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
      fotoPreview: '',
      Seletivo: '',
      isencao: '',
      observacao: ''
    })

  // Busca candidato por nome, cpf ou inscrição
  async function handleBuscar() {
    if (!busca.trim()) {
      setErro('Digite nome, CPF ou número da inscrição para buscar')
      return
    }
    setErro('')
    setLoading(true)
    try {
      const response = await api.get(`/api/candidato/pesquisa?query=${encodeURIComponent(busca)}`)
    
      const data = response.data;
      if (data.length === 0) {
        setErro('Nenhum candidato encontrado.')
      } else {
        const candidato = data[0];
        populaForm(candidato); 
      }
    } catch (e: any) {
      setErro('Erro na busca: ' + e.message)
    } finally {
      setLoading(false)
      setEditando(false)
      setMotivoAlteracao('')
    }
  }

  function populaForm(candidate: any) {
    setFormData({
      nome: candidate.Nome ?? '',
      numeroInscricao: (candidate.CodIns != null ? String(candidate.CodIns) : ''),
      cpf: candidate.CPF ?? '',
      dataNascimento: candidate.Nasc ?? '',
      sexo: candidate.Sexo ?? '',
      cep: candidate.Cep ?? '',
      endereco: candidate.Endereco ?? '',
      cidade: candidate.Cidade ?? '',
      uf: candidate.UF ?? '',
      numero: candidate.Numero ?? '',
      complemento: candidate.Complemento ?? '',
      necessidades: candidate.PortadorNec ?? '',
      tipoNecessidade: candidate.TipoNecessidade ?? '',
      transtornoFuncional: candidate.TranstornoFuncional ?? '',
      transtornoTipos: candidate.TranstornoTipos ?? [],
      atendimentoEspecial: candidate.AtendimentoEsp ?? '',
      tipoAtendimento: candidate.TipoAtendimento ?? '',
      tipoCota: candidate.CodCot1 ?? '',
      necessitaCondicoes: candidate.NecessitaCondicoes ?? '',
      tipoAtendimentoProva: candidate.TipoAtendimentoProva ?? '',
      forcas: candidate.Forcas ?? '',
      ramoForcas: candidate.RamoForcas ?? '',
      dadosVaga: candidate.DadosVaga ?? '',
      nomeResponsavel: candidate.Responsavel ?? '',
      cpfResponsavel: candidate.CPFResp ?? '',
      dataNascimentoResponsavel: candidate.NascResp ?? '',
      sexoResponsavel: candidate.SexoResp ?? '',
      cep_Resp: candidate.CepResp ?? '',
      endereco_Resp: candidate.EnderecoResp ?? '',
      cidade_Resp: candidate.CidadeResp ?? '',
      uf_Resp: candidate.UFResp ?? '',
      numero_Resp: candidate.NumeroResp ?? '',
      complemento_Resp: candidate.ComplementoResp ?? '',
      profissao: candidate.ProfissaoResp ?? '',
      celular: candidate.TelResp ?? '',
      parentesco: candidate.Parentesco ?? '',
      emailResponsavel: candidate.EmailResp ?? '',
      emailCandidato: candidate.Email ?? '',
      fotoPreview: candidate.CaminhoFoto ?? '',
      Seletivo: candidate.Seletivo ?? '',
      isencao: candidate.isencao ?? '',
      observacao: candidate.observacao ?? '',
    });
  }

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

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();
    setErro('');

    if (!motivoAlteracao.trim()) {
      toast.error('Informe o motivo da alteração.')
      setErro('Informe o motivo da alteração.');
      return;
    }
    
    if (!formData) {
      toast.error('Nenhum candidato selecionado para salvar.')
      setErro('Nenhum candidato selecionado para salvar.');
      return;
    }

     const payload = {
        CodIns: Number(formData.numeroInscricao),
        Nome: formData.nome,
        CPF: formData.cpf,
        Nasc: formData.dataNascimento || null,
        Sexo: formData.sexo || null,
        Cep: formData.cep || null,
        Endereco: formData.endereco || null,
        Complemento: formData.complemento || null,
        Bairro: null,
        Cidade: formData.cidade || null,
        UF: formData.uf || null,
        CodCot1: formData?.tipoCota || null,
        CodCot2: null,
        CodCot3: null,
        CodCot4: null,
        CodCot5: null,
        CodCot6: null,
        CodCot7: null,
        CodCot8: null,
        CodCot9: null,
        CodCot10: null,
        PortadorNec: formData.necessidades || null,
        AtendimentoEsp: formData.atendimentoEspecial || null,
        Responsavel: formData.nomeResponsavel || null,
        CPFResp: formData.cpfResponsavel || null,
        NascResp: formData.dataNascimentoResponsavel || null,
        SexoResp: formData.sexoResponsavel || null,
        CepResp: formData.cep_Resp || null,
        EnderecoResp: formData.endereco_Resp || null,
        ComplementoResp: formData.complemento_Resp || null,
        BairroResp: null,
        CidadeResp: formData.cidade_Resp || null,
        UFResp: formData.uf_Resp || null,
        ProfissaoResp: formData.profissao || null,
        EmailResp: formData.emailResponsavel || null,
        TelResp: formData.celular || null,
        Parentesco: formData.parentesco || null,
        Email: formData.emailCandidato || null,
        CaminhoFoto: formData.fotoPreview || null,
        Seletivo: formData.Seletivo,
        isencao:  formData.isencao,
        observacao:  formData.observacao,
  
        // Campos nulos:
        DataCad: null, // backend
        HoraCad: null, // backend
        RegistroGRU: null,
        GRUData: null,
        GRUValor: null,
        GRUHora: null,
        CodSala: null,
        DataEnsalamento: null,
        HoraEnsalamento: null,
        CodUsuEnsalamento: null,
        Status: null,
        CaminhoResposta: null,
        CaminhoRedacao: null,
        RevisaoGabarito: null,
        DataImportacao: null,
        HoraImportacao: null,
        CodUsuImportacao: null,
        NotaMatematica: null,
        NotaPortugues: null,
        NotaRedacao: null,
        DataRevisao: null,
        CodUsuRev: null,
      };

    try {
      setLoading(true);
      const res = await api.put(`api/candidato/${formData?.numeroInscricao}`, {
        ...payload,
        motivoAlteracao,
      });

      toast.success('Alterações salvas com sucesso!');
      setEditando(false);
      setMotivoAlteracao('');
    } catch (err: any) {
      // err.response.data ou err.message, conforme sua API
      const msg =
        err.response?.data?.message ||
        err.response?.statusText ||
        err.message ||
        'Erro desconhecido';
      toast.error(msg);
      // setErro('Erro ao salvar: ' + msg);
    } finally {
      setLoading(false);
    }
  }


  const einCpfMask = (value: string) => {
    let cleaned = value.replace(/\D/g, "");

    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
    if (cleaned.length <= 9) return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`;
  };

  const phoneMask = (value: string) => {
    let cleaned = value.replace(/\D/g, "");
    
    if (cleaned.length === 0) return "";
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    if (cleaned.length <= 10) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
  };

   const cepMask = (value: string) => {
    let cleaned = value.replace(/\D/g, "");

    if (cleaned.length <= 5) return cleaned;
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 8)}`; 
   };

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
    <div className="flex flex-col min-h-fu bg-gray-100">
      {/* Header fixo no topo */}
      <Header />

      {/* Container principal: sidebar + conteúdo */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar: ocupa largura fixa e altura 100vh, fixo */}
        <aside className="hidden h-fit rounded-r-lg md:flex md:flex-col md:w-64 bg-white border-r border-gray-200">
          <Sidebar />
        </aside>

        {/* Conteúdo principal: ocupa restante do espaço, scroll vertical */}
        <main className="flex-1 overflow-auto p-6 max-w-4xl mx-auto w-full">
          <h1 className="text-3xl font-bold mb-6 text-blue-800">Editar Candidato</h1>

          {/* Campo de busca */}
          <div className="mb-8">
            <label htmlFor="busca" className="block font-semibold text-blue-700 mb-2">
              Buscar por nome, CPF ou número da inscrição:
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id="busca"
                type="text"
                value={busca}
                onChange={e => setBusca(e.target.value)}
                className="flex-grow border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Digite para buscar..."
                onKeyDown={e => e.key === 'Enter' && handleBuscar()}
                disabled={loading}
              />
              <button
                onClick={handleBuscar}
                disabled={loading}
                className="bg-blue-800 text-white px-5 py-2 rounded hover:bg-blue-900 disabled:opacity-50 transition"
              >
                {loading ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
            {erro && <p className="text-red-600 mt-2 font-medium">{erro}</p>}
          </div>

          {/* Formulário de edição */}
          {formData?.numeroInscricao && (
            <form
              onSubmit={handleSalvar}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-6"
            >
              {/* Número da inscrição - somente leitura */}
              <div className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-12 md:col-span-2">
                  <label className="text-blue-800 font-medium mb-1 block">Foto</label>
                  <div className="w-24 h-24 border-2 border-dashed border-blue-300 rounded-md relative">
                    <Image src="/api/candidato/foto" fill alt='Foto do candidato' className="w-full h-full object-cover" unoptimized/>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className="text-blue-800 font-medium mb-1 block">Nome do Candidato</label>
                  <input name="nome" value={formData?.nome} onChange={handleChange} required className={baseInput}  />
                </div>
                <div className="col-span-12 md:col-span-3">
                    <label className="block text-blue-800 font-medium mb-1">Vaga</label>
                    <select
                      name="Seletivo"
                      value={formData?.Seletivo}
                      onChange={handleChange}
                      required
                      className={`${baseInput}`}
                    >
                      <option value="">Selecione a vaga</option>
                      <option value="6° ano">6° ano</option>
                      <option value="1° ano">1° ano</option>
                    </select>
                  </div>
                <div className="col-span-12 md:col-span-3">
                  <label className="text-blue-800 font-medium mb-1 block">Nº Inscrição</label>
                  <input name="numeroInscricao" value={formData?.numeroInscricao} onChange={handleChange} className={baseInput} readOnly disabled/>
                </div>
              </div>

              {/* DADOS DO CANDIDATO */}
              <div className="space-y-4">
                <h3 className="text-blue-800 font-semibold border-b border-blue-200 pb-2">Dados do Candidato</h3>
                <div className="grid grid-cols-12 gap-4">
                  {/* Linha 1 */}
                  <div className="col-span-12 md:col-span-4">
                    <label className="block text-blue-800 font-medium mb-1">CPF</label>
                    <input maxLength={14} value={einCpfMask(formData?.cpf || "")} name="cpf" onChange={handleChange} required className={baseInput}  />
                  </div>
                  <div className="col-span-12 md:col-span-4">
                    <label className="block text-blue-800 font-medium mb-1">Data de Nasc.</label>
                    <input type="date" name="dataNascimento" value={formData?.dataNascimento} onChange={handleChange} className={baseInput}  />
                  </div>
                  <div className="col-span-12 md:col-span-4">
                    <label className="block text-blue-800 font-medium mb-1">Sexo</label>
                    <select name="sexo" value={formData?.sexo} onChange={handleChange} className={baseInput}>
                      <option value="">Selecione</option>
                      <option value="masculino">Masculino</option>
                      <option value="feminino">Feminino</option>
                    </select>
                  </div>
                  {/* Linha 2 */}
                  <div className="col-span-12 md:col-span-3">
                    <label className="block text-blue-800 font-medium mb-1">CEP</label>
                    <input name="cep" value={cepMask(formData?.cep)} onChange={handleChange} onBlur={() => fetchAddress(formData?.cep)} className={baseInput}  />
                  </div>
                  <div className="col-span-12 md:col-span-3">
                    <label className="block text-blue-800 font-medium mb-1">UF</label>
                    <select
                      name="uf"
                      value={formData?.uf}
                      onChange={handleChange}
                      required
                      className={`${baseInput}`}
                    >
                      <option value="">Selecione o estado</option>
                      <option value="AC">Acre</option>
                      <option value="AL">Alagoas</option>
                      <option value="AP">Amapá</option>
                      <option value="AM">Amazonas</option>
                      <option value="BA">Bahia</option>
                      <option value="CE">Ceará</option>
                      <option value="DF">Distrito Federal</option>
                      <option value="ES">Espírito Santo</option>
                      <option value="GO">Goiás</option>
                      <option value="MA">Maranhão</option>
                      <option value="MT">Mato Grosso</option>
                      <option value="MS">Mato Grosso do Sul</option>
                      <option value="MG">Minas Gerais</option>
                      <option value="PA">Pará</option>
                      <option value="PB">Paraíba</option>
                      <option value="PR">Paraná</option>
                      <option value="PE">Pernambuco</option>
                      <option value="PI">Piauí</option>
                      <option value="RJ">Rio de Janeiro</option>
                      <option value="RN">Rio Grande do Norte</option>
                      <option value="RS">Rio Grande do Sul</option>
                      <option value="RO">Rondônia</option>
                      <option value="RR">Roraima</option>
                      <option value="SC">Santa Catarina</option>
                      <option value="SP">São Paulo</option>
                      <option value="SE">Sergipe</option>
                      <option value="TO">Tocantins</option>
                    </select>
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <label className="block text-blue-800 font-medium mb-1">Cidade</label>
                    <input name="cidade" value={formData?.cidade} onChange={handleChange} className={baseInput}  />
                  </div>
                  {/* Linha 3 */}
                  <div className="col-span-12 md:col-span-8">
                    <label className="block text-blue-800 font-medium mb-1">Endereço</label>
                    <input name="endereco" value={formData?.endereco} onChange={handleChange} className={baseInput}  />
                  </div>
                  <div className="col-span-6 md:col-span-2">
                    <label className="block text-blue-800 font-medium mb-1">Número</label>
                    <input name="numero" value={formData?.numero} onChange={handleChange} className={baseInput} maxLength={6} />
                  </div>
                  <div className="col-span-6 md:col-span-2">
                    <label className="block text-blue-800 font-medium mb-1">Complemento</label>
                    <input name="complemento" value={formData?.complemento} onChange={handleChange} className={baseInput}  />
                  </div>
                </div>
              </div>

              {/* BLOCOS SIM/NAO organizados em grid 2-3 colunas */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Necessidades */}
                  <div>
                    <label className="text-blue-800 font-medium mb-1 block">Necessidades Especiais?</label>
                    <select name="necessidades" value={formData?.necessidades} onChange={handleChange} className={baseInput}>
                      <option value="">Não</option>
                      <option value="X">Sim</option>
                    </select>
                    {formData?.necessidades === 'X' && (
                      <select name="tipoNecessidade" value={formData?.tipoNecessidade} onChange={handleChange} required className={`${baseInput} mt-2`}>
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
                    <select name="transtornoFuncional" value={formData?.transtornoFuncional} onChange={handleChange} className={baseInput}>
                      <option value="">Não</option>
                      <option value="X">Sim</option>
                    </select>
                    {formData?.transtornoFuncional === 'X' && (
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
                    <select name="atendimentoEspecial" value={formData?.atendimentoEspecial} onChange={handleChange} className={baseInput}>
                      <option value="">Não</option>
                      <option value="X">Sim</option>
                    </select>
                    {formData?.atendimentoEspecial === 'X' && (
                      <select name="tipoAtendimento" value={formData?.tipoAtendimento} onChange={handleChange} required className={`${baseInput} mt-2`}>
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
                      value={formData?.tipoCota}
                      onChange={handleChange}
                      disabled={!podeEditarExtras}
                      className={`${baseInput} ${!podeEditarExtras ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    >
                      <option value="">Selecione</option>

                      {cotas
                        ?.filter((cota: any) => cota.Status === 'Ativo')
                        .map((cota: any) => (
                          <option key={cota.id} value={cota.id}>
                            {cota.Descricao}
                          </option>
                      ))}
                    </select>
                  </div>

                  {/* Condições na Prova */}
                  <div>
                    <label className="text-blue-800 font-medium mb-1 block">Condições Especiais na Prova?</label>
                    <select
                      name="necessitaCondicoes"
                      value={formData?.necessitaCondicoes}
                      onChange={handleChange}
                      disabled={!podeEditarExtras}
                      className={`${baseInput} ${!podeEditarExtras ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    >
                      <option value="">Selecione</option>
                      <option value="">Não</option>
                      <option value="X">Sim</option>
                    </select>
                    {formData?.necessitaCondicoes === 'X' && (
                      <select name="tipoAtendimentoProva" value={formData?.tipoAtendimentoProva} onChange={handleChange} required className={`${baseInput} mt-2`}>
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
                  placeholder="Candidato capacitado para realizar o exame intelectual"
                  value={formData?.dadosVaga}
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
                    <input name="nomeResponsavel" value={formData?.nomeResponsavel} onChange={handleChange} className={baseInput}  />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <label className="block text-blue-800 font-medium mb-1">CPF</label>
                    <input maxLength={14} name="cpfResponsavel" value={einCpfMask(formData?.cpfResponsavel || "")} onChange={handleChange} className={baseInput}  />
                  </div>
                  <div className="col-span-12 md:col-span-4">
                    <label className="block text-blue-800 font-medium mb-1">Data de Nasc.</label>
                    <input type="date" name="dataNascimentoResponsavel" value={formData?.dataNascimentoResponsavel} onChange={handleChange} className={baseInput}  />
                  </div>
                  <div className="col-span-12 md:col-span-4">
                    <label className="block text-blue-800 font-medium mb-1">Sexo</label>
                    <select name="sexoResponsavel" value={formData?.sexoResponsavel} onChange={handleChange} className={baseInput}>
                      <option value="">Selecione</option>
                      <option value="masculino">Masculino</option>
                      <option value="feminino">Feminino</option>
                    </select>
                  </div>
                  <div className="col-span-12 md:col-span-4">
                    <label className="block text-blue-800 font-medium mb-1">Profissão</label>
                    <input name="profissao" value={formData?.profissao} onChange={handleChange} className={baseInput}  />
                  </div>

                  {/* Endereço Responsável */}
                  <div className="col-span-12 md:col-span-3">
                    <label className="block text-blue-800 font-medium mb-1">CEP</label>
                    <input name="cep_Resp" value={formData?.cep_Resp} onChange={handleChange} onBlur={() => fetchAddress(formData?.cep_Resp, true)} className={baseInput}  />
                  </div>
                  <div className="col-span-12 md:col-span-3">
                    <label className="block text-blue-800 font-medium mb-1">UF</label>
                    <select
                      name="uf_Resp"
                      value={formData?.uf_Resp}
                      onChange={handleChange}
                      required
                      className={`${baseInput}`}
                    >
                      <option value="">Selecione o estado</option>
                      <option value="AC">Acre</option>
                      <option value="AL">Alagoas</option>
                      <option value="AP">Amapá</option>
                      <option value="AM">Amazonas</option>
                      <option value="BA">Bahia</option>
                      <option value="CE">Ceará</option>
                      <option value="DF">Distrito Federal</option>
                      <option value="ES">Espírito Santo</option>
                      <option value="GO">Goiás</option>
                      <option value="MA">Maranhão</option>
                      <option value="MT">Mato Grosso</option>
                      <option value="MS">Mato Grosso do Sul</option>
                      <option value="MG">Minas Gerais</option>
                      <option value="PA">Pará</option>
                      <option value="PB">Paraíba</option>
                      <option value="PR">Paraná</option>
                      <option value="PE">Pernambuco</option>
                      <option value="PI">Piauí</option>
                      <option value="RJ">Rio de Janeiro</option>
                      <option value="RN">Rio Grande do Norte</option>
                      <option value="RS">Rio Grande do Sul</option>
                      <option value="RO">Rondônia</option>
                      <option value="RR">Roraima</option>
                      <option value="SC">Santa Catarina</option>
                      <option value="SP">São Paulo</option>
                      <option value="SE">Sergipe</option>
                      <option value="TO">Tocantins</option>
                    </select>
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <label className="block text-blue-800 font-medium mb-1">Cidade</label>
                    <input name="cidade_Resp" value={formData?.cidade_Resp} onChange={handleChange} className={baseInput}  />
                  </div>
                  <div className="col-span-12 md:col-span-8">
                    <label className="block text-blue-800 font-medium mb-1">Endereço</label>
                    <input name="endereco_Resp" value={formData?.endereco_Resp} onChange={handleChange} className={baseInput}  />
                  </div>
                  <div className="col-span-6 md:col-span-2">
                    <label className="block text-blue-800 font-medium mb-1">Número</label>
                    <input name="numero_Resp" value={formData?.numero_Resp} onChange={handleChange} className={baseInput}  />
                  </div>
                  <div className="col-span-6 md:col-span-2">
                    <label className="block text-blue-800 font-medium mb-1">Complemento</label>
                    <input name="complemento_Resp" value={formData?.complemento_Resp} onChange={handleChange} className={baseInput}  />
                  </div>

                  <div className="col-span-12 md:col-span-4">
                    <label className="block text-blue-800 font-medium mb-1">Celular</label>
                    <input type="tel" name="celular"  placeholder="(99) 99999-9999" value={phoneMask(formData?.celular)} onChange={handleChange} className={baseInput}  />
                  </div>
                  <div className="col-span-12 md:col-span-4">
                    <label className="block text-blue-800 font-medium mb-1">Parentesco</label>
                    <select name="parentesco" value={formData?.parentesco} onChange={handleChange} className={baseInput}>
                      <option value="">Selecione</option>
                      <option value="pai">Pai</option>
                      <option value="mãe">Mãe</option>
                      <option value="responsável">Responsável</option>
                    </select>
                  </div>
                  {/* Forças Armadas */}
                  <div className="col-span-12 md:col-span-4">
                    <label className="text-blue-800 font-medium mb-1 block">Forças Armadas?</label>
                    <select name="forcas" value={formData?.forcas} onChange={handleChange} className={baseInput} >
                      <option value="">Não</option>
                      <option value="X">Sim</option>
                    </select>
                    {formData?.forcas === 'X' && (
                      <select name="ramoForcas" value={formData?.ramoForcas} onChange={handleChange} required className={`${baseInput} mt-2`}>
                        <option value="">Ramo das Forças</option>
                        <option value="exercito">Exército</option>
                        <option value="marinha">Marinha</option>
                        <option value="aeronautica">Aeronáutica</option>
                      </select>
                    )}
                  </div>


                  <div className="col-span-12 md:col-span-4">
                    <label className="block text-blue-800 font-medium mb-1">Email Responsavel</label>
                    <input type="email" name="emailResponsavel" value={formData?.emailResponsavel} onChange={handleChange} className={baseInput}  />
                  </div>
                  <div className="col-span-12 md:col-span-4">
                    <label className="block text-blue-800 font-medium mb-1">Email Candidato</label>
                    <input type="email" name="emailCandidato" value={formData?.emailCandidato} onChange={handleChange} className={baseInput}  />
                  </div>
                </div>
              </div>

              {/* BOTÃO */}
              <div className="text-center flex flex-col gap-2 w-full">
                 <div className="col-span-12 md:col-span-4">
                    <label className="block text-blue-800 font-medium mb-1">Motivo da alteração</label>
                    <input type="text" value={motivoAlteracao} onChange={(e: any) => setMotivoAlteracao(e.target.value)} className={baseInput}  />
                  </div>
                <button disabled={loading} type="submit" className="bg-blue-800 hover:bg-blue-900 text-white font-semibold py-3 px-8 rounded">
                  {loading ? <LoadingIcon /> :"Atualizar"}
                </button>               
              </div>
            </form>
          )}
        </main>
      </div>

      {/* Footer fixo no final */}
      <Footer />
    </div>
  )
}
