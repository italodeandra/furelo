const config = {
  databaseUrl: process.env.DATABASE_URL,
  vercelApi: process.env.VERCEL_API || "https://api.vercel.com",
  clientId: process.env.NEXT_PUBLIC_VERCEL_INTEGRATION_CLIENT_ID,
  clientSecret: process.env.VERCEL_INTEGRATION_SECRET,
  vercelAuthorizeUrl: "https://vercel.com/oauth/authorize",
  baseUrl: process.env.BASE_URL || "http://localhost:3000",
}

export default config
