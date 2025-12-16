import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Target, Lightbulb, Calendar, FileText, Users, LogOut, Home, Settings } from "lucide-react";
import { AdminChallenges } from "@/components/admin/AdminChallenges";
import { AdminSolutions } from "@/components/admin/AdminSolutions";
import { AdminUsers } from "@/components/admin/AdminUsers";
import AdminEvents from "@/components/admin/AdminEvents";
import AdminNews from "@/components/admin/AdminNews";
import AdminProgram from "@/components/admin/AdminProgram";
import AdminHowToParticipate from "@/components/admin/AdminHowToParticipate";
import AdminGeral from "@/components/admin/AdminGeral";
import AdminSolutionStatuses from "@/components/admin/AdminSolutionStatuses";
import type { User } from "@supabase/supabase-js";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
export default function Dashboard() {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [activeSection, setActiveSection] = useState("challenges");

  // Query para contar desafios do usuário
  const { data: myChallengesCount } = useQuery({
    queryKey: ["my-challenges-count", user?.id],
    queryFn: async () => {
      if (!user?.id || profile?.user_type !== "challenger") return 0;
      
      const { count, error } = await supabase
        .from("challenges")
        .select("*", { count: "exact", head: true })
        .eq("created_by", user.id);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!user?.id && profile?.user_type === "challenger",
  });

  // Query para contar soluções recebidas
  const { data: receivedSolutionsCount } = useQuery({
    queryKey: ["received-solutions-count", user?.id],
    queryFn: async () => {
      if (!user?.id || profile?.user_type !== "challenger") return 0;
      
      const { data: challenges } = await supabase
        .from("challenges")
        .select("id")
        .eq("created_by", user.id);

      if (!challenges || challenges.length === 0) return 0;

      const challengeIds = challenges.map(c => c.id);
      
      const { count, error } = await supabase
        .from("solutions")
        .select("*", { count: "exact", head: true })
        .in("challenge_id", challengeIds);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!user?.id && profile?.user_type === "challenger",
  });

  // Query para contar soluções do solucionador
  const { data: mySolutionsCount } = useQuery({
    queryKey: ["my-solutions-count", user?.id],
    queryFn: async () => {
      if (!user?.id || profile?.user_type !== "solver") return 0;
      
      const { count, error } = await supabase
        .from("solutions")
        .select("*", { count: "exact", head: true })
        .eq("created_by", user.id);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!user?.id && profile?.user_type === "solver",
  });
  useEffect(() => {
    checkUser();
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        loadProfile(session.user.id);
      } else {
        navigate("/auth");
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);
  const checkUser = async () => {
    try {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      await loadProfile(session.user.id);
    } catch (error) {
      console.error("Error checking user:", error);
      navigate("/auth");
    } finally {
      setLoading(false);
    }
  };
  const loadProfile = async (userId: string) => {
    try {
      const {
        data,
        error
      } = await supabase.from("profiles").select("*").eq("id", userId).single();
      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      console.error("Error loading profile:", error);
    }
  };
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout realizado",
        description: "Até breve!"
      });
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao sair",
        description: "Tente novamente"
      });
    }
  };
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>;
  }
  const userTypeLabel = {
    admin: "Administrador",
    advanced: "Usuário Avançado",
    challenger: "Desafiador",
    solver: "Solucionador"
  }[profile?.user_type] || "Usuário";
  const menuItems = [{
    id: "home",
    label: "Home",
    icon: Home,
    isLink: true,
    path: "/"
  }, {
    id: "challenges",
    label: "Desafios",
    icon: Target
  }, {
    id: "solutions",
    label: "Soluções",
    icon: Lightbulb
  }, {
    id: "solution-statuses",
    label: "Status de Soluções",
    icon: Settings
  }, {
    id: "users",
    label: "Usuários",
    icon: Users
  }, {
    id: "events",
    label: "Eventos",
    icon: Calendar
  }, {
    id: "news",
    label: "Notícias",
    icon: FileText
  }, {
    id: "program",
    label: "Programa",
    icon: FileText
  }, {
    id: "participate",
    label: "Como Participar",
    icon: FileText
  }, {
    id: "geral",
    label: "Configurações Gerais",
    icon: Settings
  }];
  return <div className="min-h-screen flex flex-col">

      {profile?.user_type === "admin" || profile?.user_type === "advanced" ? <SidebarProvider>
          <div className="flex flex-col w-full flex-1">
            {/* Dashboard Header */}
            <header className="bg-[#004f9f] border-b sticky top-0 z-50">
              <div className="container mx-auto px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SidebarTrigger className="text-white hover:bg-white/10" />
                  <h1 className="text-xl font-bold text-white">MS INOVA MAIS</h1>
                </div>
                <div className="flex items-center gap-4">
                  {user?.email && (
                    <span className="text-sm text-white/80">{user.email}</span>
                  )}
                </div>
              </div>
            </header>

            <div className="flex w-full flex-1">
              <Sidebar className="border-r">
                <div className="p-4">
                  <SidebarTrigger />
                </div>
              
              <SidebarContent className="py-[50px] bg-white">
                <SidebarGroup className="px-[57px]">
                  <SidebarGroupLabel>Administração</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {menuItems.map(item => <SidebarMenuItem key={item.id}>
                          <SidebarMenuButton 
                            onClick={() => item.isLink ? navigate(item.path) : setActiveSection(item.id)} 
                            isActive={activeSection === item.id}
                          >
                            <item.icon className="h-4 w-4" />
                            <span>{item.label}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>)}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                <div className="mt-auto p-4">
                  <Button variant="outline" onClick={handleLogout} className="w-full rounded-full">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </Button>
                </div>
              </SidebarContent>
            </Sidebar>

              <main className="flex-1 p-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Bem-vindo, {profile?.full_name}!</h1>
                <p className="text-muted-foreground">
                  Você está logado como <span className="font-semibold">{userTypeLabel}</span>
                </p>
              </div>

              <div className="bg-card rounded-lg shadow-sm p-6">
                {activeSection === "challenges" && <AdminChallenges />}
                {activeSection === "solutions" && <AdminSolutions />}
                {activeSection === "solution-statuses" && <AdminSolutionStatuses />}
                {activeSection === "users" && <AdminUsers />}
                {activeSection === "events" && <AdminEvents />}
                {activeSection === "news" && <AdminNews />}
                {activeSection === "program" && <AdminProgram />}
                {activeSection === "participate" && <AdminHowToParticipate />}
                {activeSection === "geral" && <AdminGeral />}
              </div>
            </main>
            </div>
          </div>
        </SidebarProvider> : <>
        <Header />
        <main className="flex-1 container py-12">
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-xl md:text-3xl font-bold mb-2">Bem-vindo, {profile?.full_name}!</h1>
              <p className="text-muted-foreground">
                Você está logado como <span className="font-semibold">{userTypeLabel}</span>
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="rounded-full">
              Sair
            </Button>
          </div>

          <div className={`grid gap-6 mb-8 ${profile?.user_type === "challenger" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}>
            {profile?.user_type === "challenger" && <>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/meus-desafios")}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Meus Desafios</CardTitle>
                    <Target className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{myChallengesCount ?? 0}</div>
                    <p className="text-xs text-muted-foreground">Total de desafios</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/solucoes-recebidas")}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Soluções Recebidas</CardTitle>
                    <Lightbulb className="h-4 w-4 text-secondary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{receivedSolutionsCount ?? 0}</div>
                    <p className="text-xs text-muted-foreground">Total de soluções</p>
                  </CardContent>
                </Card>
              </>}

            {profile?.user_type === "solver" && <>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/desafios")}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Desafios Disponíveis</CardTitle>
                    <Target className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Ver todos</div>
                    <p className="text-xs text-muted-foreground">Prontos para solucionar</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/minhas-solucoes")}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Minhas Soluções</CardTitle>
                    <Lightbulb className="h-4 w-4 text-secondary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{mySolutionsCount ?? 0}</div>
                    <p className="text-xs text-muted-foreground">Soluções criadas</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/eventos")}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Próximos Eventos</CardTitle>
                    <Calendar className="h-4 w-4 text-accent-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Ver todos</div>
                    <p className="text-xs text-muted-foreground">Eventos programados</p>
                  </CardContent>
                </Card>
              </>}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile?.user_type === "challenger" && <Button className="w-full justify-start rounded-full" variant="outline" onClick={() => navigate("/criar-desafio")}>
                    <Target className="mr-2 h-4 w-4" />
                    Criar Novo Desafio
                  </Button>}
                {profile?.user_type === "solver" && <>
                    <Button className="w-full justify-start rounded-full" variant="outline" onClick={() => navigate("/desafios")}>
                      <Target className="mr-2 h-4 w-4" />
                      Explorar Desafios
                    </Button>
                    <Button className="w-full justify-start rounded-full" variant="outline" onClick={() => navigate("/minhas-solucoes")}>
                      <Lightbulb className="mr-2 h-4 w-4" />
                      Minhas Soluções
                    </Button>
                  </>}
                <Button className="w-full justify-start rounded-full" variant="outline" onClick={() => navigate("/eventos")}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Ver Eventos
                </Button>
                <Button className="w-full justify-start rounded-full" variant="outline" onClick={() => navigate("/noticias")}>
                  <FileText className="mr-2 h-4 w-4" />
                  Ler Notícias
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Seu Perfil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-medium">{profile?.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">E-mail</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
                {profile?.organization && <div>
                    <p className="text-sm text-muted-foreground">Organização</p>
                    <p className="font-medium">{profile.organization}</p>
                  </div>}
                <Button variant="outline" className="w-full rounded-full" onClick={() => navigate("/perfil")}>
                  Editar Perfil
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        </>}

      <footer className="bg-[#004f9f] py-3 mt-auto">
        <div className="container text-center text-white text-xs">
          © 2024 MS INOVA MAIS - Governo do Estado de Mato Grosso do Sul
        </div>
      </footer>
    </div>;
}