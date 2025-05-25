const FigmaService = require('../../src/services/figma.service');

// Mock do módulo figma-js
jest.mock('figma-js', () => {
  const mockClient = {
    file: jest.fn(),
    fileNodes: jest.fn(),
    fileStyles: jest.fn(),
    fileComponents: jest.fn(),
  };
  
  return {
    Client: jest.fn().mockImplementation(() => mockClient),
    __mockClient: mockClient
  };
});

const { __mockClient } = require('figma-js');

describe('FigmaService - Error Handling', () => {
  let figmaService;

  beforeEach(() => {
    // Criar uma nova instância do serviço para cada teste
    figmaService = new FigmaService(__mockClient);
    // Limpar chamadas de mock entre os testes
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('deve lançar um erro quando nenhum cliente for fornecido e o token não estiver configurado', () => {
      // Salvar o valor original do config.figma
      const originalConfig = { ...require('../../src/config/config') };
      
      // Simular que o config.figma não existe
      jest.isolateModules(() => {
        jest.mock('../../src/config/config', () => ({}));
        
        // Importar o serviço novamente para pegar a nova configuração
        const FigmaService = require('../../src/services/figma.service');
        
        // Testar o erro
        expect(() => new FigmaService()).toThrow('Figma access token is not configured');
      });
      
      // Garantir que o mock foi limpo
      jest.unmock('../../src/config/config');
      
      // Verificar se o config original ainda está acessível
      const config = require('../../src/config/config');
      expect(config.figma).toBeDefined();
    });
  });

  describe('getFile', () => {
    it('deve lançar um erro quando a chave do arquivo for inválida', async () => {
      await expect(figmaService.getFile('')).rejects.toThrow('File key is required');
      await expect(figmaService.getFile(null)).rejects.toThrow('File key is required');
      await expect(figmaService.getFile(undefined)).rejects.toThrow('File key is required');
    });

    it('deve lançar um erro quando a API retornar um erro', async () => {
      const error = new Error('API Error');
      error.response = { status: 404, data: { message: 'Not Found' } };
      __mockClient.file.mockRejectedValueOnce(error);

      await expect(figmaService.getFile('invalid-key')).rejects.toThrow('API Error');
    });
  });

  describe('getFileNodes', () => {
    it('deve lançar um erro quando os parâmetros forem inválidos', async () => {
      await expect(figmaService.getFileNodes('', [])).rejects.toThrow('File key is required');
      await expect(figmaService.getFileNodes('test-file-key', [])).rejects.toThrow('Node IDs are required');
      await expect(figmaService.getFileNodes('test-file-key', [''])).rejects.toThrow('Node IDs are required');
    });

    it('deve lançar um erro quando a API retornar um erro', async () => {
      const error = new Error('API Error');
      error.response = { status: 400, data: { message: 'Bad Request' } };
      __mockClient.fileNodes.mockRejectedValueOnce(error);

      await expect(figmaService.getFileNodes('test-file-key', ['1:1'])).rejects.toThrow('API Error');
    });
  });

  describe('getFileStyles', () => {
    it('deve lançar um erro quando a chave do arquivo for inválida', async () => {
      await expect(figmaService.getFileStyles('')).rejects.toThrow('File key is required');
    });

    it('deve retornar um objeto vazio quando não houver estilos', async () => {
      const emptyStyles = { meta: { styles: [] } };
      __mockClient.fileStyles.mockResolvedValueOnce({ data: emptyStyles });
      
      const result = await figmaService.getFileStyles('empty-file');
      
      expect(result).toEqual(emptyStyles);
    });

    it('deve lançar um erro quando a API retornar um erro', async () => {
      const error = new Error('API Error');
      error.response = { status: 500, data: { message: 'Internal Server Error' } };
      __mockClient.fileStyles.mockRejectedValueOnce(error);

      await expect(figmaService.getFileStyles('error-file')).rejects.toThrow('API Error');
    });
  });

  describe('getFileComponents', () => {
    it('deve lançar um erro quando a chave do arquivo for inválida', async () => {
      await expect(figmaService.getFileComponents('')).rejects.toThrow('File key is required');
    });

    it('deve retornar um objeto vazio quando não houver componentes', async () => {
      const emptyComponents = { meta: { components: [] } };
      __mockClient.fileComponents.mockResolvedValueOnce({ data: emptyComponents });
      
      const result = await figmaService.getFileComponents('empty-file');
      
      expect(result).toEqual(emptyComponents);
    });

    it('deve lançar um erro quando a API retornar um erro', async () => {
      const error = new Error('API Error');
      error.response = { status: 500, data: { message: 'Internal Server Error' } };
      __mockClient.fileComponents.mockRejectedValueOnce(error);

      await expect(figmaService.getFileComponents('error-file')).rejects.toThrow('API Error');
    });
  });
});
