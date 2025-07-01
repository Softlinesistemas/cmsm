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
     {
      id: "govbr",
      name: "Gov.br",
      type: "oauth",
      authorization: {
        url: `${process.env.NEXT_PUBLIC_GOVBR_URL}authorize`,
        params: { scope: "openid email profile" },
      },
      token: `${process.env.NEXT_PUBLIC_GOVBR_URL}token`,
      userinfo: `${process.env.NEXT_PUBLIC_GOVBR_URL}userinfo`,
      checks: ["pkce", "state"],
      clientId: process.env.NEXT_PUBLIC_GOVBR_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_GOVBR_CLIENT_SECRET!,
      profile(profile: any) {
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
    async jwt({ token, user, account }) {
      // Login ADM
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.admin = user.admin ?? false;
      }

      // Login com Gov.br
      if (account?.access_token && !token._govbrFetched) {
        const full: GovBrFullProfile = await fetchGovBrFullProfile(account.access_token);

        token = {
          ...token,
          access_token: account.access_token,
          id: token.id ?? full.sub,
          name: full.name,
          email: full.email,
          picture: full.picture,
          cpf: full.sub,
          birthdate: full.birthdate,
          phone_number: full.phone_number,
          admin: false,
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

export default authOptions;
