// components/shared/FloatingChat.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Phone, Send } from "lucide-react";

// ✅ Apnar social links ekhane din
const WHATSAPP_NUMBER = "8801700000000"; // 👈 apnar number (country code soho, + chara)
const MESSENGER_USERNAME = "glowelegance"; // 👈 apnar messenger/facebook username
const PHONE_NUMBER = "+8801700000000"; // 👈 call option (optional)

const WHATSAPP_MESSAGE = "Hello! I'm interested in your products."; // 👈 default message

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [showPulse, setShowPulse] = useState(true);

  // ✅ 5 seconds por pulse animation bondho hoy
  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // ✅ Links
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    WHATSAPP_MESSAGE
  )}`;
  const messengerUrl = `https://m.me/${MESSENGER_USERNAME}`;
  const phoneUrl = `tel:${PHONE_NUMBER}`;

  return (
    <>
      {/* ✅ Floating Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] max-w-[340px]"
          >
            <div className="bg-white dark:bg-[#121212] rounded-2xl shadow-2xl border border-border/40 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-4 text-white relative">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">Chat with us</h3>
                    <p className="text-[11px] text-white/80 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                      Online now
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close chat"
                  className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-3 space-y-2">
                <p className="text-xs text-muted-foreground px-1 pb-1">
                  👋 Hi there! How can we help you?
                </p>

                {/* WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-950/50 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
                      fill="currentColor"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                      WhatsApp
                    </h4>
                    <p className="text-[10px] text-emerald-600/70 dark:text-emerald-500/80">
                      Chat with us instantly
                    </p>
                  </div>
                  <Send className="w-4 h-4 text-emerald-500 group-hover:translate-x-0.5 transition-transform" />
                </a>

                {/* Messenger */}
                <a
                  href={messengerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
                      fill="currentColor"
                    >
                      <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.9 1.18 5.5 3.14 7.33.19.17.28.42.25.67l-.31 2.32c-.06.42.31.73.68.56l2.53-1.13a.94.94 0 01.66-.02c.94.29 1.94.45 2.97.45 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm6 7.6l-2.94 4.66a1.5 1.5 0 01-2.17.4l-2.34-1.75a1.2 1.2 0 00-1.45 0L5.1 15.06c-.35.27-.81-.15-.58-.52l2.94-4.66a1.5 1.5 0 012.17-.4l2.34 1.75a1.2 1.2 0 001.45 0l4.05-3.11c.35-.27.81.15.58.52z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                      Messenger
                    </h4>
                    <p className="text-[10px] text-blue-600/70 dark:text-blue-500/80">
                      Message us on Facebook
                    </p>
                  </div>
                  <Send className="w-4 h-4 text-blue-500 group-hover:translate-x-0.5 transition-transform" />
                </a>

                {/* Call (Optional) */}
                <a
                  href={phoneUrl}
                  className="flex items-center gap-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-950/50 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center text-white flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-semibold text-rose-700 dark:text-rose-400">
                      Call Us
                    </h4>
                    <p className="text-[10px] text-rose-600/70 dark:text-rose-500/80">
                      {PHONE_NUMBER}
                    </p>
                  </div>
                  <Send className="w-4 h-4 text-rose-500 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-border/40 bg-stone-50 dark:bg-stone-900/50">
                <p className="text-[10px] text-center text-muted-foreground">
                   Typically replies within minutes
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Main Floating Button */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open chat"
        className="fixed bottom-15 right-4 sm:right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-2xl shadow-rose-500/40 flex items-center justify-center hover:shadow-rose-500/60 transition-shadow"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse rings (5s por off hoy) */}
        {showPulse && !open && (
          <>
            <span className="absolute inset-0 rounded-full bg-rose-500 opacity-75 animate-ping" />
            <span className="absolute inset-0 rounded-full bg-rose-500 opacity-40 animate-ping [animation-delay:0.5s]" />
          </>
        )}
      </motion.button>
    </>
  );
}