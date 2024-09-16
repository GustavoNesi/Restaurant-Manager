import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, getDocs, addDoc, doc, deleteDoc } from 'firebase/firestore'; // Importa deleteDoc e doc
import { firestore, storage } from '@/lib/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export interface Product {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  avaliacao: number;
  imagemUrl: string;
  quantidade: number;  
  emEstoque: string;  
}

interface ProductContextType {
  products: Product[];
  loading: boolean;
  addProduct: (newProduct: Omit<Product, 'id' | 'imagemUrl'>, imageFile: File) => Promise<void>;
  addImage: (imageFile: File) => Promise<string>;
  deleteProduct: (id: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const querySnapshot = await getDocs(collection(firestore, "products"));
      const productList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setProducts(productList);
    } catch (error) {
      console.error("Erro ao buscar os produtos: ", error);
    } finally {
      setLoading(false);
    }
  }

  async function addImage(imageFile: File): Promise<string> {
    try {
      if (!imageFile) {
        return '';
      }
      const imageRef = ref(storage, `images/${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      const imageUrl = await getDownloadURL(imageRef);
      return imageUrl;
    } catch (error) {
      console.error("Erro ao fazer upload da imagem: ", error);
      throw new Error('Erro ao adicionar a imagem');
    }
  }

  async function addProduct(newProduct: Omit<Product, 'id' | 'imagemUrl'>, imageFile: File) {
    try {
      const imagemUrl = await addImage(imageFile);

      // Adiciona o produto no Firestore
      await addDoc(collection(firestore, "products"), {
        ...newProduct,
        imagemUrl
      });

      // Atualiza a lista de produtos
      fetchProducts();
      console.log('Produto adicionado com sucesso');
    } catch (error) {
      console.error("Erro ao adicionar o produto: ", error);
      throw new Error('Erro ao adicionar o produto');
    }
  }

  async function deleteProduct(id: string) {
    try {
      const productRef = doc(firestore, "products", id);
      await deleteDoc(productRef);
      fetchProducts(); // Atualiza a lista de produtos
    } catch (error) {
      console.error("Erro ao deletar o produto: ", error);
      throw new Error('Erro ao deletar o produto');
    }
  }

  return (
    <ProductContext.Provider value={{ products, loading, addProduct, addImage, deleteProduct}}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts deve ser usado dentro de um ProductProvider");
  }
  return context;
}
