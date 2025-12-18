import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { challengesApi, solutionsApi, authApi } from "@/lib/api";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar, User, Target, ChevronRight, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function ChallengeDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const solutionId = searchParams.get("solution");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Carregar dados do localStorage ao iniciar
  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem(`solution-draft-${id}`);
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      title: "",
      description: "",
      benefits: "",
      team_name: "",
      participant_type: "",
      problem_solved: "",
      contribution_objectives: "",
      direct_beneficiaries: "",
      detailed_operation: "",
      solution_differentials: "",
      territory_replication: "",
      required_resources: "",
      validation_prototyping: "",
      success_indicators: "",
      established_partnerships: "",
      solution_continuity: "",
      linkedin_link: "",
      instagram_link: "",
      portfolio_link: "",
    };
  };

  const [solutionData, setSolutionData] = useState(loadFromLocalStorage);

  const [documents, setDocuments] = useState<{
    doc1: File | null;
    doc2: File | null;
    doc3: File | null;
  }>({
    doc1: null,
    doc2: null,
    doc3: null,
  });

  // Salvar no localStorage sempre que os dados mudarem
  useEffect(() => {
    localStorage.setItem(`solution-draft-${id}`, JSON.stringify(solutionData));
  }, [solutionData, id]);

  const { data: challenge, isLoading } = useQuery({
    queryKey: ["challenge", id],
    queryFn: () => challengesApi.getById(id!),
  });

  const { data: sessionData } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      try {
        const user = await authApi.getMe();
        return { user };
      } catch (e) {
        return null;
      }
    },
  });

  const session = sessionData;
  const profile = sessionData?.user;

  // Buscar dados da solução se estiver em modo de edição
  const { data: existingSolution } = useQuery({
    queryKey: ["solution", solutionId],
    queryFn: () => solutionsApi.getById(solutionId!),
    enabled: !!solutionId,
  });

  // Preencher formulário com dados da solução existente e abrir o modal
  useEffect(() => {
    if (existingSolution) {
      setSolutionData({
        title: existingSolution.title || "",
        description: existingSolution.description || "",
        benefits: existingSolution.benefits || "",
        team_name: existingSolution.team_name || "",
        participant_type: existingSolution.participant_type || "",
        problem_solved: existingSolution.problem_solved || "",
        contribution_objectives: existingSolution.contribution_objectives || "",
        direct_beneficiaries: existingSolution.direct_beneficiaries || "",
        detailed_operation: existingSolution.detailed_operation || "",
        solution_differentials: existingSolution.solution_differentials || "",
        territory_replication: existingSolution.territory_replication || "",
        required_resources: existingSolution.required_resources || "",
        validation_prototyping: existingSolution.validation_prototyping || "",
        success_indicators: existingSolution.success_indicators || "",
        established_partnerships: existingSolution.established_partnerships || "",
        solution_continuity: existingSolution.solution_continuity || "",
        linkedin_link: existingSolution.linkedin_link || "",
        instagram_link: existingSolution.instagram_link || "",
        portfolio_link: existingSolution.portfolio_link || "",
      });
      setIsDialogOpen(true);
    }
  }, [existingSolution]);

  const handleSaveDraft = async () => {
    if (!session) {
      toast({
        title: "Faça login para salvar",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (challenge?.created_by === session.user.id && !solutionId) {
      toast({
        title: "Você criou este desafio",
        description: "O criador do desafio não pode enviar soluções.",
        variant: "destructive",
      });
      return;
    }

    if (!solutionData.title || !solutionData.description) {
      toast({
        title: "Preencha título e descrição",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload dos documentos se houver novos
      let doc1Url = existingSolution?.document_1_url || null;
      let doc2Url = existingSolution?.document_2_url || null;
      let doc3Url = existingSolution?.document_3_url || null;

      if (documents.doc1) {
        console.log("Mocking upload for doc1:", documents.doc1.name);
        doc1Url = `https://mock-storage.local/${documents.doc1.name}`;
      }

      if (documents.doc2) {
        console.log("Mocking upload for doc2:", documents.doc2.name);
        doc2Url = `https://mock-storage.local/${documents.doc2.name}`;
      }

      if (documents.doc3) {
        console.log("Mocking upload for doc3:", documents.doc3.name);
        doc3Url = `https://mock-storage.local/${documents.doc3.name}`;
      }

      if (solutionId) {
        // Atualizar solução existente via REST API
        await solutionsApi.update(solutionId, {
          title: solutionData.title,
          description: solutionData.description,
          benefits: solutionData.benefits,
          status: 'draft',
          // Outros campos podem ser adicionados conforme necessário no backend
        });
      } else {
        // Criar nova solução via REST API
        await solutionsApi.create({
          challenge_id: id,
          submitted_by: session?.user.id, // Mocked user id if no session
          title: solutionData.title,
          description: solutionData.description,
          benefits: solutionData.benefits,
          status: 'draft',
        });
      }

      toast({
        title: solutionId ? "Rascunho atualizado!" : "Rascunho salvo!",
        description: "Você pode continuar editando mais tarde.",
      });
      localStorage.removeItem(`solution-draft-${id}`);
      setIsDialogOpen(false);
      navigate("/minhas-solucoes");
    } catch (error) {
      console.error("Error saving draft:", error);
      toast({
        title: "Erro ao salvar",
        description: "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitSolution = async () => {
    if (!session) {
      toast({
        title: "Faça login para enviar uma solução",
        description: "Você precisa estar autenticado para propor soluções.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (challenge?.created_by === session.user.id && !solutionId) {
      toast({
        title: "Você criou este desafio",
        description: "O criador do desafio não pode enviar soluções para o próprio desafio.",
        variant: "destructive",
      });
      return;
    }

    if (!solutionData.title || !solutionData.description) {
      toast({
        title: "Preencha os campos obrigatórios",
        description: "Título e descrição são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload dos documentos (MOCKED)
      let doc1Url = existingSolution?.document_1_url || null;
      let doc2Url = existingSolution?.document_2_url || null;
      let doc3Url = existingSolution?.document_3_url || null;

      if (solutionId) {
        // Atualizar solução existente via REST API
        await solutionsApi.update(solutionId, {
          title: solutionData.title,
          description: solutionData.description,
          benefits: solutionData.benefits,
          status: 'submitted',
        });
      } else {
        // Criar nova solução via REST API
        await solutionsApi.create({
          challenge_id: id,
          submitted_by: session?.user.id,
          title: solutionData.title,
          description: solutionData.description,
          benefits: solutionData.benefits,
          status: 'submitted',
        });
      }

      // Enviar mensagem WhatsApp (MOCKED)
      console.log("Mocking WhatsApp message to phone");

      toast({
        title: solutionId ? "Solução atualizada com sucesso!" : "Solução enviada com sucesso!",
        description: solutionId ? "Sua solução foi atualizada." : "Sua proposta foi enviada e está aguardando avaliação.",
      });

      localStorage.removeItem(`solution-draft-${id}`);
      setIsDialogOpen(false);
      navigate("/minhas-solucoes");

      setSolutionData({
        title: "",
        description: "",
        benefits: "",
        team_name: "",
        participant_type: "",
        problem_solved: "",
        contribution_objectives: "",
        direct_beneficiaries: "",
        detailed_operation: "",
        solution_differentials: "",
        territory_replication: "",
        required_resources: "",
        validation_prototyping: "",
        success_indicators: "",
        established_partnerships: "",
        solution_continuity: "",
        linkedin_link: "",
        instagram_link: "",
        portfolio_link: "",
      });
      setDocuments({ doc1: null, doc2: null, doc3: null });
    } catch (error) {
      console.error("Error submitting solution:", error);
      toast({
        title: "Erro ao enviar solução",
        description: "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-muted/30">
          <div className="mx-auto px-4 md:px-16 lg:px-24 py-12 max-w-[1400px]">
            <Skeleton className="h-12 w-48 mb-8" />
            <Skeleton className="h-96 w-full" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-muted/30">
          <div className="mx-auto px-4 md:px-16 lg:px-24 py-12 max-w-[1400px]">
            <div className="text-center space-y-6">
              <h1 className="text-3xl font-bold text-foreground">Desafio não encontrado</h1>
              <p className="text-muted-foreground">O desafio que você está procurando não existe.</p>
              <Button asChild>
                <Link to="/desafios">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para desafios
                </Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const axisLabels: Record<string, string> = {
    governance: "Governança e Gestão Pública",
    innovation: "Inovação e Tecnologia",
    sustainability: "Sustentabilidade",
    education: "Educação",
    health: "Saúde",
    infrastructure: "Infraestrutura",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="mx-auto px-4 md:px-8 lg:px-16 py-12 max-w-[1400px]">
          <Button variant="ghost" className="mb-8 rounded-full" asChild>
            <Link to="/desafios">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para desafios
            </Link>
          </Button>

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-6 min-w-0">
              {challenge.banner_url && (
                <img
                  src={challenge.banner_url}
                  alt={challenge.title}
                  className="w-full h-48 md:h-64 lg:h-80 object-cover rounded-lg shadow-lg"
                />
              )}

              <Card className="break-words">
                <CardHeader>
                  <CardTitle className="text-2xl md:text-3xl lg:text-4xl break-words">{challenge.title}</CardTitle>
                  <div className="flex flex-wrap gap-3 md:gap-4 text-sm text-muted-foreground mt-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>
                        {challenge.profiles?.full_name || challenge.proposer}
                        {challenge.profiles?.organization && ` - ${challenge.profiles.organization}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      <span>{axisLabels[challenge.axis] || challenge.axis}</span>
                    </div>
                    {challenge.end_date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Encerra em: {new Date(challenge.end_date).toLocaleDateString("pt-BR")}</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Descrição do Desafio</h3>
                    <p className="text-foreground/80 whitespace-pre-wrap">{challenge.description}</p>
                  </div>

                  {challenge.expected_results && (
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Resultados Esperados</h3>
                      <p className="text-foreground/80 whitespace-pre-wrap">{challenge.expected_results}</p>
                    </div>
                  )}

                  {challenge.benefits && (
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Benefícios</h3>
                      <p className="text-foreground/80 whitespace-pre-wrap">{challenge.benefits}</p>
                    </div>
                  )}

                  {challenge.attachments && Array.isArray(challenge.attachments) && challenge.attachments.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Anexos</h3>
                      <div className="space-y-2">
                        {challenge.attachments.map((attachment: any, index: number) => (
                          <a
                            key={index}
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-primary hover:underline"
                          >
                            <FileText className="h-4 w-4" />
                            {attachment.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6 min-w-0">
              <Card className="break-words">
                <CardHeader>
                  <CardTitle>Informações de Contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 break-words">
                  {challenge.contact_email && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p className="text-foreground">{challenge.contact_email}</p>
                    </div>
                  )}
                  {challenge.contact_phone && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                      <p className="text-foreground">{challenge.contact_phone}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Modalidade</p>
                    <p className="text-foreground">{challenge.modality}</p>
                  </div>
                  {challenge.relationship_type && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Tipo de Relacionamento</p>
                      <p className="text-foreground capitalize">{challenge.relationship_type}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Mostrar botão apenas para solvers e admins */}
              {profile?.role === "solver" || profile?.role === "admin" || profile?.role === "advanced" ? (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full h-12 text-lg rounded-full"
                      disabled={session?.user.id === challenge?.created_by}
                      style={{
                        opacity: session?.user.id === challenge?.created_by ? 0.5 : 1,
                        cursor: session?.user.id === challenge?.created_by ? 'not-allowed' : 'pointer'
                      }}
                      onClick={(e) => {
                        if (session?.user.id === challenge?.created_by) {
                          e.preventDefault();
                          toast({
                            title: "Você criou este desafio",
                            description: "O criador do desafio não pode enviar soluções para o próprio desafio.",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      {solutionId ? "Editar Solução" : "Enviar Solução"}
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby="solution-form-description">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">Propor Solução</DialogTitle>
                      <p id="solution-form-description" className="text-sm text-muted-foreground mt-2">
                        Preencha o formulário abaixo para enviar sua proposta de solução para este desafio.
                      </p>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Título da Solução *</Label>
                          <Input
                            id="title"
                            placeholder="Digite o título da sua solução"
                            value={solutionData.title}
                            onChange={(e) => setSolutionData({ ...solutionData, title: e.target.value })}
                            className="h-12"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="team_name">Nome da Equipe</Label>
                          <Input
                            id="team_name"
                            placeholder="Nome da equipe"
                            value={solutionData.team_name}
                            onChange={(e) => setSolutionData({ ...solutionData, team_name: e.target.value })}
                            className="h-12"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="participant_type">Tipo de Participante</Label>
                        <Input
                          id="participant_type"
                          placeholder="Ex: Pessoa Física, Empresa, Startup, etc."
                          value={solutionData.participant_type}
                          onChange={(e) => setSolutionData({ ...solutionData, participant_type: e.target.value })}
                          className="h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Resumo da Solução *</Label>
                        <Textarea
                          id="description"
                          placeholder="Descreva resumidamente sua proposta de solução"
                          value={solutionData.description}
                          onChange={(e) => setSolutionData({ ...solutionData, description: e.target.value })}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="problem_solved">Que problema sua solução resolve?</Label>
                        <Textarea
                          id="problem_solved"
                          placeholder="Descreva o problema que sua solução resolve"
                          value={solutionData.problem_solved}
                          onChange={(e) => setSolutionData({ ...solutionData, problem_solved: e.target.value })}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contribution_objectives">Contribuição para os objetivos</Label>
                        <Textarea
                          id="contribution_objectives"
                          placeholder="Como sua solução contribui para os objetivos do programa?"
                          value={solutionData.contribution_objectives}
                          onChange={(e) => setSolutionData({ ...solutionData, contribution_objectives: e.target.value })}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="direct_beneficiaries">Beneficiários Diretos</Label>
                        <Textarea
                          id="direct_beneficiaries"
                          placeholder="Quem são os beneficiários diretos da solução?"
                          value={solutionData.direct_beneficiaries}
                          onChange={(e) => setSolutionData({ ...solutionData, direct_beneficiaries: e.target.value })}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="detailed_operation">Funcionamento Detalhado</Label>
                        <Textarea
                          id="detailed_operation"
                          placeholder="Como sua solução funciona em detalhes?"
                          value={solutionData.detailed_operation}
                          onChange={(e) => setSolutionData({ ...solutionData, detailed_operation: e.target.value })}
                          rows={4}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="solution_differentials">Diferenciais da Solução</Label>
                        <Textarea
                          id="solution_differentials"
                          placeholder="Quais são os diferenciais da sua solução?"
                          value={solutionData.solution_differentials}
                          onChange={(e) => setSolutionData({ ...solutionData, solution_differentials: e.target.value })}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="benefits">Benefícios Esperados</Label>
                        <Textarea
                          id="benefits"
                          placeholder="Quais benefícios sua solução pode trazer?"
                          value={solutionData.benefits}
                          onChange={(e) => setSolutionData({ ...solutionData, benefits: e.target.value })}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="territory_replication">Replicação em Territórios</Label>
                        <Textarea
                          id="territory_replication"
                          placeholder="Sua solução pode ser replicada em outros territórios? Como?"
                          value={solutionData.territory_replication}
                          onChange={(e) => setSolutionData({ ...solutionData, territory_replication: e.target.value })}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="required_resources">Recursos Necessários</Label>
                        <Textarea
                          id="required_resources"
                          placeholder="Quais recursos são necessários para implementar a solução?"
                          value={solutionData.required_resources}
                          onChange={(e) => setSolutionData({ ...solutionData, required_resources: e.target.value })}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="validation_prototyping">Validação e Prototipagem</Label>
                        <Textarea
                          id="validation_prototyping"
                          placeholder="Sua solução já foi validada ou prototipada? Descreva"
                          value={solutionData.validation_prototyping}
                          onChange={(e) => setSolutionData({ ...solutionData, validation_prototyping: e.target.value })}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="success_indicators">Indicadores de Sucesso</Label>
                        <Textarea
                          id="success_indicators"
                          placeholder="Quais indicadores demonstram o sucesso da solução?"
                          value={solutionData.success_indicators}
                          onChange={(e) => setSolutionData({ ...solutionData, success_indicators: e.target.value })}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="established_partnerships">Parcerias Estabelecidas</Label>
                        <Textarea
                          id="established_partnerships"
                          placeholder="Há parcerias estabelecidas para esta solução?"
                          value={solutionData.established_partnerships}
                          onChange={(e) => setSolutionData({ ...solutionData, established_partnerships: e.target.value })}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="solution_continuity">Continuidade da Solução</Label>
                        <Textarea
                          id="solution_continuity"
                          placeholder="Como será garantida a continuidade da solução?"
                          value={solutionData.solution_continuity}
                          onChange={(e) => setSolutionData({ ...solutionData, solution_continuity: e.target.value })}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-4">
                        <Label>Links e Redes Sociais</Label>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="linkedin_link">LinkedIn</Label>
                            <Input
                              id="linkedin_link"
                              placeholder="URL do LinkedIn"
                              value={solutionData.linkedin_link}
                              onChange={(e) => setSolutionData({ ...solutionData, linkedin_link: e.target.value })}
                              className="h-12"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="instagram_link">Instagram</Label>
                            <Input
                              id="instagram_link"
                              placeholder="URL do Instagram"
                              value={solutionData.instagram_link}
                              onChange={(e) => setSolutionData({ ...solutionData, instagram_link: e.target.value })}
                              className="h-12"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="portfolio_link">Portfólio</Label>
                            <Input
                              id="portfolio_link"
                              placeholder="URL do Portfólio"
                              value={solutionData.portfolio_link}
                              onChange={(e) => setSolutionData({ ...solutionData, portfolio_link: e.target.value })}
                              className="h-12"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label>Documentos (até 3 arquivos)</Label>

                        <div className="space-y-2">
                          <Label htmlFor="doc1">Documento 1</Label>
                          {existingSolution?.document_1_url && (
                            <div className="mb-2">
                              <a
                                href={existingSolution.document_1_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline flex items-center gap-2"
                              >
                                <FileText className="h-4 w-4" />
                                Documento atual (clique para visualizar)
                              </a>
                            </div>
                          )}
                          <Input
                            id="doc1"
                            type="file"
                            onChange={(e) => setDocuments({ ...documents, doc1: e.target.files?.[0] || null })}
                            className="h-12"
                          />
                          {existingSolution?.document_1_url && (
                            <p className="text-xs text-muted-foreground">
                              Faça upload de um novo arquivo para substituir o documento atual
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="doc2">Documento 2</Label>
                          {existingSolution?.document_2_url && (
                            <div className="mb-2">
                              <a
                                href={existingSolution.document_2_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline flex items-center gap-2"
                              >
                                <FileText className="h-4 w-4" />
                                Documento atual (clique para visualizar)
                              </a>
                            </div>
                          )}
                          <Input
                            id="doc2"
                            type="file"
                            onChange={(e) => setDocuments({ ...documents, doc2: e.target.files?.[0] || null })}
                            className="h-12"
                          />
                          {existingSolution?.document_2_url && (
                            <p className="text-xs text-muted-foreground">
                              Faça upload de um novo arquivo para substituir o documento atual
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="doc3">Documento 3</Label>
                          {existingSolution?.document_3_url && (
                            <div className="mb-2">
                              <a
                                href={existingSolution.document_3_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline flex items-center gap-2"
                              >
                                <FileText className="h-4 w-4" />
                                Documento atual (clique para visualizar)
                              </a>
                            </div>
                          )}
                          <Input
                            id="doc3"
                            type="file"
                            onChange={(e) => setDocuments({ ...documents, doc3: e.target.files?.[0] || null })}
                            className="h-12"
                          />
                          {existingSolution?.document_3_url && (
                            <p className="text-xs text-muted-foreground">
                              Faça upload de um novo arquivo para substituir o documento atual
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={handleSaveDraft}
                          disabled={isSubmitting}
                          variant="outline"
                          className="flex-1 h-11 rounded-full"
                        >
                          {isSubmitting ? "Salvando..." : "Salvar Rascunho"}
                        </Button>
                        <Button
                          onClick={handleSubmitSolution}
                          disabled={isSubmitting}
                          className="flex-1 h-11 rounded-full"
                        >
                          {isSubmitting ? "Enviando..." : "Enviar Solução"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ) : null}

              {!session && (
                <Card className="bg-primary text-primary-foreground break-words">
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-2">Quer participar?</h3>
                    <p className="text-sm text-primary-foreground/90 mb-4">
                      Cadastre-se na plataforma e envie sua proposta de solução para este desafio.
                    </p>
                    <Button variant="secondary" className="w-full rounded-full" asChild>
                      <Link to="/auth?mode=register">Criar conta</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
