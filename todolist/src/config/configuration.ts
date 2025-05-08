export default () => ({
    port: parseInt(process.env.PORT ?? '8080'),
    database: {
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '3306'),
      username: process.env.DB_USERNAME ?? 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    },
    jwt: {
      secret: process.env.JWT_SECRET ?? 'your-secret-key',
      expirationTime: parseInt(process.env.JWT_EXPIRATION ?? '3600'),
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    },
  });