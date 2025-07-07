import axios from "axios";

export interface GovBrFullProfile {
  sub: string;
  name: string;
  social_name?: string;
  profile: string;
  picture: string;
  email: string;
  email_verified: boolean;
  phone_number: string;
  phone_number_verified: boolean;
  birthdate?: string;
}

/**
 * Busca primeiro o /userinfo (OIDC) e depois o endpoint de Dados Pessoais
 * e junta os dois objetos.
 */
export async function fetchGovBrFullProfile(
  accessToken: string
): Promise<GovBrFullProfile> {
  const headers = { Authorization: `Bearer ${accessToken}` };

  // 1) Dados básicos (OpenID Connect)
  const { data: basic } = await axios.get(
    `${process.env.NEXT_PUBLIC_GOVBR_URL}userinfo`,
    { headers }
  );

  // 2) Dados pessoais completos (ajuste a URL se for /v2/me ou SCIM)
  // const { data: personal } = await axios.get(
  //   `https://api.acesso.gov.br/dados/v1/me`,
  //   { headers }
  // );

  // Junta tudo (personal sobrescreve basic em caso de conflito)
  return { ...basic };
}
