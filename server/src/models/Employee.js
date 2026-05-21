import mongoose from 'mongoose';
import { DEPARTMENTS, DESIGNATIONS, GENDERS } from '../constants/lookups.js';

const employeeSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: GENDERS,
    },
    department: {
      type: String,
      required: true,
      enum: DEPARTMENTS,
      index: true,
    },
    designation: {
      type: String,
      required: true,
      enum: DESIGNATIONS,
      index: true,
    },
    photo: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

employeeSchema.index({ fullName: 'text', email: 'text', department: 'text' });

export const Employee = mongoose.model('Employee', employeeSchema);
