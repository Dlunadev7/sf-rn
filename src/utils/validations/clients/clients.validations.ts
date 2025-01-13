import * as Yup from 'yup';

export const validationClientSchema = Yup.object().shape({
  name: Yup.string()
    .required('Nombre es obligatorio')
    .min(1, 'El nombre debe tener al menos 1 caracter')
    .max(30, 'El nombre no debe tener más de 30 caracteres'),
  competenceName: Yup.string()
    .optional()
    .min(1, 'El nombre de la empresa debe tener al menos 1 caracter')
    .max(30, 'El nombre de la empresa no debe tener más de 30 caracteres'),
  phone: Yup.string()
    .required('Contacto es obligatorio')
    .matches(/^\d{1,20}$/, 'El contacto debe contener solo números y un máximo de 20 caracteres'),
  additionalContact: Yup.string()
    .nullable()
    .matches(/^\d{1,20}$/, 'El contacto adicional debe contener solo números y un máximo de 20 caracteres'),
  address: Yup.string()
    .required('Dirección es obligatoria')
    .min(1, 'La dirección debe tener al menos 1 caracter')
    .max(100, 'La dirección no debe tener más de 100 caracteres'),
  latitude: Yup.string().optional().nullable(),
  longitude: Yup.string().optional().nullable(),
  managerName: Yup.string()
    .required('El representante es obligatorio')
    .min(1, 'El nombre del representante debe tener al menos 1 caracter')
    .max(30, 'El nombre del representante no debe tener más de 30 caracteres'),
  taxInfo: Yup.string().optional(),
  nextDue: Yup.string().optional(),
  rut: Yup.string()
    .required('Rut es obligatorio')
    .min(8, 'El RUT debe tener al menos 8 caracteres')
    .max(12, 'El RUT no debe tener más de 12 caracteres'),
  status: Yup.string().optional().nullable(),
  nextVisit: Yup.string().required('La fecha de visita es requerida'),
  department: Yup.string()
    .required('Departamento es obligatorio')
    .min(1, 'El departamento debe tener al menos 1 caracter')
    .max(30, 'El departamento no debe tener más de 30 caracteres'),
  neighborhood: Yup.string()
    .required('Barrio es obligatorio')
    .min(1, 'El barrio debe tener al menos 1 caracter')
    .max(30, 'El barrio no debe tener más de 30 caracteres'),
});

export const validationSaleSchema = Yup.object().shape({
  barCode: Yup.string()
    .matches(/^\d+$/, 'El código de barras debe contener solo números')
    .max(20, 'El código de barras no puede tener más de 20 caracteres')
    .required('Código de barras es requerido'),
  matricula: Yup.string().max(20, 'La matrícula no puede tener más de 20 caracteres').required('Matrícula es requerida'),
  unitNumber: Yup.string()
    .matches(/^\d+$/, 'N° UNIT debe contener solo números')
    .max(20, 'N° UNIT no puede tener más de 20 caracteres')
    .required('N° UNIT es requerido'),
  saleDate: Yup.string().required('Fecha de venta es requerida'),
  unitNumberFactory: Yup.string()
    .matches(/^\d*$/, 'N° UNIT de fábrica debe contener solo números')
    .max(20, 'N° UNIT de fábrica no puede tener más de 20 caracteres')
    .optional(),
  percent: Yup.string()
    .matches(/^\d*$/, 'Porcentaje debe contener solo números')
    .max(3, 'Porcentaje no puede tener más de 3 caracteres')
    .optional(),
});

export const validationPaymentSchema = Yup.object({
  saleDate: Yup.string().required('Fecha de venta es requerida'),
  deliveredBy: Yup.string()
    .matches(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/, 'El campo solo debe contener letras')
    .required('La compra autorizada por es requerida'),
  discount: Yup.string().optional(),
  subTotal: Yup.number().optional(),
  iva: Yup.number().required('IVA es requerido').positive('Debe ser un número positivo').default(22),
  total: Yup.number().optional(),
  delivered: Yup.boolean(),
  paymentMethod: Yup.string().required('Forma de pago es requerida'),
});
