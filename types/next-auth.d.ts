import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      watchlist: string[];
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    watchlist: string[];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    watchlist: string[];
  }
}