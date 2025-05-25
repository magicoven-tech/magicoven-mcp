import { Router } from 'express';
import figmaController from '../controllers/figma.controller.js';

const router = Router();

// Figma API Routes
router.get('/files/:fileKey', figmaController.getFile);
router.get('/files/:fileKey/nodes', figmaController.getFileNodes);
router.get('/files/:fileKey/styles', figmaController.getFileStyles);
router.get('/files/:fileKey/components', figmaController.getFileComponents);

// Design System Documentation
router.get('/design-system/:fileKey', figmaController.generateDesignSystemDoc);
router.get('/design-tokens/:fileKey', figmaController.generateDesignTokens);

export default router;
