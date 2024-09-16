"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTrigger } from "@/components/ui/dialog";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useProducts } from "@/contexts/ProductContext";

import { AlertTriangle, ChevronLeft, ChevronRight, Edit, Trash2 } from "lucide-react"

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
  
const ITEMS_PER_PAGE = 6

export default function ProductsPage(){
    const [currentPage, setCurrentPage] = useState(1)
    const { products } = useProducts()
    const { deleteProduct } = useProducts()
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null)

    const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const currentProducts = products.slice(startIndex, endIndex)

    async function handleDelete() {
        try {
            if (selectedProductId) {
                await deleteProduct(selectedProductId);
                setSelectedProductId(null);
            }
        } catch (error) {
            console.error("Erro ao deletar o produto: ", error);
        }
    }

    return(
        <div className="flex-1 overflow-auto flex flex-col lg:pl-5 lg:border-r-2 border-neutral-900 p-4">
            <div className="flex justify-between items-center">
                <span className="text-3xl font-bold">Produtos</span>
                <Link href="/dashboard/product-page/add-product">
                    <Button className="w-44 h-12 bg-amber-400 text-neutral-900 font-bold hover:text-neutral-50 transition-colors">
                        + Adicionar Produto
                    </Button>
                </Link>
            </div>
            <div className="w-full flex-1 mx-auto py-6">
                <Table className="border-2 border-neutral-900">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Produto</TableHead>
                            <TableHead className="border-x-2 border-neutral-900">Status</TableHead>
                            <TableHead>ID do produto</TableHead>
                            <TableHead className="border-x-2 border-neutral-900">Quantidade</TableHead>
                            <TableHead>Preço</TableHead>
                            <TableHead className="border-x-2 border-neutral-900">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {currentProducts.map((product) => (
                        <TableRow key={product.id} className="border-neutral-900 border-2">
                            <TableCell className="font-medium">
                                <div className="flex items-center space-x-3">
                                    <div className=" overflow-hidden h-12 w-16">
                                        <Image
                                            src={product.imagemUrl}
                                            alt={product.nome}
                                            width={70}
                                            height={70}
                                            className="rounded-md object-cover w-full h-full"
                                        />
                                    </div>
                                    <span className="font-bold">{product.nome}</span>
                                </div>
                            </TableCell>
                            <TableCell className="border-x-2 border-neutral-900 text-center">
                                <Badge variant={product.emEstoque === "Em estoque" ? "secondary" : "destructive"}>
                                {product.emEstoque}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-center">{product.id}</TableCell>
                            <TableCell className="border-x-2 border-neutral-900 text-center">
                                {product.quantidade}
                            </TableCell>
                            <TableCell className="font-bold">{`R$ ${product.preco.toFixed(2)}`}</TableCell>
                            <TableCell className="border-x-2 border-neutral-900 mr-auto">
                                <div className="flex space-x-2">
                                <Button variant="outline" size="icon" className="bg-emerald-600">
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                </Button>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="bg-red-600"
                                            onClick={() => setSelectedProductId(product.id)} // Seleciona o ID do produto
                                        >
                                        <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Delete</span>
                                        </Button>
                                    </DialogTrigger>
                                        <DialogContent className="h-56 w-96 bg-neutral-900 border-transparent p-4">
                                            <DialogDescription>
                                            <div className="flex flex-col items-center">
                                                <AlertTriangle className="h-12 w-12 text-red-600" />
                                                <div className="mt-2 text-center flex flex-col">
                                                    <span className="font-bold text-2xl text-slate-50">Deletar Esse Produto?</span>
                                                    <span className="text-muted-foreground text-xs">
                                                        Depois que deletar não será possivel recupara-lo
                                                    </span>
                                                </div>
                                                <div className="gap-4 flex mt-14">
                                                <Button
                                                    type="button"
                                                    onClick={handleDelete} // Chama a função de deletar
                                                    className="bg-muted-foreground font-bold w-32 text-neutral-900 hover:text-slate-50"
                                                >
                                                    Sim
                                                </Button>
                                                <Button className="bg-amber-400 font-bold w-32 text-neutral-900 hover:text-slate-50">
                                                    Não
                                                </Button>
                                                </div>
                                            </div>
                                            </DialogDescription>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                    <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Previous page</span>
                    </Button>
                    <div className="text-sm font-medium">
                    Page {currentPage} of {totalPages}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                    <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Next page</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}