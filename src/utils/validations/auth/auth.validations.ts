import * as Yup from 'yup';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('*Ingrese un correo válido.')
    .required('*Este campo debe contener una dirección de correo válida vinculada a la plataforma.'),
  password: Yup.string()
    .min(6, '*Este campo debe contener mínimo 6 caracteres.')
    .max(20, '*Este campo debe contener máximo 20 caracteres.')
    .required('*La contraseña es obligatoria.'),
});

const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .email('*Ingrese un correo válido')
    .required('*Este campo debe contener una direccion de correo válida vinculada a la plataforma.'),
});

const newPasswordSchema = Yup.object({
  password: Yup.string()
    .min(6, '*Este campo debe contener mínimo 6 caracteres.')
    .max(20, '*Este campo debe contener máximo 20 caracteres.')
    .required('*La contraseña es obligatoria.'),
  confirmPassword: Yup.string()
    .required('La contraseña es obligatoria')
    .oneOf([Yup.ref('password')], '*Las contraseñas deben coincidir.'),
});

export { validationSchema, forgotPasswordSchema, newPasswordSchema };
