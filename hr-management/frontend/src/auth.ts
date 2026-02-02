import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"

export const config = {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        Credentials({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                        method: 'POST',
                        body: JSON.stringify(credentials),
                        headers: { "Content-Type": "application/json" }
                    });

                    const data = await res.json();

                    if (res.ok && data.user) {
                        return {
                            id: data.user.user.id,
                            name: data.user.user.name,
                            email: data.user.user.email,
                            role: data.user.user.role,
                            accessToken: data.user.token,
                        };
                    }
                    return null;
                } catch (error) {
                    console.error("Auth error:", error);
                    return null;
                }
            }
        })
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = (user as any).role || 'EMPLOYEE' // Default to EMPLOYEE if none provided
                token.accessToken = (user as any).accessToken || 'mock-jwt-token'
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.role = token.role as string
                session.user.accessToken = token.accessToken as string
            }
            return session
        }
    }
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
