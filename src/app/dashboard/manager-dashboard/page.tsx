"use client"

import Image from "next/image";
import ChartBar from "../../../../public/chart-bar-fill.svg"
import Wallet from "../../../../public/wallet-fill.svg"
import HamburguerTest from "../../../../public/Hamburgues.jpg"
import HamburguerTest1 from "../../../../public/Hamburguer1.jpg"
import BatataTest from "../../../../public/BatataFrita.jpg"

import { AreaChartComponent } from "@/components/charts/AreaChart";
import { Button } from "@/components/ui/button";
import { BarChartComponent } from "@/components/charts/BarChartComponent";

export default function ManagerDashboardPage() {
  return (
    <div className="px-5 pt-2">
      <div className="h-1/6 w-full flex flex-col md:flex-row justify-between items-start md:items-center">
        <span className="text-2xl font-bold">Manager Dashboard</span>
        <div className="space-x-2 bg-neutral-900 p-2 rounded-lg mt-4 md:mt-0 md:flex md:justify-between">
          <Button className="w-28 font-bold bg-transparent hover:bg-amber-400 hover:text-neutral-900">Hoje</Button>
          <Button className="w-28 font-bold bg-transparent hover:bg-amber-400 hover:text-neutral-900">Semana</Button>
          <Button className="w-28 font-bold bg-transparent hover:bg-amber-400 hover:text-neutral-900">Mês</Button>
          <Button className="w-28 font-bold bg-transparent hover:bg-amber-400 hover:text-neutral-900">Ano</Button>
        </div>
      </div>
      <div className="h-full w-full">
        <div className="flex flex-col md:flex-row p-6 gap-6">
          <div className="h-72 w-full md:w-6/12">
            <BarChartComponent />
          </div>
          <div className="border-2 rounded-xl border-neutral-900 h-72 w-full md:w-6/12">
            <div className="border-b-2 border-neutral-900 p-3">
              <span className="font-bold text-md md:text-lg">Saldo Total</span>
            </div>
            <div className="w-full text-center mt-4 md:mt-6">
              <span className="text-4xl md:text-5xl text-emerald-600 font-bold">R$ 30.000,00</span>
            </div>
            <div className="flex flex-row items-center w-full mt-4 px-4 space-x-4">
              <div className="h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-full bg-white">
                <Image src={ChartBar} alt="Barras" />
              </div>
              <div className="flex flex-col text-center md:text-start">
                <span className="text-sm md:text-md font-bold">Total Recebido</span>
                <span className="text-muted-foreground text-xs md:text-sm">R$ 4.500,00</span>
              </div>
            </div>
            <div className="flex flex-row items-center w-full mt-4 px-4 space-x-4">
              <div className="h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-full bg-amber-500">
                <Image src={Wallet} alt="Carteira" />
              </div>
              <div className="flex flex-col text-center md:text-start">
                <span className="text-sm md:text-md font-bold">Total Gasto</span>
                <span className="text-muted-foreground text-xs md:text-sm">R$ 2.240,00</span>
              </div>
            </div>
        </div>
        </div>
        <div className="flex flex-col md:flex-row px-6 gap-6 mb-8">
          <div className="h-72 w-full md:w-8/12">
            <AreaChartComponent />
          </div>
          <div className="h-72 w-full md:w-4/12 border-2 rounded-xl border-neutral-900">
            <div className="border-b-2 border-neutral-900 p-3">
              <span className="font-bold text-md">Mais vendidos</span>
            </div>
            <div className="flex-1 flex-col mt-2 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className=" h-full flex space-x-3">
                  <div className="w-18 h-14 overflow-hidden">
                    <Image src={HamburguerTest} alt="image" className="w-full h-full rounded-lg object-cover" />
                  </div>
                  <div className="flex flex-col text-start justify-center">
                    <span className="text-sm font-semibold">X-salada</span>
                    <span className="text-amber-400 text-xs">R$ 3,00</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mr-4">
                  <span className="text-muted-foreground"> 300 </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className=" h-full flex space-x-3">
                  <div className="w-16 h-14 overflow-hidden">
                    <Image src={HamburguerTest1} alt="image" className="w-full h-full rounded-lg object-cover" />
                  </div>
                  <div className="flex flex-col text-start justify-center">
                    <span className="text-sm font-semibold">X-Frango</span>
                    <span className="text-amber-400 text-xs">R$ 13,00</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mr-4">
                  <span className="text-muted-foreground"> 240 </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className=" h-full flex space-x-3">
                  <div className="w-16 h-14 overflow-hidden">
                    <Image src={BatataTest} alt="image" className="w-full h-full rounded-lg object-cover" />
                  </div>
                  <div className="flex flex-col text-start justify-center">
                    <span className="text-sm font-semibold">Batata Frita</span>
                    <span className="text-amber-400 text-xs">R$ 10,99</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mr-4">
                  <span className="text-muted-foreground"> 300 </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
