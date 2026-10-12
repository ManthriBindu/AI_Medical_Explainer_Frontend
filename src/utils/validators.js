export const isValidEmail = (email) => {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const isValidPassword = (password) => {
  return typeof password === 'string' && password.length >= 6;
};

export const validateMedicineForm = (data) => {
  const errors = {};
  if (!data.medicineName || !data.medicineName.trim()) {
    errors.medicineName = 'Medicine name is required.';
  }
  if (!data.dosage || !data.dosage.trim()) {
    errors.dosage = 'Dosage is required (e.g., 500 mg or 1 tablet).';
  }
  if (!data.frequency || !data.frequency.trim()) {
    errors.frequency = 'Frequency is required (e.g., Once daily, Twice daily).';
  }
  return errors;
};
