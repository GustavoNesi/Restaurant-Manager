"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "@/lib/firebaseConfig";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogDescription, DialogTrigger } from "@radix-ui/react-dialog";
import Image from "next/image";
import { useOrder } from "@/contexts/OrderContext";

interface Product {
  id: string;
  nome: string;
  preco: number;
  imagemUrl: string;
  quantidade: number;
}

interface Order {
  id: string;
  items: Product[];
  total: number;
}

export default function OrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { cancelOrder } = useOrder();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "orders"));
        const ordersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Order[];
        setOrders(ordersData);
      } catch (error) {
        console.error("Erro ao buscar os pedidos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleCancelOrder = async () => {
    if (selectedOrder) {
      try {
        await cancelOrder(selectedOrder.id);
        setSelectedOrder(null);
        setOrders((prevOrders) => prevOrders.filter((order) => order.id !== selectedOrder.id));
      } catch (error) {
        console.error("Erro ao cancelar o pedido:", error);
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row space-y-5 h-screen">
      {orders.length > 0 ? (
        <div className="w-full md:w-2/4 p-4">
          <span className="font-bold text-2xl sm:text-start text-end sm:text-3xl truncate">Registros dos Pedidos</span>
          <div className="mt-10 h-5/6 w-full rounded-md border-2 border-neutral-900 overflow-auto">
            <div className="p-4 border-b-2 border-neutral-900">
              <span className="text-xl font-bold">Todos os Pedidos</span>
            </div>
            <div className="p-4 space-y-2">
              {orders.map((order) => (
                <Button
                  key={order.id}
                  className="h-24 w-full bg-neutral-900 p-4 flex justify-between items-center rounded-lg hover:bg-amber-400 transition-colors cursor-pointer hover:text-neutral-900"
                  onClick={() => handleOrderClick(order)}
                >
                  <div className="flex flex-col space-y-1 sm:space-y-4 text-sm sm:text-md lg:text-lg">
                    <span className="font-bold truncate">Pedido #{order.id}</span>
                    <span className="text-xs sm:text-sm text-start truncate">Mesa: 20</span>
                  </div>
                  <div className="flex flex-col space-y-1 sm:space-y-4 text-end text-sm sm:text-md lg:text-lg">
                    <span className="text-emerald-600 font-bold truncate">Pago</span>
                    <span className="font-bold truncate">R$ {order.total.toFixed(2)}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-screen w-full md:w-2/4 p-28 justify-center items-center overflow-hidden">
          <span className="text-muted-foreground">Nenhum Pedido</span>
        </div>
      )}

      {selectedOrder ? (
        <div className="w-full md:w-2/4 border-l-2 border-t-2 rounded-tl-lg border-neutral-900">
          <div className="flex justify-between border-b-2 p-4 border-neutral-900">
            <span className="font-bold text-xl">Pedido #{selectedOrder.id}</span>
            <span className="text-emerald-600 text-lg font-bold">Pago</span>
          </div>
          <div className="px-4 font-bold mt-4">
            <span>Detalhes</span>
          </div>
          <div className="h-96 w-full p-4 space-y-2 overflow-auto">
            {selectedOrder.items.map((item) => (
              <div key={item.id} className="rounded-lg border-2 border-neutral-900 flex items-center w-full p-4 gap-2">
                <div className="w-16 h-14 overflow-hidden">
                  <Image src={item.imagemUrl} width={90} height={90} alt={item.nome} className="w-full h-full rounded-lg object-cover" />
                </div>
                <div>
                  <span className="font-bold">{item.nome}</span>
                  <span className="font-bold text-amber-400"> x{item.quantidade}</span>
                </div>
                <div className="ml-auto font-bold text-amber-400">
                  <span>R$ {item.preco.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 p-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full md:w-64 h-14 bg-amber-400 font-bold text-neutral-900 hover:text-slate-50">
                  Finalizar Pedido
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[30rem] overflow-auto p-6 bg-neutral-900 rounded-md border-transparent shadow-lg">
                <DialogHeader>
                  <DialogTitle className="text-lg font-bold">Pedido #{selectedOrder.id}</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  {/* Detalhes do pedido */}
                  <div className="space-y-4 ">
                    <div className="flex justify-between">
                      <span className="font-semibold">Nome do funcionário</span>
                      <span className="text-muted-foreground">Manolo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Clientes</span>
                      <span className="text-muted-foreground">4</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Pagamento</span>
                      <span className="text-muted-foreground">Dinheiro</span>
                    </div>
                    <div className="border-t-2 flex-1 border-neutral-800 pt-4 space-y-6">
                      {selectedOrder.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between w-full">
                          <div>
                            <span className="font-bold">{item.nome}</span>
                            <span className="font-bold text-amber-400"> x{item.quantidade}</span>
                          </div>
                          <div className="ml-auto font-bold text-amber-400">
                            <span>R$ {item.preco.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t-2 border-neutral-800 pt-4">
                      <div className="flex justify-between text-xl font-bold">
                        <span>Total</span>
                        <span className="font-bold text-emerald-600">R$ {selectedOrder.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </DialogDescription>
                <DialogFooter className="mt-4 w-full">
                  <Button onClick={() => console.log("Fechar")} className="w-full md:w-64 bg-amber-400 font-bold text-neutral-900 hover:text-slate-50">
                    Imprimir nota fiscal
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button onClick={handleCancelOrder} className="w-full md:w-64 h-14 font-bold bg-red-600 text-white hover:bg-red-700 transition-colors">
              Cancelar Pedido
            </Button>
          </div>
        </div>
      ) : (
        <div className="w-full md:w-2/4 flex items-center justify-center border-l-2 border-t-2 rounded-tl-lg border-neutral-900">
          <span className="text-muted-foreground">Nenhum Detalhe do Pedido</span>
        </div>
      )}
    </div>
  );
}
