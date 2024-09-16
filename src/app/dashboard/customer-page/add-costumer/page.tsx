"use client"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from 'firebase/firestore';
import Link from 'next/link';
import { firestore, storage } from '@/lib/firebaseConfig';
import Image from 'next/image';

export default function AddProductForm() {
  const [nome, setNome] = useState('');
  const [cargo, setCargo] = useState('');
  const [salario, setSalario] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string); // Define o preview da imagem
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      let imageUrl = '';

      if (imageFile) {
        const imageRef = ref(storage, `employees/${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(firestore, "employees"), {
        nome,
        cargo,
        salario,
        email,
        telefone,
        senha,
        imagemUrl: imageUrl,
      });

      setNome('');
      setCargo('');
      setSalario('');
      setEmail('');
      setTelefone('');
      setSenha('');
      setImageFile(null);
      setImagePreview(null);

      toast({
        title: 'Sucesso!',
        description: 'Funcionário adicionado com sucesso.',
        style: {
          width: '20rem',
          display: 'flex',
          justifyContent: 'center',
          background: "#166534",
          color: 'white',
          borderColor: '#166534'
        }
      });

    } catch (e) {
      console.error(e);
      toast({
        title: 'Erro!',
        description: 'Erro ao adicionar funcionário.',
        style: {
          width: '20rem',
          display: 'flex',
          justifyContent: 'center',
          background: '#991b1b',
          color: 'white',
          borderColor: '#991b1b'
        }
      });
    }
  };

  return (
    <div className="flex-1 overflow-auto flex flex-col lg:pl-5 lg:border-r-2 border-neutral-900 p-4">
      <div className="flex justify-between items-center">
        <span className="text-3xl font-bold">Adicionar Funcionário</span>
        <Link href="/dashboard/customer-page">
          <Button className="w-36 h-12 bg-amber-400 text-neutral-900 font-bold hover:text-neutral-50 transition-colors">
            Voltar
          </Button>
        </Link>
      </div>
      <div className='mt-10 border-2 border-neutral-900 rounded-lg p-4'>
        <form onSubmit={handleSubmit} className='space-y-10'>
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
            <div className='flex flex-col font-bold'>
              <label>Nome:</label>
              <Input
                className='border-neutral-900 border-2'
                type="text"
                value={nome}
                onChange={e => setNome(e.target.value)}
              />
            </div>
            <div className='flex flex-col font-bold'>
              <label>Cargo:</label>
              <Input
                className='border-neutral-900 border-2'
                type="text"
                value={cargo}
                onChange={e => setCargo(e.target.value)}
              />
            </div>
            <div className='flex flex-col font-bold'>
              <label>Salário:</label>
              <Input
                className='border-neutral-900 border-2'
                type="number"
                value={salario}
                onChange={e => setSalario(e.target.value)}
              />
            </div>
            <div className='flex flex-col font-bold'>
              <label>Email:</label>
              <Input
                className='border-neutral-900 border-2'
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className='flex flex-col font-bold'>
              <label>Telefone:</label>
              <Input
                className='border-neutral-900 border-2'
                type="text"
                value={telefone}
                onChange={e => setTelefone(e.target.value)}
              />
            </div>
            <div className='flex flex-col font-bold'>
              <label>Senha:</label>
              <Input
                className='border-neutral-900 border-2'
                type="password"
                value={senha}
                onChange={e => setSenha(e.target.value)}
              />
            </div>
          </div>

          <div className='flex justify-center items-center'>
            <Button type="submit" className="w-40 h-12 bg-amber-400 text-neutral-900 font-bold hover:text-neutral-50 transition-colors">
              Adicionar funcionário
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
