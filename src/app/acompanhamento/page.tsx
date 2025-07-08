'use client'

import Header from '../../components/HeaderAdm'
import Footer from '../../components/FooterAdm'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import StepsNavbar from '@/components/StepsNavbar'
import api from '@/utils/api'
import bcrypt from 'bcryptjs';
import { signIn } from 'next-auth/react'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import FormularioInscricao from '@/components/inscricao/FormularioInscricao'
import { useQuery } from 'react-query'

export default function Formulario() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const dataLimiteEdicao = new Date('2026-06-01');
  const [podeEditarExtras, setPodeEditarExtras] = useState(true);
  const [provisoryKey, setProvisoryKey] = useState("");
  const [provisoryUser, setProvisoryUser] = useState("");
  const [paymentButton, setPaymentButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkboxMarcado, setCheckboxMarcado] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session.user) {
      setFormData({ ...formData, cpf: String(session?.user?.cpf), fotoPreview: session?.user?.picture || session?.user?.image || ""})
    }
  }, [status]);

  const { data: candidato } = useQuery(
      ['candidato'],
    () => api.get(`/api/candidato/${session?.user.cpf}`).then(res => res.data),
    { enabled: !!session?.user.cpf, refetchOnWindowFocus: false }
  )

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
  


  useEffect(() => {
    if (candidato && !formData?.nome) {
      setFormData(prev => ({
        ...prev,
        nome: candidato.Nome || '',
        numeroInscricao: candidato.CodIns?.toString() || '',
        cpf: einCpfMask(candidato.CPF) || '',
        dataNascimento: candidato.Nasc || '',
        sexo: candidato.Sexo || '',
        cep: cepMask(candidato.Cep) || '',
        endereco: candidato.Endereco || '',
        cidade: candidato.Cidade || '',
        uf: candidato.UF || '',
        numero: '', // Se tiver, ajuste para candidato.Numero
        complemento: candidato.Complemento || '',
        necessidades: candidato.PortadorNec || '',
        tipoNecessidade: '',
        transtornoFuncional: '',
        transtornoTipos: [],
        atendimentoEspecial: candidato.AtendimentoEsp || '',
        tipoAtendimento: candidato.tipoAtendimento || '',
        tipoCota: candidato.CodCot1 || '',
        necessitaCondicoes: candidato.necessitaCondicoes || '',
        tipoAtendimentoProva: candidato.tipoAtendimentoProva || '',
        forcas: candidato.forcas || '',
        ramoForcas: candidato.ramoForcas || '',
        dadosVaga: candidato.dadosVaga || '',
        nomeResponsavel: candidato.Responsavel || '',
        cpfResponsavel: candidato.CPFResp || '',
        dataNascimentoResponsavel: candidato.NascResp || '',
        sexoResponsavel: candidato.SexoResp || '',
        cep_Resp: cepMask(candidato.CepResp) || '',
        endereco_Resp: candidato.EnderecoResp || '',
        cidade_Resp: candidato.CidadeResp || '',
        uf_Resp: candidato.UFResp || '',
        numero_Resp: '', // Se tiver campo correspondente
        complemento_Resp: candidato.ComplementoResp || '',
        profissao: candidato.ProfissaoResp || '',
        celular: phoneMask(candidato.TelResp) || '',
        parentesco: candidato.Parentesco || '',
        emailResponsavel: candidato.EmailResp || '',
        emailCandidato: candidato.Email || '',
        fotoPreview: candidato.CaminhoFoto || '',
        Seletivo: candidato.Seletivo || ''
      }))
    }
  }, [candidato])


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
    Seletivo: ''
  })

  useEffect(() => {
    // setPodeEditarExtras(new Date() <= dataLimiteEdicao)
    setPodeEditarExtras(true)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    // Mapeando formData para o objeto esperado pela API
    const payload = {
      CodIns: Number(formData.numeroInscricao), // supondo que seja number
      Nome: formData.nome,
      CPF: formData.cpf,
      Nasc: formData.dataNascimento || null,
      Sexo: formData.sexo || null,
      Cep: formData.cep || null,
      Endereco: formData.endereco || null,
      Complemento: formData.complemento || null,
      Bairro: null,      // Se você tiver, pode preencher
      Cidade: formData.cidade || null,
      UF: formData.uf || null,
      // Campos que não tem no seu formData, podem ficar nulos
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
      const nomeCompleto = formData.nome.trim().split(/\s+/);
      
      const primeiroNome = nomeCompleto[0];
      const ultimoNome = nomeCompleto.length > 1 ? nomeCompleto[nomeCompleto.length - 1] : "";
      
      const user = `${primeiroNome.toLowerCase()}_${ultimoNome.toLowerCase()}`.replace(/[^\w]/g, '');
      
      const password = await bcrypt.hash(user, 10);
      let userId = null;
      if (!session?.user?.id) {
        const response = await api.post("api/candidato/cadastro", {
          user,
          password,
          email: formData.emailCandidato
        }); 
        userId = response.data.id
      }
      await api.post("api/candidato", {...payload, CodUsu: session?.user?.id || userId });

      if (userId) {
        const res = await signIn("credentials", {
          redirect: false,
          user: formData.cpf?.replace(/\D/g, ""),
          password,
        });
        setProvisoryKey(password);
        setProvisoryUser(formData.cpf?.replace(/\D/g, ""));
      }
      toast.success("Inscrição realizada!");
      setPaymentButton(true);
    } catch (error: any) {
      toast.error(error.response.data.error || error.response.data.message)
      console.error("Erro ao enviar dados:", error);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <StepsNavbar activeStep={0}/>
      <main className="flex-grow px-4 py-8">
        <h2 className="text-2xl font-bold text-center text-blue-800 mb-8">
          FORMULÁRIO DE INSCRIÇÃO
        </h2>
        <FormularioInscricao isAcompanhamento checkboxMarcado={checkboxMarcado} setCheckboxMarcado={setCheckboxMarcado} provisoryKey={provisoryKey} loading={loading} provisoryUser={provisoryUser} paymentButton={paymentButton} podeEditarExtras={podeEditarExtras} handleSubmit={handleSubmit} setFormData={setFormData} formData={formData} handleChange={handleChange}/>
      </main>
      <Footer />
    </div>
  )
}