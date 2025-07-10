'use client'
import LoadingIcon from '@/components/common/LoadingIcon'
import api from '@/utils/api'
import { useQuery } from 'react-query'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useSession } from 'next-auth/react'

const FormularioInscricao: React.FC<any> = ({ isAcompanhamento, primeiroCad, checkboxMarcado, setCheckboxMarcado, provisoryKey, loading, provisoryUser, paymentButton, podeEditarExtras, handleSubmit, setFormData, formData, handleChange }) => {
  const router = useRouter();
  const { data: session, status } = useSession();

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
    
    const { data: cotas, isLoading, refetch } = useQuery('cotas', async () => {
        const response = await api.get('api/cotas')
        return response.data
    }, {
      refetchOnWindowFocus: false,
      retry: 5,
    })

  const fetchAddress = async (cep: string, resp = false) => {
    const num = cep.replace(/\D/g, '')
    if (num.length !== 8) return
    try {
      const res = await fetch(`https://viacep.com.br/ws/${num}/json/`)
      const data = await res.json()
      if (!data.erro) {
        setFormData((prev: any) => ({
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
    <>
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white shadow rounded-lg p-6 space-y-8">

          {/* FOTO + NOME + Nº INSCRIÇÃO */}
          <div className="grid grid-cols-12 gap-4 items-end">
            <div className="col-span-12 md:col-span-2">
              <label className="text-blue-800 font-medium mb-1 block">Foto</label>
              <div className="w-24 h-24 border-2 border-dashed border-blue-300 rounded-md relative">
                <Image src="/api/candidato/foto" fill alt='Foto do candidato' className="w-full h-full object-cover" unoptimized />
              </div>
            </div>
            <div className="col-span-12 md:col-span-4">
              <label className="text-blue-800 font-medium mb-1 block">Nome do Candidato</label>
              <input name="nome" value={formData.nome} onChange={handleChange} required className={baseInput} disabled={isAcompanhamento} readOnly={isAcompanhamento}/>
            </div>
             <div className="col-span-12 md:col-span-3">
                <label className="block text-blue-800 font-medium mb-1">Vaga</label>
                <select
                  name="Seletivo"
                  value={formData.Seletivo}
                  disabled={isAcompanhamento}
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
              <input name="numeroInscricao" value={formData.numeroInscricao} onChange={handleChange} className={baseInput} readOnly disabled/>
            </div>
          </div>

          {/* DADOS DO CANDIDATO */}
          <div className="space-y-4">
            <h3 className="text-blue-800 font-semibold border-b border-blue-200 pb-2">Dados do Candidato</h3>
            <div className="grid grid-cols-12 gap-4">
              {/* Linha 1 */}
              <div className="col-span-12 md:col-span-4">
                <label className="block text-blue-800 font-medium mb-1">CPF</label>
                <input disabled={isAcompanhamento || session?.user?.cpf} readOnly={isAcompanhamento} maxLength={14} value={einCpfMask(formData.cpf || "")} name="cpf" onChange={handleChange} required className={baseInput}  />
              </div>
              <div className="col-span-12 md:col-span-4">
                <label className="block text-blue-800 font-medium mb-1">Data de Nasc.</label>
                <input disabled={isAcompanhamento} readOnly={isAcompanhamento} type="date" name="dataNascimento" value={formData.dataNascimento} onChange={handleChange} className={baseInput}  />
              </div>
              <div className="col-span-12 md:col-span-4">
                <label className="block text-blue-800 font-medium mb-1">Sexo</label>
                <select name="sexo" value={formData.sexo} onChange={handleChange} className={baseInput} disabled={isAcompanhamento}>
                  <option value="">{isAcompanhamento ? formData.sexo : "Selecione"}</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                </select>
              </div>
              {/* Linha 2 */}
              <div className="col-span-12 md:col-span-3">
                <label className="block text-blue-800 font-medium mb-1">CEP</label>
                <input name="cep" value={cepMask(formData.cep)} onChange={handleChange} onBlur={() => fetchAddress(formData.cep)} className={baseInput} disabled={isAcompanhamento} readOnly={isAcompanhamento} />
              </div>
              <div className="col-span-12 md:col-span-3">
                <label className="block text-blue-800 font-medium mb-1">UF</label>
                <select
                  disabled={isAcompanhamento}
                  name="uf"
                  value={formData.uf}
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
                <input name="cidade" value={formData.cidade} onChange={handleChange} className={baseInput} disabled={isAcompanhamento} readOnly={isAcompanhamento} />
              </div>
              {/* Linha 3 */}
              <div className="col-span-12 md:col-span-8">
                <label className="block text-blue-800 font-medium mb-1">Endereço</label>
                <input name="endereco" value={formData.endereco} onChange={handleChange} className={baseInput} disabled={isAcompanhamento} readOnly={isAcompanhamento} />
              </div>
              <div className="col-span-6 md:col-span-2">
                <label className="block text-blue-800 font-medium mb-1">Número</label>
                <input name="numero" value={formData.numero} onChange={handleChange} className={baseInput} maxLength={6} disabled={isAcompanhamento} readOnly={isAcompanhamento} />
              </div>
              <div className="col-span-6 md:col-span-2">
                <label className="block text-blue-800 font-medium mb-1">Complemento</label>
                <input name="complemento" value={formData.complemento} onChange={handleChange} className={baseInput} disabled={isAcompanhamento} readOnly={isAcompanhamento} />
              </div>
            </div>
          </div>

          {/* BLOCOS SIM/NAO organizados em grid 2-3 colunas */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Necessidades */}
              <div>
                <label className="text-blue-800 font-medium mb-1 block">Necessidades Especiais?</label>
                <select name="necessidades" value={formData.necessidades} onChange={handleChange} className={baseInput} disabled={isAcompanhamento}>
                  <option value="">Não</option>
                  <option value="X">Sim</option>
                </select>
                {formData.necessidades === 'X' && (
                  <select name="tipoNecessidade" value={formData.tipoNecessidade} onChange={handleChange} required className={`${baseInput} mt-2`} disabled={isAcompanhamento}>
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
                <select name="transtornoFuncional" value={formData.transtornoFuncional} onChange={handleChange} className={baseInput} disabled={isAcompanhamento}>
                  <option value="">Não</option>
                  <option value="X">Sim</option>
                </select>
                {formData.transtornoFuncional === 'X' && (
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
                <select name="atendimentoEspecial" value={formData.atendimentoEspecial} onChange={handleChange} className={baseInput} disabled={isAcompanhamento}>
                  <option value="">Não</option>
                  <option value="X">Sim</option>
                </select>
                {formData.atendimentoEspecial === 'X' && (
                  <select name="tipoAtendimento" value={formData.tipoAtendimento} onChange={handleChange} required className={`${baseInput} mt-2`} disabled={isAcompanhamento}>
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
                  disabled={!podeEditarExtras || isAcompanhamento}
                  className={`${baseInput} ${!podeEditarExtras ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                >
                  <option value="">{isAcompanhamento ? formData.tipoCota || "" : "Selecione"}</option>

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
              {!isAcompanhamento && <div>
                <label className="text-blue-800 font-medium mb-1 block">Condições Especiais na Prova?</label>
                <select
                  name="necessitaCondicoes"
                  value={formData.necessitaCondicoes}
                  onChange={handleChange}
                  disabled={!podeEditarExtras || isAcompanhamento}
                  className={`${baseInput} ${!podeEditarExtras ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                >
                  <option value="">Não</option>
                  <option value="X">Sim</option>
                </select>
                {formData.necessitaCondicoes === 'X' && (
                  <select name="tipoAtendimentoProva" value={formData.tipoAtendimentoProva} onChange={handleChange} required className={`${baseInput} mt-2`} disabled={isAcompanhamento}>
                    <option value="">Tipo de Condição</option>
                    <option value="tempoExtra">Tempo Extra</option>
                    <option value="localAcessivel">Local Acessível</option>
                    <option value="acompanhante">Acompanhante</option>  
                  </select>
                )}
              </div>}
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
              value={formData.dadosVaga}
              disabled={isAcompanhamento} 
              readOnly={isAcompanhamento}
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
                <input name="nomeResponsavel" value={formData.nomeResponsavel} onChange={handleChange} className={baseInput} disabled={isAcompanhamento} readOnly={isAcompanhamento} />
              </div>
              <div className="col-span-12 md:col-span-6">
                <label className="block text-blue-800 font-medium mb-1">CPF</label>
                <input maxLength={14} name="cpfResponsavel" value={einCpfMask(formData.cpfResponsavel || "")} onChange={handleChange} className={baseInput} disabled={isAcompanhamento} readOnly={isAcompanhamento} />
              </div>
              <div className="col-span-12 md:col-span-4">
                <label className="block text-blue-800 font-medium mb-1">Data de Nasc.</label>
                <input type="date" name="dataNascimentoResponsavel" value={formData.dataNascimentoResponsavel} onChange={handleChange} className={baseInput} disabled={isAcompanhamento} readOnly={isAcompanhamento} />
              </div>
              <div className="col-span-12 md:col-span-4">
                <label className="block text-blue-800 font-medium mb-1">Sexo</label>
                <select name="sexoResponsavel" value={formData.sexoResponsavel} onChange={handleChange} className={baseInput} disabled={isAcompanhamento}>
                  <option value="">Selecione</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                </select>
              </div>
              <div className="col-span-12 md:col-span-4">
                <label className="block text-blue-800 font-medium mb-1">Profissão</label>
                <input name="profissao" value={formData.profissao} onChange={handleChange} className={baseInput} disabled={isAcompanhamento} readOnly={isAcompanhamento} />
              </div>

              {/* Endereço Responsável */}
              <div className="col-span-12 md:col-span-3">
                <label className="block text-blue-800 font-medium mb-1">CEP</label>
                <input name="cep_Resp" value={formData.cep_Resp} onChange={handleChange} onBlur={() => fetchAddress(formData.cep_Resp, true)} className={baseInput} disabled={isAcompanhamento} readOnly={isAcompanhamento} />
              </div>
              <div className="col-span-12 md:col-span-3">
                <label className="block text-blue-800 font-medium mb-1">UF</label>
                <select
                  disabled={isAcompanhamento}
                  name="uf_Resp"
                  value={formData.uf_Resp}
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
                <input name="cidade_Resp" value={formData.cidade_Resp} onChange={handleChange} className={baseInput} disabled={isAcompanhamento} readOnly={isAcompanhamento} />
              </div>
              <div className="col-span-12 md:col-span-8">
                <label className="block text-blue-800 font-medium mb-1">Endereço</label>
                <input name="endereco_Resp" value={formData.endereco_Resp} onChange={handleChange} className={baseInput} disabled={isAcompanhamento} readOnly={isAcompanhamento}  />
              </div>
              <div className="col-span-6 md:col-span-2">
                <label className="block text-blue-800 font-medium mb-1">Número</label>
                <input name="numero_Resp" value={formData.numero_Resp} onChange={handleChange} className={baseInput}  disabled={isAcompanhamento} readOnly={isAcompanhamento}/>
              </div>
              <div className="col-span-6 md:col-span-2">
                <label className="block text-blue-800 font-medium mb-1">Complemento</label>
                <input name="complemento_Resp" value={formData.complemento_Resp} onChange={handleChange} className={baseInput}  disabled={isAcompanhamento} readOnly={isAcompanhamento}/>
              </div>

              <div className="col-span-12 md:col-span-4">
                <label className="block text-blue-800 font-medium mb-1">Celular</label>
                <input type="tel" name="celular"  placeholder="(99) 99999-9999" value={phoneMask(formData.celular)} onChange={handleChange} className={baseInput} disabled={isAcompanhamento} readOnly={isAcompanhamento}/>
              </div>
              <div className="col-span-12 md:col-span-4">
                <label className="block text-blue-800 font-medium mb-1">Parentesco</label>
                <select name="parentesco" value={formData.parentesco} onChange={handleChange} className={baseInput} disabled={isAcompanhamento}>
                  <option value="">{isAcompanhamento ? formData.parentesco : "Selecione"}</option>
                  <option value="pai">Pai</option>
                  <option value="mãe">Mãe</option>
                  <option value="responsável">Responsável</option>
                </select>
              </div>
              {/* Forças Armadas */}
              <div className="col-span-12 md:col-span-4">
                <label className="text-blue-800 font-medium mb-1 block">Forças Armadas?</label>
                <select name="forcas" value={formData.forcas} onChange={handleChange} className={baseInput} disabled={isAcompanhamento}>
                  <option value="">{isAcompanhamento ? formData.ramoForcas : "Selecione"}</option>
                  <option value="">Não</option>
                  <option value="X">Sim</option>
                </select>
                {formData.forcas === 'X' && (
                  <select name="ramoForcas" value={formData.ramoForcas} onChange={handleChange} required className={`${baseInput} mt-2`} disabled={isAcompanhamento}>
                    <option value="">Ramo das Forças</option>
                    <option value="exercito">Exército</option>
                    <option value="marinha">Marinha</option>
                    <option value="aeronautica">Aeronáutica</option>
                  </select>
                )}
              </div>


              <div className="col-span-12 md:col-span-4">
                <label className="block text-blue-800 font-medium mb-1">Email Responsavel</label>
                <input type="email" name="emailResponsavel" value={formData.emailResponsavel} onChange={handleChange} className={baseInput} disabled={isAcompanhamento} readOnly={isAcompanhamento} />
              </div>
              <div className="col-span-12 md:col-span-4">
                <label className="block text-blue-800 font-medium mb-1">Email Candidato</label>
                <input type="email" name="emailCandidato" value={formData.emailCandidato} onChange={handleChange} className={baseInput} disabled={isAcompanhamento || session?.user?.email} readOnly={isAcompanhamento} />
              </div>
              {primeiroCad && (
                <div className="col-span-12 md:col-span-4">
                    <label className="text-red-800 font-medium mb-1 block">Solicitar Isenção</label>
                    <select name='isencao' value={formData.isencao} onChange={handleChange} className={baseInput} disabled={isAcompanhamento}>
                        <option value="">Não</option>
                        <option value="Pendente">Sim</option>
                    </select>
                </div>
              )}
            </div>
          </div>
          
          {primeiroCad && (
            <label className="flex items-center justify-center mb-4 text-red-700">
              <input
                disabled={isAcompanhamento} 
                readOnly={isAcompanhamento}
                type="checkbox"
                checked={checkboxMarcado}
                onChange={(e) => setCheckboxMarcado(e.target.checked)}
                className="mr-2"
              />
              Candidato declara não ter sido excluído, por motivo disciplinar, por qualquer CM
            </label>
          )}

          {/* BOTÃO */}
          {!isAcompanhamento && <div className="text-center">
            <button disabled={loading} type="submit" className="bg-blue-800 hover:bg-blue-900 text-white font-semibold py-3 px-8 rounded">
              {loading ? <LoadingIcon /> :"ENVIAR"}
            </button>
            {provisoryUser && provisoryKey && (
              <>              
                <p className='text-red-800'>Dados provisórios de acesso, Login: <span className='font-bold'>{provisoryUser}</span> Senha: <span className='font-bold'>{provisoryKey}</span></p>
                <p className='text-red-800 text-sm'>Não compartilhe essa informação com ninguém.</p>
              </>
            )}
            {paymentButton && (
              <button onClick={() => router.push("/confirmacao")} className="bg-green-800 hover:bg-green-950 text-white font-semibold py-3 px-8 rounded mt-2">
                Ir para pagamento
              </button>
            )}
          </div>}
        </form>
    </>        
  )
}

export default FormularioInscricao
