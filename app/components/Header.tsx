"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  CreditCard,
  ListIcon,
  CoinsIcon,
  BarChart4,
  TestTube2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/",
      label: "Ana Sayfa",
      icon: <CoinsIcon className="h-4 w-4 mr-2" />,
    },
    {
      href: "/transactions",
      label: "Tüm İşlemler",
      icon: <ListIcon className="h-4 w-4 mr-2" />,
    },
    {
      href: "/dashboard",
      label: "İstatistikler",
      icon: <BarChart4 className="h-4 w-4 mr-2" />,
    },
    {
      href: "/test",
      label: "Test",
      icon: <TestTube2 className="h-4 w-4 mr-2" />,
    },
  ];

  return (
    <motion.header
      className="bg-card border-b sticky top-0 z-30"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center text-2xl font-bold text-primary"
          >
            <CreditCard className="h-6 w-6 mr-2" />
            <span className="hidden sm:inline">BorçTakip</span>
          </Link>

          <nav className="flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "default" : "ghost"}
                asChild
                className="flex items-center px-4"
                size={pathname === item.href ? "default" : "sm"}
              >
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  {item.icon}
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              </Button>
            ))}
          </nav>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
