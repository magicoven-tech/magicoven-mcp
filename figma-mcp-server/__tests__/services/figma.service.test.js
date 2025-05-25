const { mockFigmaClient } = require('../__mocks__/figma-js');
const FigmaService = require('../../src/services/figma.service');

// Configuração do ambiente
process.env.NODE_ENV = 'test';
process.env.FIGMA_ACCESS_TOKEN = 'test-token';

// Configurar timeout global para os testes
jest.setTimeout(10000);

// Configurar mocks
const __mockFigmaClient = mockFigmaClient;

// Criar uma instância do serviço para os testes
let figmaService;

beforeEach(() => {
  // Criar uma nova instância do serviço para cada teste
  figmaService = new FigmaService(__mockFigmaClient);
  // Limpar chamadas de mock entre os testes
  jest.clearAllMocks();
});

// Dados de teste
const mockFileData = { document: { id: '0:0', name: 'Test File' } };
const mockStylesData = { meta: { styles: [{ id: '1:1', name: 'Style 1' }] } };
const mockComponentsData = { meta: { components: [{ id: '2:2', name: 'Component 1' }] } };
const mockNodesData = { nodes: { '1:1': { document: { id: '1:1', name: 'Node 1' } } } };

// Mock do módulo figma-js
jest.mock('figma-js', () => ({
  ...jest.requireActual('figma-js'),
  Client: jest.fn().mockImplementation(() => mockFigmaClient),
}));

describe('FigmaService', () => {
  const mockFileKey = 'test-file-key';
  const mockNodeIds = ['1:1', '2:2'];
  const mockFileData = { document: { id: '0:0', name: 'Test File' } };
  const mockStylesData = { meta: { styles: [{ id: '1:1', name: 'Style 1' }] } };
  const mockComponentsData = { meta: { components: [{ id: '2:2', name: 'Component 1' }] } };
  const mockNodesData = { nodes: { '1:1': { document: { id: '1:1', name: 'Node 1' } } } };

  beforeEach(() => {
    // Limpar todas as chamadas e mocks antes de cada teste
    jest.clearAllMocks();
    
    // Configurar os mocks
    __mockFigmaClient.file.mockResolvedValue({ data: mockFileData });
    __mockFigmaClient.fileNodes.mockResolvedValue({ data: mockNodesData });
    __mockFigmaClient.fileStyles.mockResolvedValue({ data: mockStylesData });
    __mockFigmaClient.fileComponents.mockResolvedValue({ data: mockComponentsData });
  });

  describe('getFile', () => {
    it('deve retornar os dados do arquivo', async () => {
      __mockFigmaClient.file.mockResolvedValueOnce({ data: mockFileData });

      const result = await figmaService.getFile('test-file-key');

      expect(result).toEqual(mockFileData);
      expect(__mockFigmaClient.file).toHaveBeenCalledWith('test-file-key');
    });

    it('deve lançar um erro quando a chave do arquivo for inválida', async () => {
      await expect(figmaService.getFile('')).rejects.toThrow('File key is required');
      await expect(figmaService.getFile(null)).rejects.toThrow('File key is required');
      await expect(figmaService.getFile(undefined)).rejects.toThrow('File key is required');
    });

    it('deve lançar um erro quando a API retornar um erro', async () => {
      const error = new Error('API Error');
      error.response = { status: 404, data: { message: 'Not Found' } };
      __mockFigmaClient.file.mockRejectedValueOnce(error);

      await expect(figmaService.getFile('invalid-key')).rejects.toThrow('API Error');
    });

    it('deve lançar um erro quando o token de acesso não estiver configurado', async () => {
      const originalToken = process.env.FIGMA_ACCESS_TOKEN;
      delete process.env.FIGMA_ACCESS_TOKEN;
      
      try {
        await expect(figmaService.getFile('test-file-key')).rejects.toThrow('Figma access token is not configured');
      } finally {
        process.env.FIGMA_ACCESS_TOKEN = originalToken;
      }
    });
  });

  describe('getFileNodes', () => {
    it('deve retornar os nós do arquivo', async () => {
      __mockFigmaClient.fileNodes.mockResolvedValueOnce({ data: mockNodesData });
      
      const result = await figmaService.getFileNodes('test-file-key', ['1:1']);
      
      expect(result).toEqual(mockNodesData);
      expect(__mockFigmaClient.fileNodes).toHaveBeenCalledWith('test-file-key', ['1:1']);
    });

    it('deve lançar um erro quando os parâmetros forem inválidos', async () => {
      await expect(figmaService.getFileNodes('', [])).rejects.toThrow('File key is required');
      await expect(figmaService.getFileNodes('test-file-key', [])).rejects.toThrow('Node IDs are required');
      await expect(figmaService.getFileNodes('test-file-key', [''])).rejects.toThrow('Node IDs are required');
    });

    it('deve lidar com erros da API', async () => {
      const error = new Error('API Error');
      error.response = { status: 400, data: { message: 'Bad Request' } };
      __mockFigmaClient.fileNodes.mockRejectedValueOnce(error);

      await expect(figmaService.getFileNodes('test-file-key', ['1:1'])).rejects.toThrow('API Error');
    });
  });

  describe('getFileStyles', () => {
    it('deve retornar os estilos do arquivo', async () => {
      __mockFigmaClient.fileStyles.mockResolvedValueOnce({ data: mockStylesData });
      
      const result = await figmaService.getFileStyles('test-file-key');
      
      expect(result).toEqual(mockStylesData);
      expect(__mockFigmaClient.fileStyles).toHaveBeenCalledWith('test-file-key');
    });

    it('deve lançar um erro quando a chave do arquivo for inválida', async () => {
      await expect(figmaService.getFileStyles('')).rejects.toThrow('File key is required');
    });

    it('deve retornar um objeto vazio quando não houver estilos', async () => {
      const emptyStyles = { meta: { styles: [] } };
      __mockFigmaClient.fileStyles.mockResolvedValueOnce({ data: emptyStyles });
      
      const result = await figmaService.getFileStyles('empty-file');
      
      expect(result).toEqual(emptyStyles);
    });
  });

  describe('getFileComponents', () => {
    it('deve retornar os componentes do arquivo', async () => {
      __mockFigmaClient.fileComponents.mockResolvedValueOnce({ data: mockComponentsData });
      
      const result = await figmaService.getFileComponents('test-file-key');
      
      expect(result).toEqual(mockComponentsData);
      expect(__mockFigmaClient.fileComponents).toHaveBeenCalledWith('test-file-key');
    });

    it('deve lançar um erro quando a chave do arquivo for inválida', async () => {
      await expect(figmaService.getFileComponents('')).rejects.toThrow('File key is required');
    });

    it('deve retornar um objeto vazio quando não houver componentes', async () => {
      const emptyComponents = { meta: { components: [] } };
      __mockFigmaClient.fileComponents.mockResolvedValueOnce({ data: emptyComponents });
      
      const result = await figmaService.getFileComponents('empty-file');
      
      expect(result).toEqual(emptyComponents);
    });
  });
});
