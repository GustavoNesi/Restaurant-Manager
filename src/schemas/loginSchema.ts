import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: "Credenciais Inválidas" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
});
