// Mock do cliente Figma
const mockFigmaClient = {
  file: jest.fn().mockResolvedValue({ 
    data: { 
      document: { id: '0:0', name: 'Test File' },
      name: 'Test File',
      lastModified: '2023-01-01T00:00:00Z',
      thumbnailUrl: 'https://example.com/thumbnail.png'
    } 
  }),
  fileNodes: jest.fn().mockResolvedValue({ 
    data: { 
      nodes: { 
        '0:1': { document: { id: '0:1', name: 'Node 1' } } 
      } 
    } 
  }),
  fileStyles: jest.fn().mockResolvedValue({ 
    data: { 
      meta: { 
        styles: [{ id: '1:1', name: 'Style 1', type: 'FILL' }] 
      } 
    } 
  }),
  fileComponents: jest.fn().mockResolvedValue({ 
    data: { 
      meta: { 
        components: [{ id: '2:2', name: 'Component 1' }] 
      } 
    } 
  })
};

// Mock do módulo figma-js
const Client = jest.fn().mockImplementation(() => mockFigmaClient);

// Exportar o mock para ser usado nos testes
module.exports = {
  Client,
  mockFigmaClient,
  __mockFigmaClient: mockFigmaClient,
};

// Para compatibilidade com import/export
module.exports.default = {
  Client,
  mockFigmaClient,
  __mockFigmaClient: mockFigmaClient,
};
