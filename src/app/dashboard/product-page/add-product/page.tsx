"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProducts } from '@/contexts/ProductContext';
import { productSchema } from '@/schemas/ProductSchema';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';
import Image from 'next/image';

export default function AddProductForm() {
  const { addProduct } = useProducts();
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [avaliacao, setAvaliacao] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [emEstoque, setEmEstoque] = useState('Em Estoque');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // Estado para o preview da imagem
  const [error, setError] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);

    // Gerar o preview da imagem
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const parsedPreco = parseFloat(preco);
      const parsedAvaliacao = parseFloat(avaliacao);
      const parsedQuantidade = parseInt(quantidade, 10);

      // Validação com Zod
      productSchema.parse({
        nome,
        descricao,
        preco: parsedPreco,
        avaliacao: parsedAvaliacao,
        imagemUrl: imageFile ? '' : undefined,
        quantidade: parsedQuantidade,
        emEstoque,
      });

      // Adiciona o produto
      await addProduct(
        { nome, descricao, preco: parsedPreco, avaliacao: parsedAvaliacao, quantidade: parsedQuantidade, emEstoque },
        imageFile as File
      );

      // Limpar o formulário
      setNome('');
      setDescricao('');
      setPreco('');
      setAvaliacao('');
      setQuantidade('');
      setEmEstoque('Em Estoque');
      setImageFile(null); // Limpar a imagem
      setImagePreview(null); // Limpar o preview da imagem
      setError('');

      // Exibir notificação de sucesso
      toast({
        title: 'Sucesso!',
        description: 'Produto Adicionado com sucesso.',
        style: {
          width: '20rem',
          display: 'flex',
          justifyContent: 'center',
          background: "#166534",
          color: 'white',
          borderColor: '#166534',
        },
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setError(e.errors.map((err) => err.message).join(', '));
      } else {
        console.error(e);
        setError('Erro ao adicionar produto');
      }

      toast({
        title: 'Erro!',
        description: 'Erro ao adicionar produto.',
        style: {
          width: '20rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#991b1b',
          color: 'white',
          borderColor: '#991b1b',
        },
      });
    }
  };

  return (
    <div className="flex-1 overflow-auto flex flex-col lg:pl-5 lg:border-r-2 border-neutral-900 p-4">
      <div className="flex justify-between items-center">
        <span className="text-3xl font-bold">Adicionar Produto</span>
        <Link href="/dashboard/product-page">
          <Button className="w-36 h-12 bg-amber-400 text-neutral-900 font-bold hover:text-neutral-50 transition-colors">
            Voltar
          </Button>
        </Link>
      </div>
      <div className="mt-10 border-2 border-neutral-900 rounded-lg p-4">
        <form onSubmit={handleSubmit} className="space-y-10">
        <div className='flex flex-col items-center justify-center'>

            {/* Div do círculo para a imagem */}
            <div 
              className="relative w-32 h-32 rounded-full border-2 border-neutral-900 overflow-hidden cursor-pointer flex items-center justify-center"
              onClick={() => document.getElementById('imageInput')?.click()}
            >
              {/* Mostra o preview da imagem ou o ícone de upload */}
              {imagePreview ? (
                <Image width={70} height={70} src={imagePreview} alt="Preview" className="object-cover w-full h-full" />
              ) : (
                <span className="text-neutral-500 text-center">Clique para adicionar</span>
              )}
            </div>

            {/* Input de arquivo oculto */}
            <input 
              id="imageInput" 
              type="file" 
              accept="image/*"
              className="hidden" 
              onChange={handleImageChange} 
            />
            <label className='font-bold mb-2'>Imagem:</label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 mt-4">
            <div className="flex flex-col font-bold">
              <label>Nome:</label>
              <Input
                className="border-neutral-900 border-2"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <div className="flex flex-col font-bold">
              <label>Descrição:</label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="h-12 rounded-lg bg-transparent text-slate-50 border-neutral-900 border-2 transition-colors hover:border-amber-400 focus:border-amber-400 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 px-3 py-1 text-sm shadow-sm focus-visible:border-amber-400"
              />
            </div>
            <div className="flex flex-col font-bold">
              <label>Preço:</label>
              <Input
                className="border-neutral-900 border-2"
                type="number"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
              />
            </div>
            <div className="flex flex-col font-bold">
              <label>Avaliação:</label>
              <Input
                className="border-neutral-900 border-2"
                type="number"
                value={avaliacao}
                onChange={(e) => setAvaliacao(e.target.value)}
              />
            </div>
            <div className="flex flex-col font-bold">
              <label>Quantidade:</label>
              <Input
                className="border-neutral-900 border-2"
                type="number"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
              />
            </div>
            <div className="flex flex-col font-bold">
              <label>Em Estoque:</label>
              <select
                value={emEstoque}
                onChange={(e) => setEmEstoque(e.target.value)}
                className="h-12 rounded-lg bg-neutral-900 text-slate-50 border-neutral-900 border-2 transition-colors hover:border-amber-400 focus:border-amber-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-50 px-3 py-1 text-sm shadow-sm"
              >
                <option value="Em Estoque">Em Estoque</option>
                <option value="Esgotado">Esgotado</option>
              </select>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <Button
              type="submit"
              className="w-40 h-12 bg-amber-400 text-neutral-900 font-bold hover:text-neutral-50 transition-colors"
            >
              Adicionar Produto
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
