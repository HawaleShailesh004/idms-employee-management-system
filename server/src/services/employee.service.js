import fs from 'fs';
import path from 'path';
import { Employee } from '../models/Employee.js';
import { uploadDirPath } from '../middleware/upload.js';

const formatEmployee = (doc) => {
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    ...obj,
    photoUrl: obj.photo ? `/uploads/${obj.photo}` : null,
    dateOfBirth: obj.dateOfBirth ? obj.dateOfBirth.toISOString().split('T')[0] : null,
  };
};

const buildFilter = ({ search, department, designation, gender }) => {
  const filter = {};

  if (search?.trim()) {
    const regex = new RegExp(search.trim(), 'i');
    filter.$or = [{ fullName: regex }, { email: regex }, { department: regex }];
  }

  if (department) filter.department = department;
  if (designation) filter.designation = designation;
  if (gender) filter.gender = gender;

  return filter;
};

export const listEmployees = async (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit, 10) || 10));
  const skip = (page - 1) * limit;
  const filter = buildFilter(query);

  const [items, total] = await Promise.all([
    Employee.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Employee.countDocuments(filter),
  ]);

  return {
    employees: items.map(formatEmployee),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
};

export const getEmployeeById = async (id) => {
  const employee = await Employee.findById(id);
  if (!employee) return null;
  return formatEmployee(employee);
};

const removePhotoFile = (filename) => {
  if (!filename) return;
  const filePath = path.join(uploadDirPath, filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
};

export const createEmployee = async (data, file) => {
  const payload = { ...data, photo: file?.filename || '' };
  const employee = await Employee.create(payload);
  return formatEmployee(employee);
};

export const updateEmployee = async (id, data, file) => {
  const existing = await Employee.findById(id);
  if (!existing) return null;

  if (file) {
    removePhotoFile(existing.photo);
    existing.photo = file.filename;
  }

  Object.assign(existing, data);
  await existing.save();
  return formatEmployee(existing);
};

export const deleteEmployee = async (id) => {
  const existing = await Employee.findById(id);
  if (!existing) return null;
  removePhotoFile(existing.photo);
  await existing.deleteOne();
  return true;
};
