import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import IdentityServer4Provider from "next-auth/providers/identity-server4";
import axios from "axios";

import type { JWT } from "next-auth/jwt";
import type { User } from "next-auth";

export const authOptions: AuthOptions = {
  // 1) Providers: gov.br + Credentials
  providers: [
    // --- GOV.BR via OpenID Connect ---
    IdentityServer4Provider({
      id: "govbr",
      name: "Gov.br",
      issuer: "https://sso.acesso.gov.br/auth/realms/govbr",
      clientId: process.env.GOVBR_CLIENT_ID!,
      clientSecret: process.env.GOVBR_CLIENT_SECRET!,
      // Você pode customizar os scopes se precisar de algo além de perfil e email:
      // scope: "openid profile email",
    }),

    // --- Autenticação custom ---
    CredentialsProvider({
      name: "E-mail / Senha",
      credentials: {
        email: { label: "E-mail", type: "text", placeholder: "seu@exemplo.com" },
        password: { label: "Senha",  type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        try {
          const { data } = await axios.post(
            `${process.env.NEXTAUTH_URL}/api/user/login`,
            {
              email: credentials.email,
              password: credentials.password,
            }
          );
          const user = data.user;

          if (user) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              admin: user.admin === "X",
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
          throw new Error("E-mail ou senha inválidos.");
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
       async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id as string;
        token.admin = (user as any).admin as boolean;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      if (token) {
        session.user = {
          id: token.id as string,
          name: session.user!.name!,
          email: session.user!.email!,
          admin: !!token.admin,
        };
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
