// DashbordLayout.tsx - Premium Redesign (Full Code)
import { Outlet, useLocation } from "react-router";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import UserMenu from "@/components/navbar-components/user-menu";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Bell, 
  Search, 
  Menu, 

  Home,
  Zap,
  Sun,
  Moon,

  Maximize2,
  Minimize2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DashbordLayout() {
  const { data: userData } = useUserInfoQuery(undefined);
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Get page title from path
  const getPageTitle = () => {
    const path = location.pathname.split('/').pop();
    if (!path || path === 'dashboard') return 'Overview';
    return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
  };

  // Get page icon
  const getPageIcon = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return <Home className="w-4 h-4" />;
    if (path.includes('product')) return <Sparkles className="w-4 h-4" />;
    if (path.includes('order')) return <Zap className="w-4 h-4" />;
    return <Sparkles className="w-4 h-4" />;
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Update time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-gradient-to-br from-pink-50/30 via-rose-50/20 to-purple-50/30 dark:from-zinc-950/50 dark:via-zinc-950/40 dark:to-zinc-950/50 min-h-screen transition-colors duration-300">
        {/* Header */}
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-2 border-b border-pink-100/40 dark:border-zinc-800/40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl px-4 md:px-6 shadow-sm transition-all duration-300">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            <SidebarTrigger className="-ml-1 text-zinc-600 hover:text-pink-500 dark:text-zinc-400 dark:hover:text-pink-400 transition-colors duration-200">
              <Menu className="w-5 h-5" />
            </SidebarTrigger>
            <Separator
              orientation="vertical"
              className="h-6 bg-pink-200/50 dark:bg-zinc-800/50"
            />
            
            {/* Page Title with Animation */}
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2.5"
            >
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-pink-500/10 to-rose-500/10 text-pink-500">
                {getPageIcon()}
              </div>
              <div>
                <h1 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 tracking-tight">
                  {getPageTitle()}
                </h1>
                <p className="text-[10px] text-muted-foreground hidden sm:block">
                  {location.pathname.split('/').filter(Boolean).join(' / ')}
                </p>
              </div>
            </motion.div>

            {/* Breadcrumb Badge */}
            <Badge className="hidden lg:flex items-center gap-1 bg-pink-50 dark:bg-pink-950/30 text-pink-600 dark:text-pink-400 border-pink-200/50 dark:border-pink-800/30 text-[10px] font-medium px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-2.5 h-2.5" />
              Live
            </Badge>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Search Bar */}
            <motion.div
              initial={false}
              animate={{ width: isSearchOpen ? '200px' : '0px' }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className={`h-8 w-full pl-8 pr-3 text-xs rounded-full border-pink-200/50 dark:border-zinc-800/50 bg-pink-50/50 dark:bg-zinc-900/50 focus-visible:ring-pink-400 transition-all duration-300 ${
                    isSearchOpen ? 'opacity-100' : 'opacity-0'
                  }`}
                  autoFocus={isSearchOpen}
                  onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
                />
              </div>
            </motion.div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="h-8 w-8 rounded-full text-zinc-600 hover:text-pink-500 hover:bg-pink-50 dark:text-zinc-400 dark:hover:text-pink-400 dark:hover:bg-pink-950/30 transition-all duration-200"
            >
              <Search className="w-4 h-4" />
            </Button>

            {/* Time */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pink-50/50 dark:bg-zinc-900/50 border border-pink-100/30 dark:border-zinc-800/30">
              <span className="text-[10px] font-mono font-medium text-zinc-600 dark:text-zinc-400">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </span>
            </div>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full relative text-zinc-600 hover:text-pink-500 hover:bg-pink-50 dark:text-zinc-400 dark:hover:text-pink-400 dark:hover:bg-pink-950/30 transition-all duration-200"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 p-2 border-pink-100/50 dark:border-zinc-800/50 shadow-xl">
                <DropdownMenuLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Notifications
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-sm py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-950/50 flex items-center justify-center text-pink-500">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium">New product added</p>
                      <p className="text-[10px] text-muted-foreground">2 minutes ago</p>
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-500">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium">Order #1234 delivered</p>
                      <p className="text-[10px] text-muted-foreground">1 hour ago</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Fullscreen */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="hidden lg:flex h-8 w-8 rounded-full text-zinc-600 hover:text-pink-500 hover:bg-pink-50 dark:text-zinc-400 dark:hover:text-pink-400 dark:hover:bg-pink-950/30 transition-all duration-200"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </Button>

            {/* Dark Mode */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="hidden md:flex h-8 w-8 rounded-full text-zinc-600 hover:text-pink-500 hover:bg-pink-50 dark:text-zinc-400 dark:hover:text-pink-400 dark:hover:bg-pink-950/30 transition-all duration-200"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>

            {/* User Menu */}
            {userData?.data && <UserMenu userData={userData.data} />}
          </div>
        </header>

        {/* Content Body */}
        <div className="flex flex-1 flex-col p-3 md:p-5">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="min-h-[calc(100vh-7rem)] flex-1 rounded-2xl bg-white/70 dark:bg-zinc-900/40 border border-pink-100/30 dark:border-zinc-800/30 p-4 md:p-6 shadow-lg shadow-pink-500/5 backdrop-blur-sm transition-all duration-300"
          >
            <Outlet />
          </motion.div>

          {/* Footer */}
          <footer className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-muted-foreground/60 px-2">
            <div className="flex items-center gap-4">
              <span>© {new Date().getFullYear()} Glamour & Elegance</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">v2.0.0</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                System Online
              </span>
              <span>•</span>
              <span>{new Date().toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}</span>
            </div>
          </footer>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}