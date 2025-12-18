import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, HelpCircle, Info, ExternalLink, User, LogOut, Phone, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import logoMsGov from "@/assets/logo-ms-gov-new.png";
import logoMsInova from "@/assets/logo-ms-inova.png";
import { authApi, geralApi } from "@/lib/api";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    toast
  } = useToast();
  const isDashboard = location.pathname === '/dashboard';

  // Rotas que devem mostrar botão de voltar
  const showBackButton = ['/eventos', '/noticias', '/desafios', '/como-participar', '/sobre'].some(route => location.pathname.startsWith(route)) || /^\/evento\//.test(location.pathname) || /^\/noticia\//.test(location.pathname) || /^\/desafio\//.test(location.pathname);
  const handleGoBack = () => {
    navigate(-1);
  };
  const handleHomeClick = () => {
    if (profile?.user_type === 'challenger' || profile?.user_type === 'solver') {
      navigate('/dashboard');
    } else if (profile?.user_type === 'admin' || profile?.user_type === 'advanced') {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };
  const {
    data: geral
  } = useQuery({
    queryKey: ["geral"],
    queryFn: () => geralApi.get()
  });

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      // Try to get current user info
      authApi.getMe().then(user => {
        setUser(user);
        setProfile(user);
      }).catch(() => {
        // If token is invalid
        handleLogout();
      });
    }

    // Since we don't have a real-time event listener for local token changes easily
    // We can rely on the fact that this component remounts or we refresh.
  }, [location.pathname]);
  // Removed fetchProfile as profile is now fetched via getMe in useEffect
  const handleLogout = async () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_profile");
    setUser(null);
    setProfile(null);
    toast({
      title: "Logout realizado",
      description: "Até logo!"
    });
    navigate("/");
  };
  const getInitials = () => {
    if (profile?.full_name) {
      const names = profile.full_name.split(" ");
      if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      return names[0].substring(0, 2).toUpperCase();
    }
    return user?.email?.substring(0, 2).toUpperCase() || "U";
  };
  return <header className="sticky top-0 z-50 w-full bg-background border-b border-border">
    {/* Primeira linha - MS Gov */}
    <div className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-[1400px] flex h-12 items-center justify-between px-4 md:px-16 lg:px-24">
        <Link to="/" className="flex items-center">
          <img src={logoMsGov} alt="MS.GOV.BR" className="h-12 w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <a href={geral?.ouvidoria_url || "https://www.ms.gov.br/ouvidoria"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-medium hover:text-primary-foreground/80 transition-colors">
            OUVIDORIA
            <ExternalLink className="h-3 w-3" />
          </a>
          <a href={geral?.transparencia_url || "https://www.transparencia.ms.gov.br"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-medium hover:text-primary-foreground/80 transition-colors">
            TRANSPARÊNCIA
            <ExternalLink className="h-3 w-3" />
          </a>
          <a href={geral?.servicos_url || "https://www.servicos.ms.gov.br"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-medium hover:text-primary-foreground/80 transition-colors">
            SERVIÇOS
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        <button className="md:hidden text-primary-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
    </div>

    {/* Segunda linha - MS Inova Mais */}
    <div className="bg-background hidden md:block">
      <div className="mx-auto max-w-[1400px] flex h-16 items-center justify-between px-4 md:px-16 lg:px-24">
        <div className="flex items-center gap-8">
          {showBackButton}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-heading font-bold text-primary text-lg hidden sm:inline">MS INOVA MAIS</span>
          </Link>

          {!isDashboard && <nav className="hidden md:flex items-center gap-4 md:gap-8">
            {user && <button onClick={handleHomeClick} className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
              <Home className="h-4 w-4" />
              Início
            </button>}
            <Link to="/como-participar" className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
              <HelpCircle className="h-4 w-4" />
              Como participar
            </Link>
          </nav>}
        </div>

        <div className="hidden md:flex items-center gap-4 md:gap-6">
          {!isDashboard && <Link to="/sobre" className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
            <Info className="h-4 w-4" />
            Sobre o programa
          </Link>}
          {user ? <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10 bg-primary text-primary-foreground">
                  {profile?.avatar_url ? <img src={profile.avatar_url} alt={profile.full_name} className="h-full w-full object-cover rounded-full" /> : <AvatarFallback>{getInitials()}</AvatarFallback>}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => navigate("/perfil")} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Meu Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> : <Button asChild className="bg-[#007f31] hover:bg-[#007f31]/90 h-10 text-white rounded-full">
            <Link to="/auth?mode=register">Acessar serviço</Link>
          </Button>}
        </div>
      </div>
    </div>

    {/* Mobile Navigation */}
    {mobileMenuOpen && <div className="md:hidden border-t border-border bg-background">
      <nav className="container flex flex-col space-y-4 py-4 px-4">
        {user && <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <Avatar className="h-10 w-10 bg-primary text-primary-foreground">
            {profile?.avatar_url ? <img src={profile.avatar_url} alt={profile.full_name} className="h-full w-full object-cover rounded-full" /> : <AvatarFallback>{getInitials()}</AvatarFallback>}
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold text-sm">{profile?.full_name || "Usuário"}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>}
        <a href={geral?.ouvidoria_url || "https://www.ms.gov.br/ouvidoria"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary">
          OUVIDORIA
          <ExternalLink className="h-4 w-4" />
        </a>
        <a href={geral?.transparencia_url || "https://www.transparencia.ms.gov.br"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary">
          TRANSPARÊNCIA
          <ExternalLink className="h-4 w-4" />
        </a>
        <a href={geral?.servicos_url || "https://www.servicos.ms.gov.br"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary">
          SERVIÇOS
          <ExternalLink className="h-4 w-4" />
        </a>
        <button onClick={() => {
          handleHomeClick();
          setMobileMenuOpen(false);
        }} className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary w-full text-left">
          <Home className="h-4 w-4" />
          Início
        </button>
        <Link to="/como-participar" className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
          <HelpCircle className="h-4 w-4" />
          Como participar
        </Link>
        <Link to="/sobre" className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
          <Info className="h-4 w-4" />
          Sobre o programa
        </Link>
        {user ? <>
          <Button asChild variant="outline" className="h-10" onClick={() => setMobileMenuOpen(false)}>
            <Link to="/perfil">
              <User className="mr-2 h-4 w-4" />
              Meu Perfil
            </Link>
          </Button>
          <Button variant="outline" className="h-10" onClick={() => {
            handleLogout();
            setMobileMenuOpen(false);
          }}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </> : <Button asChild className="bg-[#007f31] hover:bg-[#007f31]/90 h-10 text-white rounded-full">
          <Link to="/auth?mode=register">Acessar serviço</Link>
        </Button>}
      </nav>
    </div>}
  </header>;
};