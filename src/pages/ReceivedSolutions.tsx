import { useQuery } from "@tanstack/react-query";
import { authApi, solutionsApi, challengesApi } from "@/lib/api";
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

  const { data: userData } = useQuery({
    queryKey: ["me"],
    queryFn: () => authApi.getMe(),
  });

  const { data: challenge } = useQuery({
    queryKey: ["challenge", challengeId],
    queryFn: () => challengesApi.getById(challengeId!),
    enabled: !!challengeId,
  });

  const { data: solutions, isLoading } = useQuery({
    queryKey: ["received-solutions", challengeId, userData?.id],
    queryFn: async () => {
      if (!userData?.id) return [];

      if (challengeId) {
        return solutionsApi.getByChallengeId(challengeId);
      }

      // Fallback or generic received solutions logic if needed
      // For now, let's assume we always have a challengeId or want all
      return solutionsApi.getAll();
    },
    enabled: !!userData?.id,
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
              {solutions.map((solution: any) => (
                <Card key={solution.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4 flex-wrap">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{solution.title}</CardTitle>
                        {!challengeId && (
                          <p className="text-sm text-muted-foreground">
                            Desafio: {solution.challenge_title || solution.challenges?.title}
                          </p>
                        )}
                      </div>
                      <Badge variant="secondary">
                        {solution.status_name || solution.solution_statuses?.name || 'Pendente'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground line-clamp-3">
                      {solution.description}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>
                          {solution.author_name || solution.profiles?.full_name}
                          {(solution.author_org || solution.profiles?.organization) && ` - ${solution.author_org || solution.profiles?.organization}`}
                        </span>
                      </div>
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
