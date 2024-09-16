import { z } from 'zod';

export const productSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  preco: z.number().min(0, 'Preço deve ser um número positivo'),
  avaliacao: z.number().min(0, 'Avaliação deve ser um número positivo'),
  quantidade: z.number().min(0, 'Quantidade deve ser um número positivo'),
  emEstoque: z.enum(['Em Estoque', 'Fora de Estoque']),
});
