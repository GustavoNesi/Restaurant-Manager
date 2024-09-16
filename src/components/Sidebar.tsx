"use client";

import { usePathname } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";

import LogoImage from "../../public/logo.svg";

import HomePage from "../../public/house.svg";
import HomePageFill from "../../public/house-fill.svg";

import ManagerDashboard from "../../public/squares-four.svg";
import ManagerDashboardFill from "../../public/squares-four-fill.svg";

import OrderPage from "../../public/clipboard.svg";
import OrderPageFill from "../../public/clipboard-fill.svg";

import ProductPage from "../../public/hamburger.svg";
import ProductPageFill from "../../public/hamburger-fill.svg";

import CustomerPage from "../../public/user.svg";
import CustomerPageFill from "../../public/user-fill.svg";

import Settings from "../../public/gear-six.svg";
import SettingsFill from "../../public/gear-six-fill.svg";

import { useEffect, useState } from 'react';
import TabBar from './TabBar';

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);


  // Detecta o tamanho da tela para ativar o menu móvel
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize(); // Verifica inicialmente
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
    {isMobile ? (
        <TabBar/>
    ) : (
        <div className="w-1/12 flex flex-col justify-between pb-8 sticky top-0 h-screen items-center">
          <div className="w-full flex justify-center p-2 border-b-2 border-neutral-900">
            <Image src={LogoImage} height={50} alt="logoImage" />
          </div>
          <div>
            <Link href="/dashboard">
              <Image src={pathname === '/dashboard' ? HomePageFill : HomePage} alt="HomePage"/>
            </Link>
          </div>
          <div>
            <Link href="/dashboard/manager-dashboard">
              <Image src={pathname.startsWith('/dashboard/manager-dashboard') ? ManagerDashboardFill : ManagerDashboard} alt="ManagerPage"/>
            </Link>
          </div>
          <div>
            <Link href="/dashboard/order-page">
              <Image src={pathname.startsWith('/dashboard/order-page') ? OrderPageFill : OrderPage} alt="OrderPage"/>
            </Link>
          </div>
          <div>
            <Link href="/dashboard/product-page">
              <Image src={pathname.startsWith('/dashboard/product-page') ? ProductPageFill : ProductPage} alt="ProductPage"/>
            </Link>
          </div>
          <div>
            <Link href="/dashboard/customer-page">
              <Image src={pathname.startsWith('/dashboard/customer-page') ? CustomerPageFill : CustomerPage} alt="CustomerPage"/>
            </Link>
          </div>
          <div>
            <Link href="/dashboard/settings">
              <Image src={pathname.startsWith('/dashboard/settings') ? SettingsFill : Settings} alt="SettingsPage"/>
            </Link>
          </div>
        </div>
      )
    }
    </>
  );
}
