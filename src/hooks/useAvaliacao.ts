import { useMutation } from 'react-query';
import api from '@/utils/api';

type AvaliacaoPayload = {
  codigoOrgao: string;
  codigoServico: string;
  numeroProtocolo: string;
  cpfCidadao: string;
  nomeCidadao?: string;
  emailCidadao?: string;
  telefoneCidadao?: string;
  dataSolicitacao?: string;
};

type AvaliacaoResponse = {
  urlFormulario: string;
  validade: string;
  protocoloAvaliacao: string;
  error: string;
};

export function useAvaliacao() {
  return useMutation<AvaliacaoResponse, any, AvaliacaoPayload>(
    (dados) => api.post('api/avaliacao', dados).then(res => res.data)
  );
}
