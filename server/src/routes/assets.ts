import express from 'express';
import assetController from '../controllers/inventory/assetController';
import { authenticate, authorize } from '../middleware/auth';
import { validateAsset, validateAssetId } from '../middleware/assetValidation';

const router = express.Router();

router.use(authenticate);

router.get('/', assetController.getAllAssets);
router.get('/stats', assetController.getAssetStats);
router.get('/categories', assetController.getAssetCategories);
router.get('/export', assetController.exportAssets);
router.get('/:id', validateAssetId, assetController.getAssetById);

router.post('/', validateAsset, assetController.createAsset);
router.put('/bulk', assetController.bulkUpdateAssets);
router.put('/:id', validateAssetId, validateAsset, assetController.updateAsset);

router.delete('/bulk', authorize('admin'), assetController.bulkDeleteAssets);
router.delete('/:id', validateAssetId, authorize('admin'), assetController.deleteAsset);

export default router;