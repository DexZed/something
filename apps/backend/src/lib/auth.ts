import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { openAPI } from 'better-auth/plugins';
import { prisma } from './prisma.js';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  baseURL: {
    allowedHosts: ['http://localhost:3000', '*.vercel.app', '*.onrender.com'],
    protocol: process.env.NODE_ENV! === 'development' ? 'https' : 'http',
  },
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: ['student', 'teacher', 'admin'],
        required: true,
        defaultValue: 'student',
        input: true, // Allow role to be set during registration
      },
      imageCldPubId: {
        type: 'string',
        required: false,
        input: true, // Allow imageCldPubId to be set during registration
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60, // 1 minute
    },
  },
  advanced: {
    database: {
      joins: true,
    },
  },
  plugins: [openAPI()],
  trustedOrigins: [
    'http://localhost:3000',
    '*.vercel.app',
    '*.onrender.com',
    'chrome-extension://',
    'vscode-webview://',
  ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
