// Funções de validação

export interface ValidationError {
  field: string;
  message: string;
}

export const validateRequired = (value: any, fieldName: string): ValidationError | null => {
  if (value === undefined || value === null || value === '') {
    return {
      field: fieldName,
      message: `O campo ${fieldName} é obrigatório`
    };
  }
  return null;
};

export const validateEmail = (email: string, fieldName: string = 'email'): ValidationError | null => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!emailRegex.test(email)) {
    return {
      field: fieldName,
      message: 'Email inválido'
    };
  }
  
  return null;
};

export const validatePhone = (phone: string, fieldName: string = 'telefone'): ValidationError | null => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length < 10 || cleaned.length > 11) {
    return {
      field: fieldName,
      message: 'Telefone inválido'
    };
  }
  
  return null;
};

export const validateCPF = (cpf: string, fieldName: string = 'CPF'): ValidationError | null => {
  const cleaned = cpf.replace(/\D/g, '');
  
  if (cleaned.length !== 11) {
    return {
      field: fieldName,
      message: 'CPF deve ter 11 dígitos'
    };
  }
  
  // Validação básica de CPF
  if (/^(\d)\1+$/.test(cleaned)) {
    return {
      field: fieldName,
      message: 'CPF inválido'
    };
  }
  
  return null;
};

export const validateCNPJ = (cnpj: string, fieldName: string = 'CNPJ'): ValidationError | null => {
  const cleaned = cnpj.replace(/\D/g, '');
  
  if (cleaned.length !== 14) {
    return {
      field: fieldName,
      message: 'CNPJ deve ter 14 dígitos'
    };
  }
  
  // Validação básica de CNPJ
  if (/^(\d)\1+$/.test(cleaned)) {
    return {
      field: fieldName,
      message: 'CNPJ inválido'
    };
  }
  
  return null;
};

export const validateCEP = (cep: string, fieldName: string = 'CEP'): ValidationError | null => {
  const cleaned = cep.replace(/\D/g, '');
  
  if (cleaned.length !== 8) {
    return {
      field: fieldName,
      message: 'CEP deve ter 8 dígitos'
    };
  }
  
  return null;
};

export const validatePassword = (password: string, fieldName: string = 'senha'): ValidationError | null => {
  if (password.length < 6) {
    return {
      field: fieldName,
      message: 'A senha deve ter no mínimo 6 caracteres'
    };
  }
  
  return null;
};

export const validatePasswordMatch = (
  password: string,
  confirmPassword: string,
  fieldName: string = 'confirmação de senha'
): ValidationError | null => {
  if (password !== confirmPassword) {
    return {
      field: fieldName,
      message: 'As senhas não conferem'
    };
  }
  
  return null;
};

export const validateNumber = (
  value: number | string,
  fieldName: string = 'número',
  options?: { min?: number; max?: number }
): ValidationError | null => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) {
    return {
      field: fieldName,
      message: `O campo ${fieldName} deve ser um número válido`
    };
  }
  
  if (options?.min !== undefined && num < options.min) {
    return {
      field: fieldName,
      message: `O campo ${fieldName} deve ser maior ou igual a ${options.min}`
    };
  }
  
  if (options?.max !== undefined && num > options.max) {
    return {
      field: fieldName,
      message: `O campo ${fieldName} deve ser menor ou igual a ${options.max}`
    };
  }
  
  return null;
};

export const validateDate = (
  date: string | Date,
  fieldName: string = 'data',
  options?: { min?: Date; max?: Date }
): ValidationError | null => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return {
      field: fieldName,
      message: `Data inválida`
    };
  }
  
  if (options?.min && dateObj < options.min) {
    return {
      field: fieldName,
      message: `A data deve ser posterior a ${options.min.toLocaleDateString()}`
    };
  }
  
  if (options?.max && dateObj > options.max) {
    return {
      field: fieldName,
      message: `A data deve ser anterior a ${options.max.toLocaleDateString()}`
    };
  }
  
  return null;
};

export const validateUrl = (url: string, fieldName: string = 'URL'): ValidationError | null => {
  try {
    new URL(url);
    return null;
  } catch {
    return {
      field: fieldName,
      message: 'URL inválida'
    };
  }
};

export const validateFileSize = (
  file: File,
  maxSize: number,
  fieldName: string = 'arquivo'
): ValidationError | null => {
  if (file.size > maxSize) {
    return {
      field: fieldName,
      message: `O arquivo deve ter no máximo ${maxSize / 1024 / 1024}MB`
    };
  }
  
  return null;
};

export const validateFileType = (
  file: File,
  allowedTypes: string[],
  fieldName: string = 'arquivo'
): ValidationError | null => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  if (!extension || !allowedTypes.includes(`.${extension}`)) {
    return {
      field: fieldName,
      message: `Tipo de arquivo não permitido. Extensões permitidas: ${allowedTypes.join(', ')}`
    };
  }
  
  return null;
};

export const validateForm = <T extends Record<string, any>>(
  data: T,
  validations: {
    [K in keyof T]?: (value: T[K]) => ValidationError | null;
  }
): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  Object.entries(validations).forEach(([field, validate]) => {
    if (validate) {
      const error = validate(data[field]);
      if (error) {
        errors.push(error);
      }
    }
  });
  
  return errors;
};

export const isValidCPF = (cpf: string): boolean => {
  return validateCPF(cpf) === null;
};

export const isValidCNPJ = (cnpj: string): boolean => {
  return validateCNPJ(cnpj) === null;
};

export const isValidEmail = (email: string): boolean => {
  return validateEmail(email) === null;
};

export const isValidPhone = (phone: string): boolean => {
  return validatePhone(phone) === null;
};

export const isValidCEP = (cep: string): boolean => {
  return validateCEP(cep) === null;
};

export const isValidUrl = (url: string): boolean => {
  return validateUrl(url) === null;
};