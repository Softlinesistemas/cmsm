import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import type { JWT } from "next-auth/jwt";
import type { User } from "next-auth";

export const authOptions: AuthOptions = {
  providers: [
    // GOV.BR
    {
      id: "govbr",
      name: "Gov.br",
      type: "oauth",
      wellKnown: "https://sso.acesso.gov.br/.well-known/openid-configuration",
      clientId: process.env.NEXT_PUBLIC_GOVBR_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_GOVBR_CLIENT_SECRET!,
      authorization: { params: { scope: "openid email profile" } },
      checks: ["pkce", "state"],
      profile(profile: any) {
        return {
          id: profile.sub,
          name: profile.name || profile.preferred_username,
          email: profile.email,
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
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id as string;
        token.admin = (user as any).admin;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      if (token) {
        session.user = {
          id: token.id,
          name: session.user?.name || "",
          admin: token.admin,
        };
      }
      return session;
    },
  },
};

// Export default para permitir `import authOptions from "@/lib/authOptions"`
export default authOptions;
