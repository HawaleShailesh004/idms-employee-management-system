export const validateEmail = (value) => {
  if (!value?.trim()) return 'Email is required';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(value.trim())) return 'Enter a valid email address';
  return '';
};

export const validatePhone = (value) => {
  if (!value?.trim()) return 'Contact is required';
  if (!/^\d{10}$/.test(value.trim())) return 'Phone number must be exactly 10 digits';
  return '';
};

export const validateRequired = (value, label) => {
  if (!value?.toString().trim()) return `${label} is required`;
  return '';
};

export const isValidImageFile = (file) => {
  if (!file) return false;
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/pjpeg'];
  const ext = file.name?.split('.').pop()?.toLowerCase() || '';
  const allowedExt = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  if (file.type && allowedTypes.includes(file.type)) return true;
  return allowedExt.includes(ext);
};

export const validateEmployeeForm = (form, isEdit = false, photoFile = null, existingPhotoUrl = '') => {
  const errors = {};
  const nameErr = validateRequired(form.fullName, 'Full name');
  if (nameErr) errors.fullName = nameErr;

  const emailErr = validateEmail(form.email);
  if (emailErr) errors.email = emailErr;

  const phoneErr = validatePhone(form.phone);
  if (phoneErr) errors.phone = phoneErr;

  if (!form.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
  if (!form.gender) errors.gender = 'Gender is required';
  if (!form.department) errors.department = 'Department is required';
  if (!form.designation) errors.designation = 'Designation is required';

  const hasPhoto = isEdit ? Boolean(photoFile || existingPhotoUrl) : Boolean(photoFile);
  if (!hasPhoto) errors.photo = 'Employee photo is required';

  return errors;
};
