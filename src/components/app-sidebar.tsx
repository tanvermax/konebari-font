// app-sidebar.tsx - Fixed Version
import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
} from "./ui/sidebar"; // আপনার import path অনুযায়ী調整 করুন
import Logo from "@/assets/icons/logo";
import { Link, useLocation } from "react-router";
import { getSidebarItems } from "@/utils/getSidebaritem";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
} from "lucide-react";
// import { Sidebar } from "./ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: userData } = useUserInfoQuery(undefined);
  const location = useLocation();
  const [collapsed, setCollapsed] = React.useState(false);

  const data = {
    navMain: getSidebarItems(userData?.data?.role) || [],
  };

  const isActive = (url: string) => location.pathname === url;

  return (
    <Sidebar
      {...props}
      className={`relative border-r border-pink-100/30 dark:border-zinc-800/30 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-2xl shadow-2xl transition-all duration-500 ${
        collapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 z-50 w-6 h-6 rounded-full bg-pink-500 text-white shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all duration-300 flex items-center justify-center border-2 border-white dark:border-zinc-800"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>

      {/* Logo */}
      <div className={`p-5 border-b border-pink-100/30 dark:border-zinc-800/30 flex ${collapsed ? 'justify-center' : 'justify-between'} items-center transition-all duration-300`}>
        <Link to="/" className={`transition-all duration-300 ${collapsed ? 'scale-90' : 'scale-100'} hover:scale-105`}>
          <Logo />
        </Link>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[8px] font-bold text-pink-400 uppercase tracking-widest bg-pink-50 dark:bg-pink-950/30 px-2 py-0.5 rounded-full border border-pink-200/50"
          >
            v2.0
          </motion.span>
        )}
      </div>

      {/* Navigation */}
      <SidebarContent className="px-2 py-4 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-pink-200 scrollbar-track-transparent">
        {data.navMain.map((group, groupIndex) => (
          <SidebarGroup key={group.title} className="p-0">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: groupIndex * 0.05 }}
              >
                <SidebarGroupLabel className="px-3 text-[10px] font-extrabold tracking-[0.2em] uppercase text-pink-400 dark:text-zinc-500 mb-2 flex items-center gap-2">
                  <div className="w-4 h-[1px] bg-pink-300/50" />
                  {group.title}
                  <div className="flex-1 h-[1px] bg-pink-300/50" />
                </SidebarGroupLabel>
              </motion.div>
            )}

            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {group.items.map((item, itemIndex) => {
                  const active = isActive(item.url);
                  const Icon = item.icon;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`relative w-full h-10 px-3 rounded-xl font-medium text-sm transition-all duration-300 group overflow-hidden ${
                          active
                            ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30"
                            : "text-zinc-600 dark:text-zinc-400 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-pink-50/60 dark:hover:bg-zinc-900/60"
                        } ${collapsed ? 'justify-center' : 'justify-start'}`}
                      >
                        {/* ✅ Fix: Single child element inside asChild */}
                        <Link 
                          to={item.url} 
                          className={`flex items-center gap-3 w-full h-full ${collapsed ? 'justify-center' : ''}`}
                        >
                          {Icon ? (
                            <motion.div
                              whileHover={{ scale: 1.2, rotate: active ? 0 : 10 }}
                              className={`h-4 w-4 shrink-0 transition-all duration-300 ${
                                active ? "text-white" : "text-zinc-400 group-hover:text-pink-500"
                              }`}
                            >
                              <Icon />
                            </motion.div>
                          ) : (
                            <span
                              className={`h-1.5 w-1.5 rounded-full shrink-0 transition-all duration-300 ${
                                active
                                  ? "bg-white scale-125"
                                  : "bg-zinc-300 dark:bg-zinc-700 group-hover:bg-pink-500"
                              }`}
                            />
                          )}

                          {!collapsed && (
                            <motion.span
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: itemIndex * 0.03 }}
                              className="truncate tracking-wide"
                            >
                              {item.title}
                            </motion.span>
                          )}

                          {active && !collapsed && (
                            <motion.div
                              className="ml-auto w-1.5 h-6 rounded-full bg-white/50"
                              initial={{ scaleY: 0 }}
                              animate={{ scaleY: 1 }}
                              transition={{ duration: 0.3 }}
                            />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className={`border-t border-pink-100/30 dark:border-zinc-800/30 p-3 ${collapsed ? 'flex justify-center' : ''}`}>
        {!collapsed ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 px-3 py-2 rounded-xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-200/30"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-pink-500/20">
              {userData?.data?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">
                {userData?.data?.name || 'Admin'}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                {userData?.data?.role || 'Administrator'}
              </p>
            </div>
            <Sparkles className="w-3 h-3 text-pink-400" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-pink-500/20"
          >
            {userData?.data?.name?.charAt(0) || 'A'}
          </motion.div>
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}