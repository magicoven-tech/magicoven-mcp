import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  figma: {
    apiUrl: 'https://api.figma.com/v1',
    accessToken: process.env.FIGMA_ACCESS_TOKEN
  },
  cache: {
    ttl: 3600 // 1 hora em segundos
  }
};

// Verificar se a chave da API do Figma está configurada
if (!process.env.FIGMA_ACCESS_TOKEN) {
  console.error('Erro: A variável de ambiente FIGMA_ACCESS_TOKEN não está definida');
  process.exit(1);
}

export default config;
