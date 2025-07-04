import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

 declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & Partial<{
      id: string;
      admin: boolean;
      cpf: string;
      birthdate?: string;
      access_token?: string;
      phone_number: string;
      picture: string;
    }>
  }

  interface User extends DefaultUser, Partial<{
    id: string;
    admin: boolean;
    cpf: string;
    access_token?: string;
    birthdate?: string;
    phone_number: string;
    picture: string;
  }> {}
}

declare module "next-auth/jwt" {
  interface JWT extends Partial<{
    id: string;
    admin: boolean;
    cpf: string;
    access_token?: string;
    birthdate?: string;
    phone_number: string;
    picture: string;
  }> {}
}

declare global {
  interface Window {
    iFrameResize?: (
      options: any,
      target: string | Element | Element[]
    ) => void;
  }
}
