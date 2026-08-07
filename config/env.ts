export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  supabaseServiceRoleKey: process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY,
  supabaseJwtSecret: process.env.NEXT_PUBLIC_SUPABASE_JWT_SECRET,
  authSecret: process.env.NEXT_PUBLIC_AUTH_SECRET,
  authGithubId: process.env.NEXT_PUBLIC_AUTH_GITHUB_ID,
  authGithubSecret: process.env.NEXT_PUBLIC_AUTH_GITHUB_SECRET,
} as const;

export function getRequiredEnv(name: keyof typeof env): string {
  const value = env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}
