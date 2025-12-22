import { useQuery } from "@tanstack/react-query";
import { solutionsApi } from "@/lib/api";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lightbulb, Calendar, Edit, Eye, FileText, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { openBase64InNewTab } from "@/lib/utils";

export default function MySolutions() {
  const navigate = useNavigate();
  const [viewingSolution, setViewingSolution] = useState<any>(null);

  const { data: solutions, isLoading } = useQuery({
    queryKey: ["my-solutions"],
    queryFn: () => solutionsApi.getMy(),
  });

  const statusLabels: Record<string, string> = {
    draft: "Rascunho",
    submitted: "Enviada",
    in_review: "Em Análise",
    approved: "Aprovada",
    rejected: "Rejeitada",
    pending: "Em Análise",
  };

  const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    draft: "outline",
    submitted: "secondary",
    in_review: "default",
    approved: "default",
    rejected: "destructive",
    pending: "secondary",
  };

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
            <h1 className="text-3xl font-bold mb-2">Minhas Soluções</h1>
            <p className="text-muted-foreground">
              Total de {solutions?.length || 0} solução(ões)
            </p>
          </div>

          {!solutions || solutions.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center space-y-4">
                  <Lightbulb className="h-16 w-16 text-muted-foreground mx-auto" />
                  <h3 className="text-xl font-semibold">Nenhuma solução encontrada</h3>
                  <p className="text-muted-foreground">
                    Você ainda não criou nenhuma solução. Explore os desafios disponíveis!
                  </p>
                  <Button className="rounded-full" onClick={() => navigate("/desafios")}>
                    Ver Desafios
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {solutions.map((solution) => (
                <Card
                  key={solution.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{solution.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Desafio: {solution.challenge_title}
                        </p>
                      </div>
                      <Badge variant={statusColors[solution.status]}>
                        {statusLabels[solution.status]}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-2 mb-4">
                      {solution.description}
                    </p>
                    <div className="flex flex-wrap gap-4 items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Criada em: {new Date(solution.created_at).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {solution.status === "draft" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/desafios/${solution.challenge_id}?solution=${solution.id}`);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewingSolution(solution);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Visualizar
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Modal de Visualização */}
      <Dialog open={!!viewingSolution} onOpenChange={() => setViewingSolution(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewingSolution?.title}</DialogTitle>
          </DialogHeader>

          {viewingSolution && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Desafio</h3>
                <p className="text-muted-foreground">{viewingSolution.challenge_title}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Descrição</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{viewingSolution.description}</p>
              </div>

              {viewingSolution.problem_solved && (
                <div>
                  <h3 className="font-semibold mb-2">Problema Resolvido</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{viewingSolution.problem_solved}</p>
                </div>
              )}

              {viewingSolution.benefits && (
                <div>
                  <h3 className="font-semibold mb-2">Benefícios</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{viewingSolution.benefits}</p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                {viewingSolution.team_name && (
                  <div>
                    <h3 className="font-semibold mb-2">Nome da Equipe</h3>
                    <p className="text-muted-foreground">{viewingSolution.team_name}</p>
                  </div>
                )}
                {viewingSolution.participant_type && (
                  <div>
                    <h3 className="font-semibold mb-2">Tipo de Participante</h3>
                    <p className="text-muted-foreground">{viewingSolution.participant_type}</p>
                  </div>
                )}
              </div>

              {viewingSolution.detailed_operation && (
                <div>
                  <h3 className="font-semibold mb-2">Operação Detalhada</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{viewingSolution.detailed_operation}</p>
                </div>
              )}

              {viewingSolution.contribution_objectives && (
                <div>
                  <h3 className="font-semibold mb-2">Contribuição para Objetivos</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{viewingSolution.contribution_objectives}</p>
                </div>
              )}

              {viewingSolution.direct_beneficiaries && (
                <div>
                  <h3 className="font-semibold mb-2">Beneficiários Diretos</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{viewingSolution.direct_beneficiaries}</p>
                </div>
              )}

              {viewingSolution.solution_differentials && (
                <div>
                  <h3 className="font-semibold mb-2">Diferenciais</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{viewingSolution.solution_differentials}</p>
                </div>
              )}

              {viewingSolution.territory_replication && (
                <div>
                  <h3 className="font-semibold mb-2">Replicação</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{viewingSolution.territory_replication}</p>
                </div>
              )}

              {viewingSolution.required_resources && (
                <div>
                  <h3 className="font-semibold mb-2">Recursos Necessários</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{viewingSolution.required_resources}</p>
                </div>
              )}

              {viewingSolution.validation_prototyping && (
                <div>
                  <h3 className="font-semibold mb-2">Validação e Prototipagem</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{viewingSolution.validation_prototyping}</p>
                </div>
              )}

              {viewingSolution.success_indicators && (
                <div>
                  <h3 className="font-semibold mb-2">Indicadores de Sucesso</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{viewingSolution.success_indicators}</p>
                </div>
              )}

              {viewingSolution.established_partnerships && (
                <div>
                  <h3 className="font-semibold mb-2">Parcerias</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{viewingSolution.established_partnerships}</p>
                </div>
              )}

              {viewingSolution.solution_continuity && (
                <div>
                  <h3 className="font-semibold mb-2">Continuidade</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{viewingSolution.solution_continuity}</p>
                </div>
              )}

              {(viewingSolution.linkedin_link || viewingSolution.instagram_link || viewingSolution.portfolio_link) && (
                <div>
                  <h3 className="font-semibold mb-2">Redes Sociais e Links</h3>
                  <div className="flex flex-col gap-1">
                    {viewingSolution.linkedin_link && (
                      <a href={viewingSolution.linkedin_link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block truncate">
                        LinkedIn: {viewingSolution.linkedin_link}
                      </a>
                    )}
                    {viewingSolution.instagram_link && (
                      <a href={viewingSolution.instagram_link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block truncate">
                        Instagram: {viewingSolution.instagram_link}
                      </a>
                    )}
                    {viewingSolution.portfolio_link && (
                      <a href={viewingSolution.portfolio_link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block truncate">
                        Portfólio: {viewingSolution.portfolio_link}
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Documentos */}
              {(viewingSolution.document_1_url || viewingSolution.document_2_url || viewingSolution.document_3_url) && (
                <div>
                  <h3 className="font-semibold mb-3">Documentos Anexados</h3>
                  <div className="space-y-2">
                    {viewingSolution.document_1_url && (
                      <div
                        onClick={() => openBase64InNewTab(viewingSolution.document_1_url)}
                        className="flex items-center gap-2 text-primary hover:underline cursor-pointer"
                      >
                        <FileText className="h-4 w-4" />
                        <span>Documento 1</span>
                        <Download className="h-4 w-4 ml-auto" />
                      </div>
                    )}
                    {viewingSolution.document_2_url && (
                      <div
                        onClick={() => openBase64InNewTab(viewingSolution.document_2_url)}
                        className="flex items-center gap-2 text-primary hover:underline cursor-pointer"
                      >
                        <FileText className="h-4 w-4" />
                        <span>Documento 2</span>
                        <Download className="h-4 w-4 ml-auto" />
                      </div>
                    )}
                    {viewingSolution.document_3_url && (
                      <div
                        onClick={() => openBase64InNewTab(viewingSolution.document_3_url)}
                        className="flex items-center gap-2 text-primary hover:underline cursor-pointer"
                      >
                        <FileText className="h-4 w-4" />
                        <span>Documento 3</span>
                        <Download className="h-4 w-4 ml-auto" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t">
                <Badge variant={statusColors[viewingSolution.status]}>
                  {statusLabels[viewingSolution.status]}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Enviada em: {new Date(viewingSolution.created_at).toLocaleDateString("pt-BR")}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}