import dotenv from 'dotenv';
import { Command } from 'commander';

const program = new Command();
program.option('--mode <mode>', 'Modo de trabajo', 'DEVELOPMENT');
program.parse();

dotenv.config({
  path: program.opts().mode === 'DEVELOPMENT' ? './.env.development' : './.env.production',
});

export default {
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL,
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  githubClientId: process.env.GITHUB_CLIENT_ID,
  githubClientSecret : process.env.GITHUB_CLIENT_SECRET,
  googleEmail : process.env.GOOGLE_EMAIL,
  googlePass : process.env.GOOGLE_PASS
};

