import {
  LogOutIcon,

  HeartIcon,
  ShoppingBagIcon,
  CrownIcon,

  GemIcon,
  DiamondIcon,
 
  StarIcon,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { authApi, useLogoutMutation } from "@/redux/features/auth/auth.api"
import { useAppDispatch } from "@/redux/hook"
import { Link, useLocation } from "react-router"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { persistor } from "@/redux/store"
import { UserRoundIcon } from "../ui/user-round-icon"

export interface IUser {
  _id?: any,
  email: string;
  image?: string;
  name: string;
  role: 'ADMIN' | 'USER';
  avatar?: string;
  joinDate?: string;
  loyaltyPoints?: number;
}

interface UserMenuProps {
  userData: IUser
}

export default function UserMenu({ userData }: UserMenuProps) {
  const [logout] = useLogoutMutation();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const location = useLocation();

  const handlelogout = async () => {
    setIsLoggingOut(true);
try {
    // 1. Server theke logout
    await logout(undefined).unwrap();

    // 2. RTK Query cache clear
    dispatch(authApi.util.resetApiState());

    // 3. Redux-persist storage purge (eita missing chilo)
    await persistor.purge();

    // 4. Auth slice reset (jodi apnar auth slice e reset action thake)
    // dispatch(clearUser()); // apnar auth slice er reset action

    // 5. Page reload (optional but safe)
    window.location.href = "/";
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    setIsLoggingOut(false);
  }

  }

  // Get initials for avatar fallback
 const getInitials = (name: string) => {
    if (!name) return 'U';
    const nameParts = name.split(' ');
    const initials = nameParts
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
    return initials || 'U';
  }

  // Get role badge color
  const getRoleBadge = (role: string) => {
    if (role === 'ADMIN') {
      return {
        label: '✨ Admin',
        className: 'bg-gradient-to-r from-amber-400/20 to-amber-500/20 text-amber-600 border-amber-400/30'
      }
    }
    return {
      label: '💎 Member',
      className: 'bg-gradient-to-r from-pink-400/20 to-purple-400/20 text-purple-600 border-purple-400/30'
    }
  }

  // Menu items configuration with beauty & jewelry theme
  const menuItems = {
    user: [
      
      {
        icon: ShoppingBagIcon,
        label: "My Orders",
        href: "/user/orders",
        description: "Track your jewelry",
        color: "text-purple-500",
        bgColor: "bg-purple-50",
        hoverColor: "hover:bg-purple-50"
      },
      {
        icon: HeartIcon,
        label: "Wishlist",
        href: "/user/favorites",
        description: "Saved treasures",
        color: "text-red-500",
        bgColor: "bg-red-50",
        hoverColor: "hover:bg-red-50"
      },
      {
        icon: GemIcon,
        label: "Profile",
        href: "/user/profile",
        description: "Your jewelry box",
        color: "text-emerald-500",
        bgColor: "bg-emerald-50",
        hoverColor: "hover:bg-emerald-50"
      },
     
      
    ],
    admin: [
      {
        icon: CrownIcon,
        label: "Admin Dashboard",
        href: "/admin/dashboard",
        description: "Store overview",
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        hoverColor: "hover:bg-amber-50"
      },
      {
        icon: DiamondIcon,
        label: "Manage Products",
        href: "/admin/products",
        description: "Jewelry & beauty",
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        hoverColor: "hover:bg-purple-50"
      },
      {
        icon: ShoppingBagIcon,
        label: "All Orders",
        href: "/admin/orders",
        description: "Customer orders",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        hoverColor: "hover:bg-blue-50"
      },
      {
        icon: StarIcon,
        label: "Analytics",
        href: "/admin/analytics",
        description: "Store insights",
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
        hoverColor: "hover:bg-emerald-50"
      },
      
    ]
  };

  const items = userData.role === 'ADMIN' ? menuItems.admin : menuItems.user;
  const isActive = (href: string) => location.pathname === href;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="relative group"
        >
          <div className="relative">
            <Avatar className="h-10 w-10 ring-1 ring-primary/20 transition-all group-hover:ring-pink-400/50 shadow-lg shadow-primary/10 group-hover:shadow-pink-400/20">
              <AvatarImage src={userData.avatar || "./avatar-80-07.jpg"} alt={userData.name} />
              <AvatarFallback className="bg-gradient-to-br from-pink-100 to-purple-100 text-[#ffffff] font-semibold">
                <UserRoundIcon/>
              </AvatarFallback>
            </Avatar>
            
            {/* Premium Verified Badge with sparkle effect */}
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="absolute -end-0.5 -top-0.5"
            >
              <span className="sr-only">Verified Premium</span>
                 <Badge className=" text-[7px] relative  -top-2 left-2"> { getInitials(userData.name)}</Badge>
             
            </motion.span>

            {/* Online status dot */}
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3">
              <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-white"></span>
            </span>
          </div>
        </motion.button>
      </DropdownMenuTrigger>

      <AnimatePresence>
        {isOpen && (
          <DropdownMenuContent 
            className="w-80 p-1.5 border-primary/10 shadow-2xl shadow-pink-500/10 bg-gradient-to-b from-white to-pink-50/30 backdrop-blur-xl"
            align="end"
            asChild
          >
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95, rotateX: -5 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, y: -10, scale: 0.95, rotateX: -5 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div>
                {/* Premium User Info Card */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-purple-50 to-blue-50 opacity-50"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-pink-300/20 to-purple-300/20 rounded-full blur-2xl"></div>
                  
                  <DropdownMenuLabel className="p-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-14 w-14 ring-2 ring-pink-400/30 shadow-lg shadow-pink-400/20">
                        <AvatarImage src={userData.avatar || "./avatar-80-07.jpg"} alt={userData.name} />
                        <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-500 text-white text-lg font-bold">
                          {getInitials(userData.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-foreground truncate text-sm font-bold">
                            {userData.name}
                          </span>
                          <Badge className={`${getRoleBadge(userData.role).className} border-0 text-[10px] px-2 py-0.5`}>
                            {getRoleBadge(userData.role).label}
                          </Badge>
                        </div>
                        <span className="text-muted-foreground truncate text-xs flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-pink-400"></span>
                          {userData.email}
                        </span>
                        {userData.loyaltyPoints && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <StarIcon size={10} className="text-amber-400 fill-amber-400" />
                            <span className="text-[10px] text-muted-foreground">
                              {userData.loyaltyPoints} loyalty points
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </DropdownMenuLabel>
                </motion.div>

                <DropdownMenuSeparator className="my-1" />

                {/* Menu Items */}
                <DropdownMenuGroup className="px-1 space-y-0.5">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      <Link to={item.href} onClick={() => setIsOpen(false)}>
                        <DropdownMenuItem 
                          className={`px-3 py-2.5 rounded-lg transition-all duration-200 group cursor-pointer relative ${
                            isActive(item.href) 
                              ? 'bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200/50' 
                              : 'hover:bg-gradient-to-r hover:from-pink-50/50 hover:to-purple-50/50'
                          }`}
                        >
                          <div className={`p-1.5 rounded-md ${item.bgColor} ${item.color} group-hover:scale-110 transition-all duration-200`}>
                            <item.icon size={16} className="opacity-70 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                          </div>
                          <div className="flex-1 ml-2">
                            <span className="text-sm font-medium group-hover:text-pink-600 transition-colors">
                              {item.label}
                            </span>
                            <p className="text-[10px] text-muted-foreground/70">
                              {item.description}
                            </p>
                          </div>
                          <motion.div 
                            className="ml-auto opacity-0 group-hover:opacity-100 transition-all"
                            initial={{ x: -5 }}
                            animate={{ x: 0 }}
                          >
                            <span className="text-xs text-pink-400">✦</span>
                          </motion.div>
                        </DropdownMenuItem>
                      </Link>
                    </motion.div>
                  ))}
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="my-1" />

                {/* Logout Button */}
                <DropdownMenuItem className="p-1">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full"
                  >
                    <Button 
                      onClick={handlelogout}
                      disabled={isLoggingOut}
                      variant="ghost"
                      className="w-full gap-2 bg-gradient-to-r  hover:from-pink-500/20 hover:to-purple-500/20 text-white from-pink-50 to-purple-500 bg-clip-text text-transparent font-medium hover:text-pink-700 border border-pink-200/50 hover:border-pink-300 transition-all duration-300 group"
                    >
                      {isLoggingOut ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="h-4 w-4 border-2 border-pink-500/30 border-t-pink-500 rounded-full"
                        />
                      ) : (
                        <LogOutIcon size={16} className="opacity-70 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                      )}
                      <span className="font-medium">
                        {isLoggingOut ? "Logging out..." : "Sign Out"}
                      </span>
                      
                    </Button>
                  </motion.div>
                </DropdownMenuItem>

                {/* Footer with brand */}
                <div className="px-4 py-2 mt-1">
                  <p className="text-[10px] text-center text-muted-foreground/50 flex items-center justify-center gap-2">
                    <span className="w-4 h-px bg-gradient-to-r from-transparent to-pink-300"></span>
                    <span className="bg-gradient-to-r from-pink-50 to-purple-500 bg-clip-text text-transparent font-medium">
                      ✦ KONEBARI ✦
                    </span>
                    <span className="w-4 h-px bg-gradient-to-l from-transparent to-pink-300"></span>
                  </p>
                </div>
              </div>
            </motion.div>
          </DropdownMenuContent>
        )}
      </AnimatePresence>
    </DropdownMenu>
  )
}