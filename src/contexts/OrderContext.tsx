import { createContext, useContext, useState, ReactNode } from "react";
import { collection, addDoc, deleteDoc, doc } from "firebase/firestore"; 
import { firestore } from "@/lib/firebaseConfig"; 

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

export interface Order {
  id: string;
  items: Product[];
  total: number;
}

interface OrderContextType {
  order: Product[];
  addToOrder: (product: Product) => void;
  removeFromOrder: (productId: string) => void;
  reduceCountFromOrder: (productId: string) => void;
  clearOrder: () => void;
  createOrder: () => Promise<void>; 
  cancelOrder: (orderId: string) => Promise<void>; 
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider ({ children }: { children: ReactNode }) {
  const [order, setOrder] = useState<Product[]>([]);

  function addToOrder(product: Product) {
    setOrder((prevOrder) => {
      const productExists = prevOrder.find((item) => item.id === product.id);
      if (productExists) {
        return prevOrder.map((item) =>
          item.id === product.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      } else {
        return [...prevOrder, { ...product, quantidade: 1, imagemUrl: product.imagemUrl }];
      }
    });
  };

  function removeFromOrder(productId: string) {
    setOrder((prevOrder) =>
      prevOrder.filter((item) => item.id !== productId)
    );
  };

  function reduceCountFromOrder(productId: string) {
    setOrder((prevOrder) =>
      prevOrder
        .map((item) =>
          item.id === productId && item.quantidade > 1
            ? { ...item, quantidade: item.quantidade - 1 }
            : item
        )
        .filter((item) => item.quantidade > 0)
    );
  };

  function clearOrder() {
    setOrder([]);
  };

  async function createOrder() {
    const total = order.reduce((sum, product) => sum + product.preco * product.quantidade, 0);
    const orderDetails = {
      items: order.map(({ id, nome, quantidade, preco, imagemUrl }) => ({
        id,
        nome,
        quantidade,
        preco,
        imagemUrl,
      })),
      total,
      date: new Date(),
    };

    try {
      const ordersCollection = collection(firestore, "orders");

      // Adicionando o pedido ao Firestore e obtendo o ID gerado
      const docRef = await addDoc(ordersCollection, orderDetails);

      console.log("Pedido salvo com sucesso com o ID: ", docRef.id);

      clearOrder(); 
    } catch (error) {
      console.error("Erro ao salvar pedido: ", error);
    }
  };

  async function cancelOrder(orderId: string) {
    try {
      const orderDoc = doc(firestore, "orders", orderId);

      await deleteDoc(orderDoc);

      console.log("Pedido cancelado com sucesso com o ID: ", orderId);
    } catch (error) {
      console.error("Erro ao cancelar o pedido: ", error);
    }
  };

  return (
    <OrderContext.Provider value={{ order, addToOrder, removeFromOrder, reduceCountFromOrder, clearOrder, createOrder, cancelOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder deve ser usado dentro de um OrderProvider");
  }
  return context;
};
