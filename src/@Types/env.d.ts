declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    NODE_ENV: string;
    JWT_SECRET: string;
    JWT_EXPIRED_TIME: string;
    JWT_COOKIE_EXPIRES_IN: string;

    DATABASE: string;
    DATABASE_LOCAL: string;
    DATABASE_PASSWORD: string;
    DATABASE_PASSWORD_LOCAL: string;

    EMAIL_HOST: string;
    EMAIL_PORT: string;
    EMAIL_USERNAME: string;
    EMAIL_PASSWORD: string;
    EMAIL_FROM: string;
  }
}
