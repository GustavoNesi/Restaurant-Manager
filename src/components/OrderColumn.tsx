"use client";

import { useOrder } from "@/contexts/OrderContext";
import Image from "next/image";
import { Button } from "./ui/button";
import { useState } from "react";

export default function OrderColumn() {
  const { order, removeFromOrder, reduceCountFromOrder, addToOrder, createOrder } = useOrder();
  const [orderId, setOrderId] = useState<string>("");

  const totalPrice = order.reduce((sum, product) => sum + product.preco * product.quantidade, 0);

  const handleCreateOrder = async () => {
    if (!orderId) {
      setOrderId(`order-${Date.now()}`);
    }
    await createOrder(orderId);
  };

  if (order.length === 0) {
    return (
      <div className="flex flex-col sticky top-0 justify-center items-center w-full lg:w-3/12 h-64 lg:h-screen py-4 px-6 border-t-2 lg:border-l-2 border-neutral-900">
        <span className="text-muted-foreground">+ Adicionar Produtos</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col sticky top-0 w-full lg:w-3/12 h-64 lg:h-screen py-4 px-4 border-t-2 lg:border-l-2 border-neutral-900">
      <span className="h-1/12 font-bold text-xl">
        {orderId ? `Pedido #${orderId}` : "Novo Pedido"}
      </span>
      <div className="flex-1 flex-col space-y-2 pb-2 mt-4 overflow-auto">
        {order.map((item) => (
          <div
            key={item.id}
            className="relative flex items-center w-full justify-between border-2 p-4 border-neutral-900 rounded-lg"
          >
            <div className="h-full flex space-x-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden">
                <Image
                  src={item.imagemUrl}
                  height={90}
                  width={90}
                  alt="imagem"
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="flex flex-col text-start justify-center">
                <span className="text-xs font-semibold">{item.nome}</span>
                <span className="text-amber-400 text-xs">R$ {item.preco.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-1">
              <Button
                className="absolute top-0 right-0 h-4 w-4 text-xs rounded-none rounded-tr-md rounded-bl-md bg-red-600 text-white flex items-center justify-center"
                onClick={() => removeFromOrder(item.id)}
              >
                X
              </Button>

              <Button
                className="h-7 w-7 rounded-lg bg-neutral-900 text-white"
                onClick={() => reduceCountFromOrder(item.id)}
              >
                -
              </Button>
              <span>{item.quantidade}</span>
              <Button
                className="h-7 w-7 rounded-lg bg-neutral-900 text-white"
                onClick={() => addToOrder(item)}
              >
                +
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="h-1/4 flex flex-col justify-between border-t-2 pt-1 border-neutral-900">
        <div className="flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold">R$ {totalPrice.toFixed(2)}</span>
        </div>
        <Button
          className="bg-amber-400 font-bold text-neutral-900 hover:text-slate-50"
          onClick={handleCreateOrder}
        >
          Fazer Pedido
        </Button>
      </div>
    </div>
  );
}
