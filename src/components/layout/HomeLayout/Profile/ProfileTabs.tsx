// components/layout/Profile/ProfileTabs.tsx
import { useState } from "react";
import { User, Package, Heart } from "lucide-react";
import { Link } from "react-router";
import PersonalInfoTab from "./PersonalInfoTab";
import OrdersPreviewTab from "./OrdersPreviewTab";

interface ProfileTabsProps {
  user: any;
}

export default function ProfileTabs({ user }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<"info" | "orders">("info");

  const tabs = [
    { id: "info", label: "Profile", icon: User },
    { id: "orders", label: "Orders", icon: Package },
  ];

  return (
    <div className="space-y-5">
      {/* Tab bar */}
      <div className="flex gap-2 bg-stone-100 dark:bg-stone-900/40 p-1 rounded-2xl w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 h-10 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? "bg-white dark:bg-stone-800 text-rose-600 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}

        <Link to="/favorites">
          <button className="flex items-center gap-2 px-4 h-10 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground transition-all">
            <Heart className="w-3.5 h-3.5" />
            Wishlist
          </button>
        </Link>
      </div>

      {/* Content */}
      {activeTab === "info" && <PersonalInfoTab user={user} />}
      {activeTab === "orders" && <OrdersPreviewTab />}
    </div>
  );
}