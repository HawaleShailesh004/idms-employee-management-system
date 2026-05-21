import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post('/login', authController.loginValidation, validate, authController.login);
router.post('/logout', authController.logout);
router.get('/me', protect, authController.getMe);

export default router;
