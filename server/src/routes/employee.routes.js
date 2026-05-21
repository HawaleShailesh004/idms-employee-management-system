import { Router } from 'express';
import * as employeeController from '../controllers/employee.controller.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.use(protect);

router.get('/lookups', employeeController.getLookups);
router.get('/', employeeController.getEmployees);
router.get('/:id', employeeController.idValidation, validate, employeeController.getEmployee);
router.post(
  '/',
  upload.single('photo'),
  employeeController.requirePhotoOnCreate,
  employeeController.createValidation,
  validate,
  employeeController.createEmployee
);
router.put(
  '/:id',
  upload.single('photo'),
  employeeController.updateValidation,
  validate,
  employeeController.updateEmployee
);
router.delete(
  '/:id',
  employeeController.idValidation,
  validate,
  employeeController.deleteEmployee
);

export default router;
