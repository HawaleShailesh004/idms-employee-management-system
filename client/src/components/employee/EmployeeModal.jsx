import { useEffect, useRef, useState } from 'react';
import api from '../../api/axios';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import Select from '../common/Select';
import { useToast } from '../../context/ToastContext';
import { formatDobInput, parseDobInput } from '../../utils/formatDate';
import { isValidImageFile, validateEmployeeForm } from '../../utils/validation';
import './EmployeeModal.css';

const emptyForm = {
  fullName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  gender: '',
  department: '',
  designation: '',
};

const EmployeeModal = ({ isOpen, onClose, onSaved, employee, lookups }) => {
  const { showSuccess, showError } = useToast();
  const isEdit = Boolean(employee);
  const [form, setForm] = useState(emptyForm);
  const [dobDisplay, setDobDisplay] = useState('');
  const [errors, setErrors] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [photoInputKey, setPhotoInputKey] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const datePickerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    if (employee) {
      const dob = employee.dateOfBirth || '';
      setForm({
        fullName: employee.fullName || '',
        email: employee.email || '',
        phone: employee.phone || '',
        dateOfBirth: dob,
        gender: employee.gender || '',
        department: employee.department || '',
        designation: employee.designation || '',
      });
      setDobDisplay(formatDobInput(dob));
    } else {
      setForm(emptyForm);
      setDobDisplay('');
    }
    setPhotoFile(null);
    setPhotoInputKey((k) => k + 1);
    setErrors({});
  }, [isOpen, employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const digits = value.replace(/\D/g, '').slice(0, 10);
      setForm((prev) => ({ ...prev, phone: digits }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleDobDisplayChange = (e) => {
    const value = e.target.value;
    setDobDisplay(value);
    const iso = parseDobInput(value);
    if (iso) {
      setForm((prev) => ({ ...prev, dateOfBirth: iso }));
      setErrors((prev) => ({ ...prev, dateOfBirth: '' }));
    } else if (!value.trim()) {
      setForm((prev) => ({ ...prev, dateOfBirth: '' }));
      setErrors((prev) => ({ ...prev, dateOfBirth: '' }));
    } else {
      setForm((prev) => ({ ...prev, dateOfBirth: '' }));
    }
  };

  const handleDobBlur = () => {
    if (!dobDisplay.trim()) return;
    const iso = parseDobInput(dobDisplay);
    if (!iso) {
      setErrors((prev) => ({ ...prev, dateOfBirth: 'Use dd-mm-yyyy format' }));
    } else {
      setDobDisplay(formatDobInput(iso));
    }
  };

  const handleDatePickerChange = (e) => {
    const iso = e.target.value;
    setForm((prev) => ({ ...prev, dateOfBirth: iso }));
    setDobDisplay(formatDobInput(iso));
    setErrors((prev) => ({ ...prev, dateOfBirth: '' }));
  };

  const openDatePicker = () => {
    datePickerRef.current?.showPicker?.() || datePickerRef.current?.click();
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isValidImageFile(file)) {
      setErrors((prev) => ({ ...prev, photo: 'Only image files (jpeg, png, gif, webp) are allowed' }));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, photo: 'Image must be 2MB or smaller' }));
      return;
    }

    setPhotoFile(file);
    setErrors((prev) => ({ ...prev, photo: '' }));
  };

  const buildFormData = () => {
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    if (photoFile) {
      data.append('photo', photoFile, photoFile.name);
    }
    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let submitForm = { ...form };
    if (dobDisplay.trim()) {
      const iso = parseDobInput(dobDisplay);
      if (!iso) {
        setErrors((prev) => ({ ...prev, dateOfBirth: 'Use dd-mm-yyyy format' }));
        return;
      }
      submitForm = { ...submitForm, dateOfBirth: iso };
    }

    const validationErrors = validateEmployeeForm(
      submitForm,
      isEdit,
      photoFile,
      employee?.photoUrl || ''
    );
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      Object.entries(submitForm).forEach(([key, value]) => data.append(key, value));
      if (photoFile) {
        data.append('photo', photoFile, photoFile.name);
      }
      if (isEdit) {
        await api.put(`/employees/${employee._id}`, data);
        showSuccess('Employee updated successfully');
      } else {
        await api.post('/employees', data);
        showSuccess('Employee created successfully');
      }
      onSaved();
      onClose();
    } catch (err) {
      showError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      variant="employee"
      title={isEdit ? 'Edit Employee' : 'Create Employee'}
      footer={
        <Button
          variant="save"
          type="submit"
          form="employee-form"
          disabled={submitting}
        >
          {submitting ? 'Saving...' : 'Save'}
        </Button>
      }
    >
      <form id="employee-form" className="employee-form" onSubmit={handleSubmit} noValidate>
        <div className="employee-form__grid">
          <Input
            label="Full Name"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Enter name"
            error={errors.fullName}
            required
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter Email"
            error={errors.email}
            required
          />
          <Input
            label="Contact"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Enter contact"
            error={errors.phone}
            required
          />
          <Select
            label="Gender"
            name="gender"
            value={form.gender}
            onChange={handleChange}
            options={lookups.genders}
            placeholder="Select"
            error={errors.gender}
            required
          />

          <div className={`field date-field ${errors.dateOfBirth ? 'field--error' : ''}`}>
            <label className="field__label" htmlFor="dateOfBirth">
              Date of Birth<span className="field__required">*</span>
            </label>
            <div className="date-field__wrap">
              <input
                id="dateOfBirth"
                name="dateOfBirthDisplay"
                type="text"
                className="field__input date-field__input"
                value={dobDisplay}
                onChange={handleDobDisplayChange}
                onBlur={handleDobBlur}
                placeholder="dd-mm-yyyy"
                autoComplete="off"
              />
              <button
                type="button"
                className="date-field__icon-btn"
                onClick={openDatePicker}
                aria-label="Open calendar"
              >
                <img src="/assets/date-icon.svg" alt="" className="date-field__icon" aria-hidden />
              </button>
              <input
                ref={datePickerRef}
                type="date"
                className="date-field__native"
                value={form.dateOfBirth}
                onChange={handleDatePickerChange}
                tabIndex={-1}
                aria-hidden
              />
            </div>
            {errors.dateOfBirth && <span className="field__error">{errors.dateOfBirth}</span>}
          </div>

          <Select
            label="Department"
            name="department"
            value={form.department}
            onChange={handleChange}
            options={lookups.departments}
            placeholder="Select"
            error={errors.department}
            required
          />
          <Select
            label="Designation"
            name="designation"
            value={form.designation}
            onChange={handleChange}
            options={lookups.designations}
            placeholder="Select"
            error={errors.designation}
            required
          />

          <div className={`field photo-field ${errors.photo ? 'field--error' : ''}`}>
            <label className="field__label" htmlFor="photo">
              Employee Photo<span className="field__required">*</span>
            </label>
            <div className="photo-field__control">
              <label htmlFor="photo" className="photo-field__upload">
                Upload Photo
              </label>
              <img src="/assets/dropdown-custom.svg" alt="" className="photo-field__chevron" aria-hidden />
              <input
                key={photoInputKey}
                id="photo"
                name="photo"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                className="photo-field__input"
                onChange={handlePhotoChange}
              />
            </div>
            {errors.photo && <span className="field__error">{errors.photo}</span>}
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default EmployeeModal;
