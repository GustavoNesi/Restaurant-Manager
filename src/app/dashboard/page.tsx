"use client";

import { useState } from "react";

import Image from "next/image";
import Bell from "../../../public/bell.svg";
import Star from "../../../public/star-fill.svg";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import OrderColumn from "@/components/OrderColumn";

import { useProducts } from "@/contexts/ProductContext";
import { useOrder } from "@/contexts/OrderContext";

export default function Dashboard() {
  const { products, loading } = useProducts();
  const { addToOrder } = useOrder();
  const [searchTerm, setSearchTerm] = useState("");

  if (loading) {
    return <p>Carregando...</p>;
  }

  // Filtra os produtos com base no termo de busca
  const filteredProducts = products.filter(product =>
    product.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Coluna Principal - Pedido e Produtos */}
      <div className="flex-1 overflow-auto flex flex-col lg:pl-5 lg:border-r-2 border-neutral-900">
        {/* Barra superior com busca e notificações */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4">
          <span className="text-3xl font-bold">
            Book<span className="text-amber-400">Bart</span>
          </span>
          <div className="flex items-center justify-between mt-4 sm:mt-0 w-full sm:w-3/4">
            <Input
              type="text"
              placeholder="Pesquisar por comidas"
              className="w-full rounded-lg border-neutral-900 border-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button className="rounded-full w-14 h-14 ml-2">
              <Image src={Bell} alt="Notificações" />
            </Button>
          </div>
        </div>

        {/* Menu Especial */}
        <div className="w-full px-4">
          <span className="text-xl font-bold">Menu Especial para você</span>
        </div>

        {/* Grade de Comidas */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 mt-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="h-72 w-full sm:w-64 flex flex-col justify-between border-2 border-neutral-900 rounded-xl p-4"
              >
                <div className="w-full h-28 rounded-lg overflow-hidden">
                  <Image
                    src={product.imagemUrl}
                    width={400}
                    height={400}
                    alt="image da comida"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex justify-between font-bold">
                  <span>{product.nome}</span>
                  <span className="text-amber-400 text-base">R${product.preco.toFixed(2)}</span>
                </div>
                <div className="flex mt-1">
                  <span className="text-muted-foreground text-xs leading-tight">
                    {product.descricao}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2 items-center">
                    <Image src={Star} height={24} alt="Estrela de avaliação" />
                    <span className="font-bold">{product.avaliacao.toFixed(1)}</span>
                  </div>
                  <Button 
                    className="w-32 text-xs text-neutral-900 bg-amber-400 font-bold hover:text-slate-50"
                    onClick={() => addToOrder(product)}
                  >
                    + Adicionar Produto
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="mr-auto h-[25rem] w-[50rem] flex flex-col items-center justify-center ">
              <span className="text-amber-400 font-bold text-xl">Produto não encontrado</span>
            </div>
          )}
        </div>
      </div>
      {/* Coluna Lateral - Pedido (somente para telas maiores) */}
      <OrderColumn/>
    </div>
  );
}
