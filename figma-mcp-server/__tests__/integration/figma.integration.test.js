const { Client, mockFigmaClient } = require('../__mocks__/figma-js');
const FigmaService = require('../../src/services/figma.service');

// Descrever os testes de integração
describe('FigmaService - Integration Tests', () => {
  let figmaService;
  
  beforeEach(() => {
    // Criar uma nova instância do serviço para cada teste com o cliente mockado
    figmaService = new FigmaService(mockFigmaClient);
    // Limpar chamadas de mock entre os testes
    jest.clearAllMocks();
  });
  
  // Testar apenas se o token de acesso estiver configurado
  const hasToken = process.env.FIGMA_ACCESS_TOKEN && process.env.FIGMA_ACCESS_TOKEN !== 'test-token';
  const testIf = hasToken ? test : test.skip;

  describe('getFile', () => {
    testIf('deve retornar os dados de um arquivo Figma existente', async () => {
      const fileKey = 'test-file-key';
      const result = await figmaService.getFile(fileKey);
      
      expect(result).toBeDefined();
      expect(result.document).toBeDefined();
      expect(result.name).toBeDefined();
    }, 30000);

    testIf('deve lançar um erro para um arquivo inexistente', async () => {
      const invalidFileKey = 'invalid-file-key';
      
      // Mock a rejeição para o caso de arquivo inválido
      mockFigmaClient.file.mockRejectedValueOnce(new Error('File not found'));
      
      await expect(figmaService.getFile(invalidFileKey)).rejects.toThrow('File not found');
    }, 30000);
  });

  describe('getFileNodes', () => {
    testIf('deve retornar os nós de um arquivo Figma existente', async () => {
      const fileKey = 'fzYhvQpqhZFX1sZAH5BDI9';
      const nodeIds = ['0:1'];
      
      const result = await figmaService.getFileNodes(fileKey, nodeIds);
      
      expect(result).toBeDefined();
      expect(result.nodes).toBeDefined();
      expect(result.nodes[nodeIds[0]]).toBeDefined();
    }, 30000);
  });

  describe('getFileStyles', () => {
    testIf('deve retornar os estilos de um arquivo Figma', async () => {
      const fileKey = 'fzYhvQpqhZFX1sZAH5BDI9';
      
      const result = await figmaService.getFileStyles(fileKey);
      
      expect(result).toBeDefined();
      expect(result.meta).toBeDefined();
      expect(Array.isArray(result.meta.styles)).toBe(true);
    }, 30000);
  });

  describe('getFileComponents', () => {
    testIf('deve retornar os componentes de um arquivo Figma', async () => {
      const fileKey = 'fzYhvQpqhZFX1sZAH5BDI9';
      
      const result = await figmaService.getFileComponents(fileKey);
      
      expect(result).toBeDefined();
      expect(result.meta).toBeDefined();
      expect(Array.isArray(result.meta.components)).toBe(true);
    }, 30000);
  });
});
