// components/navbar-components/NotificationDropdown.tsx
"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Zap,
  Package,
  Users,
  AlertTriangle,
  ShoppingBag,
  Sparkles,
  Loader2,
  BellOff,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useGetMyNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useDeleteNotificationMutation,
} from "@/redux/features/notification/notification.api";
import { useNavigate } from "react-router";
import { toast } from "sonner";

// ✅ Icon mapper
const getIcon = (iconName?: string) => {
  const map: Record<string, any> = {
    zap: Zap,
    sparkles: Sparkles,
    package: Package,
    user: Users,
    alert: AlertTriangle,
    bag: ShoppingBag,
    check: Check,
  };
  return map[iconName || "sparkles"] || Sparkles;
};

// ✅ Icon color mapper
const getIconColor = (type: string) => {
  const map: Record<string, string> = {
    order: "bg-pink-100 text-pink-600",
    product: "bg-purple-100 text-purple-600",
    user: "bg-blue-100 text-blue-600",
    payment: "bg-emerald-100 text-emerald-600",
    stock: "bg-amber-100 text-amber-600",
    system: "bg-zinc-100 text-zinc-600",
  };
  return map[type] || "bg-zinc-100 text-zinc-600";
};

// ✅ Priority dot
const getPriorityDot = (priority: string) => {
  const map: Record<string, string> = {
    low: "bg-zinc-400",
    medium: "bg-blue-400",
    high: "bg-amber-400",
    urgent: "bg-rose-500 animate-pulse",
  };
  return map[priority] || "bg-zinc-400";
};

// ✅ Relative time helper
const relativeTime = (dateStr: string) => {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString();
};

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch notifications
  const {
    data,
    isLoading,

  } = useGetMyNotificationsQuery(
    { limit: 20 },
    {
      pollingInterval: 30000, // refresh every 30s
      refetchOnMountOrArgChange: true,
    }
  );

  const [markRead] = useMarkNotificationReadMutation();
  const [markAllRead, { isLoading: isMarkingAll }] =
    useMarkAllNotificationsReadMutation();
  const [deleteNotif] = useDeleteNotificationMutation();

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  // ✅ Handle notification click
  const handleNotificationClick = async (n: any) => {
    if (!n.isRead) {
      await markRead(n._id).catch(() => {});
    }
    if (n.actionUrl) {
      setOpen(false);
      navigate(n.actionUrl);
    }
  };

  // ✅ Mark all read
  const handleMarkAllRead = async () => {
    try {
      await markAllRead(undefined).unwrap();
      toast.success("All marked as read");
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  // ✅ Delete single
  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await deleteNotif(id).unwrap();
      toast.success("Notification removed");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full relative text-zinc-600 hover:text-pink-500 hover:bg-pink-50 dark:text-zinc-400 dark:hover:text-pink-400 dark:hover:bg-pink-950/30 transition-all duration-200"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[9px] font-bold rounded-full shadow-md shadow-pink-500/40 border-2 border-background"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </motion.span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[380px] p-0 border-pink-100/50 dark:border-zinc-800/50 shadow-2xl rounded-2xl overflow-hidden"
      >
        {/* Header */}
        <DropdownMenuLabel className="p-4 pb-3 border-b border-pink-100/50 dark:border-zinc-800/50 bg-gradient-to-r from-pink-50/50 to-rose-50/50 dark:from-zinc-900 dark:to-zinc-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 shadow-sm">
                <Bell className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold">Notifications</p>
                <p className="text-[10px] text-muted-foreground">
                  {unreadCount > 0
                    ? `${unreadCount} unread`
                    : "All caught up"}
                </p>
              </div>
            </div>

            {unreadCount > 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleMarkAllRead}
                disabled={isMarkingAll}
                className="h-7 text-[10px] text-pink-600 hover:text-pink-700 hover:bg-pink-50 gap-1 px-2 rounded-lg"
              >
                {isMarkingAll ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <CheckCheck className="w-3 h-3" />
                )}
                Mark all
              </Button>
            )}
          </div>
        </DropdownMenuLabel>

        {/* Notifications List */}
        <ScrollArea className="max-h-[420px]">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 animate-pulse"
                >
                  <div className="w-9 h-9 rounded-xl bg-stone-200 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-stone-200 rounded w-3/4" />
                    <div className="h-2 bg-stone-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-pink-50 flex items-center justify-center mx-auto">
                <BellOff className="w-6 h-6 text-pink-400" />
              </div>
              <p className="text-sm font-medium">No notifications yet</p>
              <p className="text-[11px] text-muted-foreground">
                You'll see updates here
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              <AnimatePresence>
                {notifications.map((n: any) => {
                  const Icon = getIcon(n.icon);
                  return (
                    <motion.div
                      key={n._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      onClick={() => handleNotificationClick(n)}
                      className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors group relative ${
                        !n.isRead
                          ? "bg-pink-50/40 dark:bg-pink-950/10 hover:bg-pink-50/60"
                          : "hover:bg-stone-50 dark:hover:bg-zinc-900/50"
                      }`}
                    >
                      {/* Priority dot */}
                      {!n.isRead && (
                        <span
                          className={`absolute left-1 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full ${getPriorityDot(
                            n.priority
                          )}`}
                        />
                      )}

                      {/* Icon */}
                      <div
                        className={`p-2 rounded-xl shrink-0 ${getIconColor(
                          n.type
                        )}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={`text-xs leading-snug line-clamp-1 ${
                              !n.isRead
                                ? "font-semibold"
                                : "font-medium text-muted-foreground"
                            }`}
                          >
                            {n.title}
                          </p>
                          {!n.isRead && (
                            <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
                          {n.message}
                        </p>
                        <p className="text-[10px] text-muted-foreground/70 mt-1">
                          {relativeTime(n.createdAt)}
                        </p>
                      </div>

                      {/* Delete button (hover) */}
                      <button
                        onClick={(e) => handleDelete(e, n._id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-rose-50 text-rose-500 shrink-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator className="m-0" />
            <div className="p-2 bg-stone-50/50 dark:bg-zinc-900/50">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setOpen(false);
                  navigate("/admin/dashboard");
                }}
                className="w-full h-8 text-[11px] text-pink-600 hover:text-pink-700 hover:bg-pink-50 rounded-lg gap-1"
              >
                View all notifications
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}