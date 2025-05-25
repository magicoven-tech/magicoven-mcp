import { Client } from 'figma-js';
import config from '../config/config.js';

export default class FigmaService {
  constructor(client) {
    // Permite injetar um cliente personalizado (útil para testes)
    if (client) {
      this.client = client;
    } else if (config.figma && config.figma.accessToken) {
      this.client = Client({
        personalAccessToken: config.figma.accessToken
      });
    } else {
      throw new Error('Figma access token is not configured');
    }
  }

  async getFile(fileKey) {
    if (!fileKey) {
      throw new Error('File key is required');
    }

    if (!process.env.FIGMA_ACCESS_TOKEN) {
      throw new Error('Figma access token is not configured');
    }

    try {
      const { data } = await this.client.file(fileKey);
      return data;
    } catch (error) {
      console.error('Error fetching Figma file:', error);
      throw error;
    }
  }

  async getFileNodes(fileKey, nodeIds) {
    if (!fileKey) {
      throw new Error('File key is required');
    }

    if (!nodeIds || !Array.isArray(nodeIds) || nodeIds.length === 0 || nodeIds.some(id => !id)) {
      throw new Error('Node IDs are required');
    }

    try {
      const { data } = await this.client.fileNodes(fileKey, nodeIds);
      return data;
    } catch (error) {
      console.error('Error fetching Figma nodes:', error);
      throw error;
    }
  }

  async getFileStyles(fileKey) {
    if (!fileKey) {
      throw new Error('File key is required');
    }

    try {
      const { data } = await this.client.fileStyles(fileKey);
      return data || { meta: { styles: [] } };
    } catch (error) {
      console.error('Error fetching Figma styles:', error);
      throw error;
    }
  }

  async getFileComponents(fileKey) {
    if (!fileKey) {
      throw new Error('File key is required');
    }

    try {
      const { data } = await this.client.fileComponents(fileKey);
      return data || { meta: { components: [] } };
    } catch (error) {
      console.error('Error fetching Figma components:', error);
      throw error;
    }
  }
}

// Class is now exported as default
