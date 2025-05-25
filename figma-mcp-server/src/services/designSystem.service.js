import _ from 'lodash';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import figmaService from './figma.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DesignSystemService {
  constructor() {
    this.outputDir = path.join(process.cwd(), 'design-system-docs');
  }

  async generateDesignSystem(fileKey) {
    try {
      // Criar diretório de saída se não existir
      await fs.mkdir(this.outputDir, { recursive: true });

      // Obter dados do Figma
      const [fileData, stylesData, componentsData] = await Promise.all([
        figmaService.getFile(fileKey),
        figmaService.getFileStyles(fileKey),
        figmaService.getFileComponents(fileKey)
      ]);

      // Processar estilos
      const styles = this.processStyles(stylesData.meta?.styles || []);
      
      // Processar componentes
      const components = this.processComponents(componentsData.meta?.components || []);

      // Gerar documentação
      await this.generateDocumentation({
        file: fileData,
        styles,
        components
      });

      return {
        success: true,
        outputDir: this.outputDir,
        fileKey,
        stats: {
          styles: styles.length,
          components: components.length
        }
      };
    } catch (error) {
      console.error('Error generating design system:', error);
      throw error;
    }
  }

  processStyles(styles) {
    return styles.map(style => ({
      id: style.node_id,
      name: style.name,
      description: style.description || '',
      type: style.style_type.toLowerCase(),
      fileKey: style.file_key,
      nodeId: style.node_id,
      remote: style.remote || false
    }));
  }

  processComponents(components) {
    return components.map(component => ({
      id: component.node_id,
      name: component.name,
      description: component.description || '',
      fileKey: component.file_key,
      nodeId: component.node_id,
      remote: component.remote || false,
      thumbnailUrl: component.thumbnail_url || ''
    }));
  }

  async generateDocumentation(data) {
    const { file, styles, components } = data;
    
    // Criar diretório de assets
    const assetsDir = path.join(this.outputDir, 'assets');
    await fs.mkdir(assetsDir, { recursive: true });

    // Gerar página principal
    await this.generateIndexPage(file, { styles, components });
    
    // Gerar páginas de estilos
    await this.generateStylesPages(styles);
    
    // Gerar páginas de componentes
    await this.generateComponentsPages(components);
  }

  async generateIndexPage(file, { styles, components }) {
    const content = `# ${file.name} - Design System

## Visão Geral

Este documento contém a documentação do design system.

## Estilos

Total de estilos: ${styles.length}

## Componentes

Total de componentes: ${components.length}
`;

    await fs.writeFile(
      path.join(this.outputDir, 'index.md'),
      content,
      'utf-8'
    );
  }

  async generateStylesPages(styles) {
    const stylesDir = path.join(this.outputDir, 'styles');
    await fs.mkdir(stylesDir, { recursive: true });

    // Agrupar estilos por tipo
    const stylesByType = _.groupBy(styles, 'type');

    // Criar índice de estilos
    let stylesIndex = '# Estilos\n\n';
    
    for (const [type, styleGroup] of Object.entries(stylesByType)) {
      stylesIndex += `## ${_.startCase(type)}\n\n`;
      
      for (const style of styleGroup) {
        stylesIndex += `- [${style.name}](${type}/${style.id}.md)\n`;
        
        // Criar página individual para cada estilo
        await this.generateStylePage(stylesDir, type, style);
      }
      
      stylesIndex += '\n';
    }

    await fs.writeFile(
      path.join(stylesDir, 'README.md'),
      stylesIndex,
      'utf-8'
    );
  }

  async generateStylePage(stylesDir, type, style) {
    const typeDir = path.join(stylesDir, type);
    await fs.mkdir(typeDir, { recursive: true });

    const content = `# ${style.name}

**Tipo:** ${_.startCase(type)}\n
**ID do Nó:** ${style.nodeId}\n

${style.description || 'Sem descrição fornecida.'}
`;

    await fs.writeFile(
      path.join(typeDir, `${style.id}.md`),
      content,
      'utf-8'
    );
  }

  async generateComponentsPages(components) {
    const componentsDir = path.join(this.outputDir, 'components');
    await fs.mkdir(componentsDir, { recursive: true });

    // Criar índice de componentes
    let componentsIndex = '# Componentes\n\n';
    
    for (const component of components) {
      componentsIndex += `- [${component.name}](${component.id}.md)\n`;
      
      // Criar página individual para cada componente
      await this.generateComponentPage(componentsDir, component);
    }

    await fs.writeFile(
      path.join(componentsDir, 'README.md'),
      componentsIndex,
      'utf-8'
    );
  }

  async generateComponentPage(componentsDir, component) {
    const content = `# ${component.name}

**ID do Nó:** ${component.nodeId}\n
**Remoto:** ${component.remote ? 'Sim' : 'Não'}\n

${component.description || 'Sem descrição fornecida.'}

${component.thumbnailUrl ? `![Thumbnail](${component.thumbnailUrl})` : ''}
`;

    await fs.writeFile(
      path.join(componentsDir, `${component.id}.md`),
      content,
      'utf-8'
    );
  }
}

export default new DesignSystemService();
