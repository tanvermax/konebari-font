import * as React from "react"
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
} from "@/components/ui/sidebar"
import Logo from "@/assets/icons/logo"
import { Link, useLocation } from "react-router" // অ্যাক্টিভ রুট চেনার জন্য useLocation আনা হয়েছে
import { getSidebarItems } from "@/utils/getSidebaritem"
import { useUserInfoQuery } from "@/redux/features/auth/auth.api"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: userData } = useUserInfoQuery(undefined);
  const location = useLocation(); // বর্তমান ইউআরএল ট্র্যাক করার জন্য

  const data = {
    navMain: getSidebarItems(userData?.data?.role) || []
  }

  return (
    // সাইডবারের মেইন কন্টেইনারে গ্লাসমরফিজম ব্যাকগ্রাউন্ড ও ব্লার অ্যাড করা হয়েছে
    <Sidebar 
      {...props} 
      className="border-r border-white/20 dark:border-slate-800/40 bg-white/50 dark:bg-slate-950/40 backdrop-blur-xl shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all duration-300"
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-dashed border-slate-200/50 dark:border-slate-800/50 flex justify-center items-center">
        <Link to={"/"} className="transition-transform duration-300 hover:scale-105 block">
          <Logo />
        </Link>
      </div>

      {/* Navigation Content */}
      <SidebarContent className="px-3 py-4 space-y-4">
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title} className="p-0">
            {/* গ্রুপ লেবেল - দেখতে আরও ক্লিয়ার ও আধুনিক করা হয়েছে */}
            <SidebarGroupLabel className="px-3 text-[11px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-2">
              {group.title}
            </SidebarGroupLabel>
            
            <SidebarGroupContent>
              <SidebarMenu className="gap-1.5">
                {group.items.map((item) => {
                  // চেক করা হচ্ছে এই মেনু আইটেমটি বর্তমানে ওপেন আছে কিনা
                  const isActive = location.pathname === item.url;
                  const Icon = item.icon ; // আপনার আইটেমে আইকন থাকলে সেটা রেন্ডার হবে

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild
                        className={`relative w-full h-11 px-4 rounded-xl font-medium text-sm transition-all duration-300 group overflow-hidden ${
                          isActive 
                            ? "bg-gradient-to-r from-[#FF6900]/15 to-[#FF6900]/5 text-[#FF6900] shadow-[0_4px_12px_rgba(255,105,0,0.08)] border-l-[3px] border-[#FF6900]" 
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-slate-800/40 hover:shadow-[0_4px_12px_rgba(0,0,0,0.01)]"
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 w-full h-full">
                          {/* যদি আপনার হেল্পার ফাংশনে আইকন থাকে তবে তা দেখাবে, নয়তো গ্লাসি ডট দেখাবে */}
                          {Icon ? (
                            <div className={`h-[18px] w-[18px] shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                              isActive ? "text-[#FF6900]" : "text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200"
                            }`}>
                              <Icon />
                            </div>
                          ) : (
                            <span className={`h-1.5 w-1.5 rounded-full shrink-0 transition-all duration-300 ${
                              isActive ? "bg-[#FF6900] scale-125" : "bg-slate-300 dark:bg-slate-600 group-hover:bg-[#FF6900]"
                            }`} />
                          )}
                          
                          <span className="truncate tracking-wide">{item.title}</span>

                          {/* অ্যাক্টিভ থাকলে ডানপাশে একটি সফট গ্লো ইফেক্ট ব্যাকগ্রাউন্ড */}
                          {isActive && (
                            <span className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#FF6900]/10 rounded-full blur-md pointer-events-none" />
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
      <SidebarRail />
    </Sidebar>
  )
}