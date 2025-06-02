"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart4,
  CoinsIcon,
  CreditCard,
  ListIcon,
  LogIn,
  LogOut,
  Users,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import Image from "next/image";

const Header = () => {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Close menu when changing routes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Detect window size for responsive design
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener("resize", checkIfMobile);

    // Clean up
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  // Disable body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }

    return () => {
      document.body.style.overflow = "visible";
    };
  }, [isMenuOpen]);

  const navItems = [
    {
      href: "/home",
      label: "Ana Sayfa",
      icon: <CoinsIcon className="h-4 w-4 mr-2" />,
    },
    {
      href: "/friends",
      label: "Arkadaşlar",
      icon: <Users className="h-4 w-4 mr-2" />,
    },
    {
      href: "/transactions",
      label: "Tüm İşlemler",
      icon: <ListIcon className="h-4 w-4 mr-2" />,
    },
    {
      href: "/expenses",
      label: "Harcamalar",
      icon: <CreditCard className="h-4 w-4 mr-2" />,
    },
    {
      href: "/dashboard",
      label: "İstatistikler",
      icon: <BarChart4 className="h-4 w-4 mr-2" />,
    },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Başarıyla çıkış yapıldı");
      setIsMenuOpen(false);
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

  // Animation variants for the mobile menu
  const menuVariants = {
    closed: {
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  // Animation variants for menu items
  const menuItemVariants = {
    closed: {
      opacity: 0,
      y: 20,
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  // Animation variants for the hamburger button
  const hamburgerButtonVariants = {
    open: { rotate: 0 },
    closed: { rotate: 180 },
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
            <Image
              src="/muhasebeji6.png"
              alt="Muhasebeji"
              width={140}
              height={140}
              className="mr-3 rounded-full"
            />
          </Link>

          <div className="flex items-center">
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1 mr-2">
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
                    <span>{item.label}</span>
                  </Link>
                </Button>
              ))}
            </nav>

            {/* User dropdown (visible on all screens) */}
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

            {/* Hamburger Menu Button (only visible on mobile) */}
            <div className="ml-2 lg:hidden">
              <motion.button
                variants={hamburgerButtonVariants}
                animate={isMenuOpen ? "open" : "closed"}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md hover:bg-gray-100"
                aria-label="Toggle Menu"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-72 bg-gradient-to-br from-background to-muted z-50 shadow-xl overflow-y-auto flex flex-col"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            {/* Logo header in mobile menu */}
            <motion.div
              variants={menuItemVariants}
              className="p-6 border-b flex items-center"
            >
              <Image
                src="/muhasebeji6.png"
                alt="Muhasebeji"
                width={32}
                height={32}
                className="mr-3"
              />
              <span className="text-xl font-bold text-primary">Muhasebeji</span>
            </motion.div>

            <div className="p-5 space-y-5 flex-1">
              {navItems.map((item) => (
                <motion.div key={item.href} variants={menuItemVariants}>
                  <Button
                    variant={pathname === item.href ? "default" : "ghost"}
                    asChild
                    className={`flex items-center w-full justify-start text-lg h-12 ${
                      pathname === item.href
                        ? "bg-primary/10 hover:bg-primary/20 text-primary"
                        : "hover:bg-muted"
                    }`}
                  >
                    <Link
                      href={item.href}
                      aria-current={pathname === item.href ? "page" : undefined}
                      className="flex items-center"
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  </Button>
                </motion.div>
              ))}
            </div>

            <motion.div
              variants={menuItemVariants}
              className="p-5 border-t bg-muted/50 mt-auto"
            >
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center p-2 bg-background rounded-lg">
                    <Avatar className="h-10 w-10 mr-3 border-2 border-primary/20">
                      <AvatarImage
                        src={user.photoURL || ""}
                        alt={user.displayName || "User"}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{user.displayName}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Çıkış Yap</span>
                  </Button>
                </div>
              ) : (
                <Button variant="default" size="lg" asChild className="w-full">
                  <Link
                    href="/signin"
                    className="flex items-center justify-center gap-2"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Giriş Yap</span>
                  </Link>
                </Button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
