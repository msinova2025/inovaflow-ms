import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 bg-card border-2 border-primary rounded-xl shadow-lg p-4 animate-in slide-in-from-bottom-5">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="text-sm text-foreground mb-3">
            Utilizamos cookies para melhorar sua experiência. Ao continuar navegando, você concorda com nossa{" "}
            <a href="/politica-privacidade" className="text-primary hover:underline">
              Política de Privacidade
            </a>.
          </p>
          <Button onClick={handleAccept} size="sm" className="rounded-full w-full">
            Aceitar
          </Button>
        </div>
        <button
          onClick={handleAccept}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
