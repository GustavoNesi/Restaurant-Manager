// components/TabBar.tsx

import { usePathname } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";

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

export default function TabBar() {
  const pathname = usePathname();
  
  const menuItems = [
    { href: "/dashboard", icon: HomePage, iconFill: HomePageFill, label: "Home" },
    { href: "/dashboard/manager-dashboard", icon: ManagerDashboard, iconFill: ManagerDashboardFill, label: "Manager" },
    { href: "/dashboard/order-page", icon: OrderPage, iconFill: OrderPageFill, label: "Orders" },
    { href: "/dashboard/product-page", icon: ProductPage, iconFill: ProductPageFill, label: "Products" },
    { href: "/dashboard/customer-page", icon: CustomerPage, iconFill: CustomerPageFill, label: "Customers" },
    { href: "/dashboard/settings", icon: Settings, iconFill: SettingsFill, label: "Settings" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 flex justify-around items-center p-2 z-50">
      {menuItems.map((item) => (
        <Link href={item.href} key={item.href} className="flex flex-col items-center">
          <Image
            src={pathname === item.href ? item.iconFill : item.icon}
            alt={item.label}
            className="w-8 h-8"
          />
        </Link>
      ))}
    </div>
  );
}
