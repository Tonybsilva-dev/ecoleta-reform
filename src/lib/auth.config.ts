import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Role, UserType } from "@prisma/client";
import bcrypt from "bcryptjs";
import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (!user || !user.password) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          console.error("Error in credentials authorization:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;

        // Se é um novo usuário via OAuth (Google), criar perfil automaticamente
        if (account?.provider === "google") {
          try {
            // Verificar se o perfil já existe
            const existingProfile = await prisma.profile.findUnique({
              where: { userId: user.id },
            });

            // Se não existe, criar um perfil padrão
            if (!existingProfile) {
              await prisma.profile.create({
                data: {
                  name: user.name || "Usuário",
                  userId: user.id,
                  userType: "CITIZEN", // Tipo padrão
                  hasSelectedRole: false, // Usuário precisará selecionar o tipo
                },
              });
            }
          } catch (error) {
            console.error("Erro ao criar perfil para usuário OAuth:", error);
          }
        }
      }

      // Sempre buscar informações atualizadas do perfil para incluir no token
      if (token.id) {
        try {
          const profile = await prisma.profile.findUnique({
            where: { userId: token.id as string },
            select: {
              hasSelectedRole: true,
              userType: true,
              role: true,
            },
          });

          if (profile) {
            token.hasSelectedRole = profile.hasSelectedRole;
            token.userType = profile.userType;
            token.role = profile.role;
          }
        } catch (error) {
          console.error("Erro ao buscar perfil no JWT callback:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.hasSelectedRole = token.hasSelectedRole as boolean;
        session.user.userType = token.userType as UserType;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
