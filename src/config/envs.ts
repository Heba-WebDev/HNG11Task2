import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
  PORT: get('PORT').required().asPortNumber(),
  DATABASE_URL: get('DATABASE_URL').required().asString(),
  JWT_SECRET_KEY: get('JWT_SECRET_KEY').required().asString(),
  JWT_REFRESH_EXPIRATION: get('JWT_REFRESH_EXPIRATION').required().asString(),
};
