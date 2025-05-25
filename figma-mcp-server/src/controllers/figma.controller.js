import FigmaService from '../services/figma.service.js';
import designSystemService from '../services/designSystem.service.js';
import config from '../config/config.js';

// Create a singleton instance of FigmaService
const figmaService = new FigmaService();

const figmaController = {
  getFile: async (req, res) => {
    try {
      const { fileKey } = req.params;
      const data = await figmaService.getFile(fileKey);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getFileNodes: async (req, res) => {
    try {
      const { fileKey } = req.params;
      const { ids } = req.query;
      const nodeIds = ids ? ids.split(',') : [];
      const data = await figmaService.getFileNodes(fileKey, nodeIds);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getFileStyles: async (req, res) => {
    try {
      const { fileKey } = req.params;
      const data = await figmaService.getFileStyles(fileKey);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getFileComponents: async (req, res) => {
    try {
      const { fileKey } = req.params;
      const data = await figmaService.getFileComponents(fileKey);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  generateDesignSystemDoc: async (req, res) => {
    try {
      const { fileKey } = req.params;
      const result = await designSystemService.generateDesignSystem(fileKey);
      res.json({
        success: true,
        message: 'Documentação do design system gerada com sucesso',
        ...result
      });
    } catch (error) {
      console.error('Erro ao gerar documentação do design system:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Falha ao gerar documentação do design system',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  generateDesignTokens: async (req, res) => {
    try {
      const { fileKey } = req.params;
      // Implementar lógica para gerar tokens de design
      res.json({ 
        success: true,
        message: 'Endpoint de geração de tokens de design', 
        fileKey 
      });
    } catch (error) {
      console.error('Erro ao gerar tokens de design:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Falha ao gerar tokens de design',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

export default figmaController;
