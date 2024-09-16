"use client";

import LogoImage from "../../../public/logo.svg";

import { ReactNode, useEffect, useState } from 'react';
import  Sidebar from '@/components/Sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

import { ProductProvider } from '@/contexts/ProductContext'
import Image from 'next/image';
import { Toaster } from "@/components/ui/toaster";
import { OrderProvider } from "@/contexts/OrderContext";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
        router.push('/');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) return (
    <div className='flex flex-col justify-center items-center h-screen'>
      <Image src={LogoImage} height={0} alt="logoImage" />
      <span className="text-9xlxl font-bold">
        Book<span className="text-amber-400">Bart</span>
      </span>
    </div>
  )

  return (
    <div className="flex h-screen">
      <OrderProvider>
        <ProductProvider>
          <TooltipProvider>
            <Sidebar />
            <div className="flex-1 border-x-2 border-neutral-900 overflow-auto">
              {authenticated ? children : null}
            </div>
          </TooltipProvider>
          <Toaster/>
        </ProductProvider>
      </OrderProvider>
    </div>
  );
}
