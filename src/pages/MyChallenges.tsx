import { useQuery } from "@tanstack/react-query";
import { challengesApi } from "@/lib/api";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Target, Eye, Edit, FileText, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

export default function MyChallenges() {
  const navigate = useNavigate();
  const [viewingChallenge, setViewingChallenge] = useState<any>(null);

  const { data: challenges, isLoading } = useQuery({
    queryKey: ["my-challenges"],
    queryFn: () => challengesApi.getMy(),
  });

  const statusLabels: Record<string, string> = {
    draft: "Rascunho",
    pending: "Pendente",
    approved: "Aprovado",
    draft: "Rascunho",
    pending: "Pendente",
    open: "Aberto",
    approved: "Aprovado",
    rejected: "Rejeitado",
  };

  const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    draft: "outline",
    pending: "secondary",
    approved: "default",
    draft: "outline",
    pending: "secondary",
    open: "default",
    approved: "default",
    rejected: "destructive",
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
            <h1 className="text-3xl font-bold mb-2">Meus Desafios</h1>
            <p className="text-muted-foreground">
              Total de {challenges?.length || 0} desafio(s)
            </p>
          </div>

          {!challenges || challenges.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center space-y-4">
                  <Target className="h-16 w-16 text-muted-foreground mx-auto" />
                  <h3 className="text-xl font-semibold">Nenhum desafio encontrado</h3>
                  <p className="text-muted-foreground">
                    Você ainda não criou nenhum desafio. Comece agora!
                  </p>
                  <Button className="rounded-full" onClick={() => navigate("/criar-desafio")}>
                    Criar Primeiro Desafio
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {challenges.map((challenge) => (
                <Card
                  key={challenge.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <CardTitle className="text-xl">{challenge.title}</CardTitle>
                      <Badge variant={statusColors[challenge.status]}>
                        {statusLabels[challenge.status]}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-2 mb-4">
                      {challenge.description}
                    </p>
                    <div className="flex flex-wrap gap-4 items-center justify-between text-sm text-muted-foreground">
                      <div className="flex flex-wrap gap-4">
                        {challenge.start_date && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              Início: {new Date(challenge.start_date).toLocaleDateString("pt-BR")}
                            </span>
                          </div>
                        )}
                        {challenge.end_date && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              Fim: {new Date(challenge.end_date).toLocaleDateString("pt-BR")}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {challenge.status === "draft" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                            onClick={() => navigate(`/criar-desafio/${challenge.id}`)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                            onClick={() => setViewingChallenge(challenge)}
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
      <Dialog open={!!viewingChallenge} onOpenChange={() => setViewingChallenge(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewingChallenge?.title}</DialogTitle>
          </DialogHeader>

          {viewingChallenge && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Descrição</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{viewingChallenge.description}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Proponente</h3>
                <p className="text-muted-foreground">{viewingChallenge.proposer}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Modalidade</h3>
                  <p className="text-muted-foreground">{viewingChallenge.modality}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Eixo</h3>
                  <p className="text-muted-foreground">{viewingChallenge.axis}</p>
                </div>
              </div>

              {viewingChallenge.expected_results && (
                <div>
                  <h3 className="font-semibold mb-2">Resultados Esperados</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{viewingChallenge.expected_results}</p>
                </div>
              )}

              {viewingChallenge.benefits && (
                <div>
                  <h3 className="font-semibold mb-2">Benefícios</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{viewingChallenge.benefits}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {viewingChallenge.contact_email && (
                  <div>
                    <h3 className="font-semibold mb-2">E-mail de Contato</h3>
                    <p className="text-muted-foreground">{viewingChallenge.contact_email}</p>
                  </div>
                )}
                {viewingChallenge.contact_phone && (
                  <div>
                    <h3 className="font-semibold mb-2">Telefone de Contato</h3>
                    <p className="text-muted-foreground">{viewingChallenge.contact_phone}</p>
                  </div>
                )}
              </div>

              {/* Anexos */}
              {viewingChallenge.attachments && viewingChallenge.attachments.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Anexos</h3>
                  <div className="space-y-2">
                    {viewingChallenge.attachments.map((file: any, index: number) => (
                      <div
                        key={index}
                        onClick={() => typeof file === 'string' ? window.open(file, '_blank') : window.open(file.url, '_blank')}
                        className="flex items-center gap-2 p-3 rounded-lg border bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
                      >
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="flex-1 text-sm font-medium">{file.name || `Anexo ${index + 1}`}</span>
                        <Download className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t">
                <Badge variant={statusColors[viewingChallenge.status]}>
                  {statusLabels[viewingChallenge.status]}
                </Badge>
                <div className="text-sm text-muted-foreground">
                  {viewingChallenge.start_date && viewingChallenge.end_date && (
                    <span>
                      {new Date(viewingChallenge.start_date).toLocaleDateString("pt-BR")} - {new Date(viewingChallenge.end_date).toLocaleDateString("pt-BR")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
