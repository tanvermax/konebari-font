// components/shared/ShareButton.tsx
import { useState } from "react";
import { toast } from "sonner";
import {
  Share2,
  Copy,
  Check,
  Facebook,
  Twitter,
  MessageCircle,
  Link2,
  Send,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ShareButtonProps {
  url: string;
  title: string;
  description?: string;
  image?: string;
  variant?: "icon" | "button" | "inline";
  className?: string;
}

export default function ShareButton({
  url,
  title,
  description,
  image,
  variant = "icon",
  className = "",
}: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // ✅ Full URL ensure
  const fullUrl = url.startsWith("http")
    ? url
    : `${window.location.origin}${url}`;

  const shareText = description
    ? `${title} - ${description}`
    : `Check out ${title}`;

  // ✅ Copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast.success("Link copied! 🔗");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  // ✅ Native share (mobile)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description || title,
          url: fullUrl,
        });
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          toast.error("Share cancelled");
        }
      }
    } else {
      setOpen(true);
    }
  };

  // ✅ Social share links
  const socialLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${fullUrl}`)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(fullUrl)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(shareText)}`,
  };

  // ✅ Trigger Button
  const triggerButton = (() => {
    if (variant === "icon") {
      return (
        <button
          type="button"
          aria-label="Share product"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleNativeShare();
          }}
          className={`flex h-8 w-8 items-center justify-center rounded-full bg-white/90 dark:bg-black/50 backdrop-blur-md shadow-sm transition-all hover:scale-110 active:scale-95 ${className}`}
        >
          <Share2 size={14} className="text-stone-600 dark:text-stone-300" />
        </button>
      );
    }

    if (variant === "button") {
      return (
        <Button
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleNativeShare();
          }}
          className={`gap-2 rounded-xl ${className}`}
        >
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      );
    }

    // inline
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleNativeShare();
        }}
        className={`flex items-center gap-1.5 text-xs text-muted-foreground hover:text-rose-500 transition-colors ${className}`}
      >
        <Share2 className="w-3.5 h-3.5" />
        Share
      </button>
    );
  })();

  return (
    <>
      {triggerButton}

      {/* ✅ Share Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-rose-500" />
              Share this product
            </DialogTitle>
          </DialogHeader>

          {/* Product Preview */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 dark:bg-stone-900/50 border border-border/40">
            {image && (
              <img
                src={image}
                alt={title}
                className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
              />
            )}
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-semibold line-clamp-1">{title}</h4>
              {description && (
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-4 gap-2">
            <a
              href={socialLinks.facebook}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors group"
            >
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white">
                <Facebook className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-medium text-blue-700 dark:text-blue-400">
                Facebook
              </span>
            </a>

            <a
              href={socialLinks.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-950/50 transition-colors group"
            >
              <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                <MessageCircle className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
                WhatsApp
              </span>
            </a>

            <a
              href={socialLinks.telegram}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-sky-50 dark:bg-sky-950/30 hover:bg-sky-100 dark:hover:bg-sky-950/50 transition-colors group"
            >
              <div className="w-9 h-9 rounded-full bg-sky-500 flex items-center justify-center text-white">
                <Send className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-medium text-sky-700 dark:text-sky-400">
                Telegram
              </span>
            </a>

            <a
              href={socialLinks.twitter}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors group"
            >
              <div className="w-9 h-9 rounded-full bg-stone-900 dark:bg-stone-700 flex items-center justify-center text-white">
                <Twitter className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-medium text-stone-700 dark:text-stone-300">
                Twitter
              </span>
            </a>
          </div>

          {/* Copy Link */}
          <div className="flex items-center gap-2 p-2 pl-3 rounded-xl bg-stone-50 dark:bg-stone-900/50 border border-border/40">
            <Link2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <input
              type="text"
              readOnly
              value={fullUrl}
              className="flex-1 bg-transparent text-xs text-muted-foreground outline-none truncate"
            />
            <Button
              onClick={handleCopy}
              size="sm"
              className={`h-8 gap-1.5 px-3 rounded-lg text-xs transition-all ${
                copied
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                  : "bg-rose-500 hover:bg-rose-600 text-white"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}