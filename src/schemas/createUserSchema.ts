import { z } from 'zod';

export const createUserSchema = z.object({
  username: z
    .string()
    .min(3, 'O nome de usuário deve ter no mínimo 3 caracteres.')
    .max(20, 'O nome de usuário deve ter no máximo 20 caracteres.'),
  email: z.string().email('Insira um e-mail válido.'),
  password: z
    .string()
    .min(6, 'A senha deve ter no mínimo 6 caracteres.')
    .max(100, 'A senha é muito longa.'),
  role: z.enum(['garçom', 'cozinheiro']),
});
