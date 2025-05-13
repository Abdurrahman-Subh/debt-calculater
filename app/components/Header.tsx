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
  LogIn,
  LogOut,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

const Header = () => {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const navItems = [
    {
      href: "/home",
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

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Başarıyla çıkış yapıldı");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Çıkış yapılırken bir hata oluştu");
    }
  };

  const getUserInitials = () => {
    if (!user || !user.displayName) return "U";
    return user.displayName
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase();
  };

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
            href="/home"
            className="flex items-center text-2xl font-bold text-primary"
          >
            <CreditCard className="h-6 w-6 mr-2" />
            <span className="hidden sm:inline">BorçTakip</span>
          </Link>

          <div className="flex items-center space-x-2">
            <nav className="flex items-center space-x-1 mr-2">
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

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.photoURL || ""}
                        alt={user.displayName || "User"}
                      />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.displayName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-red-500 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Çıkış Yap</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" size="sm" asChild>
                <Link href="/signin" className="flex items-center">
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>Giriş Yap</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
