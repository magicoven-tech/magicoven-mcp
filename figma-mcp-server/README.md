# Figma MCP Server Custom

Um servidor MCP personalizado para integração com a API do Figma, focado em documentação de design systems e geração de tokens de design.

## Pré-requisitos

- Node.js >= 14.0.0
- npm ou yarn
- Chave de acesso à API do Figma

## Configuração

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
   ```
   FIGMA_ACCESS_TOKEN=sua_chave_aqui
   PORT=3000
   NODE_ENV=development
   ```

## Como usar

### Iniciar o servidor em modo de desenvolvimento

```bash
npm run dev
```

### Iniciar o servidor em produção

```bash
npm start
```

## Endpoints da API

- `GET /health` - Verifica a saúde da API
- `GET /api/files/:fileKey` - Obtém informações sobre um arquivo do Figma
- `GET /api/files/:fileKey/nodes?ids=id1,id2` - Obtém nós específicos de um arquivo
- `GET /api/files/:fileKey/styles` - Obtém estilos de um arquivo
- `GET /api/files/:fileKey/components` - Obtém componentes de um arquivo
- `GET /api/design-system/:fileKey` - Gera documentação do design system
- `GET /api/design-tokens/:fileKey` - Gera tokens de design

## 🧪 Testes

O projeto inclui testes unitários e de integração para garantir a qualidade do código e a estabilidade da aplicação.

### 🚀 Executando Testes

```bash
# Instalar dependências de desenvolvimento
npm install

# Executar todos os testes
npm test

# Executar testes em modo watch (desenvolvimento)
npm run test:watch

# Gerar relatório de cobertura
npm run test:coverage

# Executar apenas testes unitários
npm run test:unit

# Executar apenas testes de integração (requer token de acesso à API do Figma)
FIGMA_ACCESS_TOKEN=seu_token_aqui npm run test:integration

# Executar todos os testes (unitários e de integração) com relatório de cobertura
npm run test:ci
```

### 🔍 Cobertura de Código

O projeto utiliza o [Jest](https://jestjs.io/) para testes e geração de relatórios de cobertura. Após executar `npm run test:coverage`, um relatório detalhado estará disponível em `coverage/lcov-report/index.html`.

**Métricas de Cobertura Atuais:**
- **Serviço Figma:** 97.5% de cobertura de linhas
- **Branches:** 84.61% de cobertura
- **Funções:** 100% cobertas

### 🔧 Configuração para Testes

1. **Variáveis de Ambiente:**
   - `FIGMA_ACCESS_TOKEN`: Necessário para testes de integração
   - `NODE_ENV=test`: Configura o ambiente de teste

2. **Mocking:**
   - Os testes unitários utilizam mocks para a API do Figma
   - Os arquivos de mock estão em `__tests__/__mocks__/`

3. **Testes de Integração:**
   - Requerem conexão com a API do Figma
   - São mais lentos e devem ser executados apenas quando necessário
   - São ignorados em execuções padrão de teste

## 🚀 CI/CD

O projeto utiliza GitHub Actions para integração contínua. O fluxo de CI inclui:

1. **Linting** com ESLint
2. **Testes Unitários** com cobertura de código
3. **Testes de Integração** (apenas quando o token do Figma está disponível)
4. **Upload de Cobertura** para o Codecov (apenas no branch principal)

### 🔑 Secrets Necessárias

| Secret | Obrigatória | Descrição |
|--------|-------------|-----------|
| `FIGMA_ACCESS_TOKEN` | Sim | Token de acesso à API do Figma |
| `CODECOV_TOKEN` | Não | Token para upload de cobertura de código |

### 📊 Monitoramento de Cobertura

A cobertura de código é monitorada através do [Codecov](https://about.codecov.io/). Um badge é exibido no README mostrando a cobertura atual do projeto.

[![codecov](https://codecov.io/gh/seu-usuario/figma-mcp-server/branch/main/graph/badge.svg?token=SEU_TOKEN_AQUI)](https://codecov.io/gh/seu-usuario/figma-mcp-server)

### 🔄 Fluxo de Desenvolvimento

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/awesome-feature`)
3. Faça commit das suas alterações (`git commit -m 'Add some awesome feature'`)
4. Faça push para a branch (`git push origin feature/awesome-feature`)
5. Abra um Pull Request

O CI será executado automaticamente em todos os PRs.

## Estrutura do Projeto

```
src/
├── api/
│   └── routes.js         # Rotas da API
├── config/
│   └── config.js        # Configurações do aplicativo
├── controllers/
│   └── figma.controller.js # Controladores da API
├── services/
│   └── figma.service.js  # Serviço de integração com a API do Figma
├── utils/
├── app.js               # Configuração do Express
└── index.js              # Ponto de entrada do aplicativo
```

## Variáveis de Ambiente

| Variável | Obrigatório | Descrição |
|----------|-------------|-----------|
| FIGMA_ACCESS_TOKEN | Sim | Chave de acesso à API do Figma |
| PORT | Não | Porta em que o servidor irá rodar (padrão: 3000) |
| NODE_ENV | Não | Ambiente de execução (development/production) |

## Licença

MIT
