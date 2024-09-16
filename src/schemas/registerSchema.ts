import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email({ message: "Email Inválido" }),
  password: z.string()
    .min(6, { message: "Senha deve ter pelo menos 6 caracteres" })
    .regex(/[A-Z]/, { message: "Senha deve conter pelo menos uma letra maiúscula" })
    .regex(/[!@#$%^&*()_+{}\[\]:;"'<>,.?~\\/-]/, { message: "Senha deve conter pelo menos um caractere especial" }),
  confirmPassword: z.string()
    .min(6, { message: "Confirmação de senha deve ter pelo menos 6 caracteres" })
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas devem coincidir",
  path: ["confirmPassword"],
});
