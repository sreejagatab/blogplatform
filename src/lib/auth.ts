import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"

const authConfig = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    CredentialsProvider({
      id: "demo",
      name: "Demo Login",
      credentials: {
        email: { label: "Email", type: "email" }
      },
      async authorize(credentials) {
        if (!credentials?.email || typeof credentials.email !== 'string') return null
        
        // Only allow demo emails
        const demoEmails = [
          'admin@blogplatform.com',
          'editor@blogplatform.com', 
          'viewer@blogplatform.com'
        ]

        if (!demoEmails.includes(credentials.email)) {
          return null
        }

        // Find the demo user
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            image: true
          }
        })

        if (!user) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user && token?.sub) {
        session.user.id = token.sub
        // Get user role from database or token
        if (token.role) {
          (session.user as any).role = token.role
        } else {
          const user = await prisma.user.findUnique({
            where: { id: token.sub },
            select: { role: true }
          })
          if (user) {
            (session.user as any).role = user.role
          }
        }
      }
      return session
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id
        // Store role in token for demo users
        if ('role' in user) {
          token.role = user.role
        }
      }
      return token
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)

// Export for compatibility with v4 API routes
export const authOptions = authConfig
export { auth as getServerSession }
