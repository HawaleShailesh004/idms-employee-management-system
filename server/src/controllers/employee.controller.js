import { body, param } from 'express-validator';
import { DEPARTMENTS, DESIGNATIONS, GENDERS } from '../constants/lookups.js';
import * as employeeService from '../services/employee.service.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';

const employeeBodyValidation = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('phone')
    .trim()
    .matches(/^\d{10}$/)
    .withMessage('Phone number must be exactly 10 digits'),
  body('dateOfBirth')
    .trim()
    .notEmpty()
    .withMessage('Date of birth is required')
    .isISO8601({ strict: false })
    .withMessage('Valid date of birth is required'),
  body('gender').isIn(GENDERS).withMessage('Gender is required'),
  body('department').isIn(DEPARTMENTS).withMessage('Valid department is required'),
  body('designation').isIn(DESIGNATIONS).withMessage('Valid designation is required'),
];

export const createValidation = [...employeeBodyValidation];

export const requirePhotoOnCreate = (req, res, next) => {
  if (!req.file) {
    return sendError(res, { status: 400, message: 'Employee photo is required' });
  }
  next();
};

export const updateValidation = [
  param('id').isMongoId().withMessage('Invalid employee id'),
  ...employeeBodyValidation,
];

export const idValidation = [param('id').isMongoId().withMessage('Invalid employee id')];

export const getLookups = (_req, res) => {
  return sendSuccess(res, {
    message: 'Lookups fetched',
    data: {
      departments: DEPARTMENTS,
      designations: DESIGNATIONS,
      genders: GENDERS,
    },
  });
};

export const getEmployees = async (req, res) => {
  const result = await employeeService.listEmployees(req.query);
  return sendSuccess(res, { message: 'Employees fetched', data: result });
};

export const getEmployee = async (req, res) => {
  const employee = await employeeService.getEmployeeById(req.params.id);
  if (!employee) return sendError(res, { status: 404, message: 'Employee not found' });
  return sendSuccess(res, { message: 'Employee fetched', data: { employee } });
};

export const createEmployee = async (req, res) => {
  const employee = await employeeService.createEmployee(
    {
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      dateOfBirth: req.body.dateOfBirth,
      gender: req.body.gender,
      department: req.body.department,
      designation: req.body.designation,
    },
    req.file
  );
  return sendSuccess(res, { status: 201, message: 'Employee created', data: { employee } });
};

export const updateEmployee = async (req, res) => {
  const employee = await employeeService.updateEmployee(
    req.params.id,
    {
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      dateOfBirth: req.body.dateOfBirth,
      gender: req.body.gender,
      department: req.body.department,
      designation: req.body.designation,
    },
    req.file
  );
  if (!employee) return sendError(res, { status: 404, message: 'Employee not found' });
  return sendSuccess(res, { message: 'Employee updated', data: { employee } });
};

export const deleteEmployee = async (req, res) => {
  const deleted = await employeeService.deleteEmployee(req.params.id);
  if (!deleted) return sendError(res, { status: 404, message: 'Employee not found' });
  return sendSuccess(res, { message: 'Employee deleted' });
};
