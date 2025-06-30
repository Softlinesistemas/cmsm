import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import type { JWT } from "next-auth/jwt";
import type { User } from "next-auth";
import { fetchGovBrFullProfile, GovBrFullProfile } from "@/lib/govbr";

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/login",
  },
  providers: [
    // GOV.BR
     {
      id: "govbr",
      name: "Gov.br",
      type: "oauth",
      // 1) Endereço para iniciar o código de autorização
      authorization: {
        url: "https://sso.staging.acesso.gov.br/authorize",
        params: { scope: "openid email profile" },
      },
      // 2) Endpoint que troca o `code` por tokens
      token: "https://sso.staging.acesso.gov.br/token",
      // 3) Endpoint para buscar os dados básicos do usuário
      userinfo: "https://sso.staging.acesso.gov.br/userinfo",
      // 4) Configuração PKCE + state
      checks: ["pkce", "state"],
      clientId: process.env.NEXT_PUBLIC_GOVBR_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_GOVBR_CLIENT_SECRET!,
      profile(profile: any) {
        console.log(profile)
        return {
          id: profile.sub,
          name: profile.name || profile.preferred_username,
          email: profile.email,
          birthdate: profile.birthdate,
          phone: profile.phone_number,
          image: profile.picture,
          admin: false
        };
      },
    },

    // Login com usuário e senha
    CredentialsProvider({
      name: "Usuário / Senha",
      credentials: {
        user: { label: "Usuário", type: "text", placeholder: "Digite seu usuário" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        try {
          const { data } = await axios.post(
            `${process.env.NEXTAUTH_URL}/api/user/login`,
            {
              user: credentials.user,
              password: credentials.password,
            }
          );

          if (data) {
            return {
              id: data.id,
              name: data.user,
              admin: data.admin === "X",
            };
          }
          return null;
        } catch (err: any) {
          if (axios.isAxiosError(err)) {
            const status = err.response?.status;
            if (status === 503) {
              throw new Error("Banco de dados indisponível. Tente novamente mais tarde.");
            }
            if (status === 500) {
              throw new Error("Erro interno no servidor. Contate o suporte.");
            }
          }
          throw new Error("Usuário ou senha inválidos.");
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account?.access_token && !token._govbrFetched) {
        const full: GovBrFullProfile = await fetchGovBrFullProfile(
          account.access_token
        );
        token = {
          ...token,
          ...full,
          _govbrFetched: true,
        };
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      if (token) {
        session.user = {
          id: token.id,
          name: session.user?.name || "",
          admin: token.admin,
          cpf:       token.cpf as string,
          birthdate: token.birthdate as string,
          image:     token.picture as string,
          phone: token.phone_number as string,
        };
      }
      return session;
    },
  },
};

// Export default para permitir `import authOptions from "@/lib/authOptions"`
export default authOptions;
