import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Lightbulb, User, Calendar } from "lucide-react";

export default function ReceivedSolutions() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const challengeId = searchParams.get("challenge");

  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const { data: challenge } = useQuery({
    queryKey: ["challenge", challengeId],
    queryFn: async () => {
      if (!challengeId) return null;
      
      const { data, error } = await supabase
        .from("challenges")
        .select("*")
        .eq("id", challengeId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!challengeId,
  });

  const { data: solutions, isLoading } = useQuery({
    queryKey: ["received-solutions", challengeId, session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      // Se tem challengeId específico, buscar soluções desse desafio
      if (challengeId) {
        const { data, error } = await supabase
          .from("solutions")
          .select("*, challenges(title), profiles(full_name, organization), solution_statuses(name)")
          .eq("challenge_id", challengeId)
          .order("created_at", { ascending: false });

        if (error) throw error;
        return data;
      }
      
      // Senão, buscar soluções de todos os desafios do usuário
      const { data, error } = await supabase
        .from("solutions")
        .select("*, challenges!inner(title, created_by), profiles(full_name, organization), solution_statuses(name)")
        .eq("challenges.created_by", session.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-muted/30">
          <div className="container mx-auto px-4 py-12">
            <Skeleton className="h-12 w-64 mb-8" />
            <div className="grid gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <Button variant="ghost" className="mb-8 rounded-full" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Dashboard
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {challenge ? `Soluções para: ${challenge.title}` : "Soluções Recebidas"}
            </h1>
            <p className="text-muted-foreground">
              Total de {solutions?.length || 0} solução(ões) recebida(s)
            </p>
          </div>

          {!solutions || solutions.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center space-y-4">
                  <Lightbulb className="h-16 w-16 text-muted-foreground mx-auto" />
                  <h3 className="text-xl font-semibold">Nenhuma solução encontrada</h3>
                  <p className="text-muted-foreground">
                    {challenge 
                      ? "Este desafio ainda não recebeu soluções."
                      : "Você ainda não recebeu soluções para seus desafios."}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {solutions.map((solution) => (
                <Card key={solution.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4 flex-wrap">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{solution.title}</CardTitle>
                        {!challengeId && (
                          <p className="text-sm text-muted-foreground">
                            Desafio: {solution.challenges?.title}
                          </p>
                        )}
                      </div>
                      {solution.solution_statuses && (
                        <Badge variant="secondary">
                          {solution.solution_statuses.name}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground line-clamp-3">
                      {solution.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {solution.profiles && (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>
                            {solution.profiles.full_name}
                            {solution.profiles.organization && ` - ${solution.profiles.organization}`}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(solution.created_at).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>

                    {solution.benefits && (
                      <div className="pt-2 border-t">
                        <p className="text-sm font-medium mb-1">Benefícios:</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {solution.benefits}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
