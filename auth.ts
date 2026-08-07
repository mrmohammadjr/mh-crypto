import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase/client';
import GitHub from 'next-auth/providers/github';
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { data: user, error } = await supabaseAdmin
          .from('users')
          .select('id, name, email, password, watchlist')
          .eq('email', parsed.data.email)
          .single();

        if (error || !user) return null;

        const isValid = await bcrypt.compare(parsed.data.password, user.password);
        if (!isValid) return null;

        // Whatever you return here ends up in the `user` param of the jwt callback
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          watchlist: user.watchlist,
        };
      },
    }),
  ],
  callbacks: {
  async jwt({ token, user, trigger, session }) {
    if (user) {
      token.id = user.id;
      token.watchlist = user.watchlist;
    }
    if (trigger === 'update' && session?.watchlist) {
      token.watchlist = session.watchlist;
    }
    return token;
  },
  async session({ session, token }) {
    session.user.id = token.id as string;
    session.user.watchlist = token.watchlist as string[];
    return session;
  },
},
  pages: {
    signIn: '/login',
  },
});