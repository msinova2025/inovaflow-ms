import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, X, Lightbulb } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import type { Database } from "@/integrations/supabase/types";

type InnovationAxis = Database["public"]["Enums"]["innovation_axis"];
type ContentStatus = Database["public"]["Enums"]["content_status"];

interface SolutionFormData {
  title: string;
  description: string;
  axis: InnovationAxis;
  benefits: string;
  challenge_id: string;
  solution_status_id?: string;
  team_name?: string;
  participant_type?: string;
  problem_solved?: string;
  contribution_objectives?: string;
  direct_beneficiaries?: string;
  detailed_operation?: string;
  solution_differentials?: string;
  territory_replication?: string;
  required_resources?: string;
  validation_prototyping?: string;
  success_indicators?: string;
  established_partnerships?: string;
  solution_continuity?: string;
  linkedin_link?: string;
  instagram_link?: string;
  portfolio_link?: string;
}

export function AdminSolutions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [sendWhatsApp, setSendWhatsApp] = useState(false);

  const [formData, setFormData] = useState<SolutionFormData>({
    title: "",
    description: "",
    axis: "inovacao_governo",
    benefits: "",
    challenge_id: "",
    solution_status_id: undefined,
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

  const { data: solutions, isLoading } = useQuery({
    queryKey: ["admin-solutions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("solutions")
        .select("*, challenges(title), profiles(full_name, phone), solution_statuses(name, message), celular_envio")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: challenges } = useQuery({
    queryKey: ["challenges-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("challenges")
        .select("id, title")
        .order("title");
      if (error) throw error;
      return data;
    },
  });

  const { data: solutionStatuses } = useQuery({
    queryKey: ["solution-statuses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("solution_statuses")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: SolutionFormData & { attachments: any }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("solutions").insert({
        title: data.title,
        description: data.description,
        axis: data.axis,
        benefits: data.benefits || null,
        challenge_id: data.challenge_id,
        attachments: data.attachments || null,
        created_by: user.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-solutions"] });
      toast({ title: "Solução criada com sucesso!" });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erro ao criar solução",
        description: error.message,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data, oldSolutionStatusId, phone, sendWhatsApp }: { 
      id: string; 
      data: Partial<SolutionFormData> & { attachments?: any }; 
      oldSolutionStatusId?: string;
      phone?: string;
      sendWhatsApp?: boolean;
    }) => {
      const { error } = await supabase
        .from("solutions")
        .update(data)
        .eq("id", id);
      if (error) throw error;

      // Se o status mudou e checkbox está marcado, envia WhatsApp
      if (sendWhatsApp && data.solution_status_id && data.solution_status_id !== oldSolutionStatusId && phone) {
        const status = solutionStatuses?.find(s => s.id === data.solution_status_id);
        if (status) {
          try {
            await supabase.functions.invoke('send-whatsapp', {
              body: {
                recipients: phone,
                message: status.message
              }
            });
          } catch (whatsappError) {
            console.error('Erro ao enviar WhatsApp:', whatsappError);
          }
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-solutions"] });
      toast({ title: "Solução atualizada com sucesso!" });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar solução",
        description: error.message,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("solutions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-solutions"] });
      toast({ title: "Solução excluída com sucesso!" });
      setDeleteId(null);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erro ao excluir solução",
        description: error.message,
      });
    },
  });

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    const uploadedUrls: string[] = [];

    for (const file of fileArray) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file);

      if (uploadError) {
        toast({
          variant: "destructive",
          title: "Erro ao fazer upload",
          description: uploadError.message,
        });
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      uploadedUrls.push(publicUrl);
    }

    setAttachments([...attachments, ...uploadedUrls]);
  };

  const removeAttachment = (url: string) => {
    setAttachments(attachments.filter(a => a !== url));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      axis: "inovacao_governo",
      benefits: "",
      challenge_id: "",
      solution_status_id: undefined,
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
    setAttachments([]);
    setSendWhatsApp(false);
    setEditingId(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (solution: any) => {
    setFormData({
      title: solution.title,
      description: solution.description,
      axis: solution.axis,
      benefits: solution.benefits || "",
      challenge_id: solution.challenge_id,
      solution_status_id: solution.solution_status_id || undefined,
      team_name: solution.team_name || "",
      participant_type: solution.participant_type || "",
      problem_solved: solution.problem_solved || "",
      contribution_objectives: solution.contribution_objectives || "",
      direct_beneficiaries: solution.direct_beneficiaries || "",
      detailed_operation: solution.detailed_operation || "",
      solution_differentials: solution.solution_differentials || "",
      territory_replication: solution.territory_replication || "",
      required_resources: solution.required_resources || "",
      validation_prototyping: solution.validation_prototyping || "",
      success_indicators: solution.success_indicators || "",
      established_partnerships: solution.established_partnerships || "",
      solution_continuity: solution.solution_continuity || "",
      linkedin_link: solution.linkedin_link || "",
      instagram_link: solution.instagram_link || "",
      portfolio_link: solution.portfolio_link || "",
    });
    setAttachments(solution.attachments || []);
    setSendWhatsApp(false);
    setEditingId(solution.id);
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataWithAttachments = { ...formData, attachments };
    
    if (editingId) {
      const solution = solutions?.find(s => s.id === editingId);
      updateMutation.mutate({ 
        id: editingId, 
        data: dataWithAttachments,
        oldSolutionStatusId: solution?.solution_status_id,
        phone: solution?.celular_envio,
        sendWhatsApp: sendWhatsApp
      });
    } else {
      createMutation.mutate(dataWithAttachments);
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Soluções</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()} className="rounded-full">
              <Plus className="mr-2 h-4 w-4" />
              Nova Solução
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Solução" : "Nova Solução"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="challenge_id">Desafio</Label>
                <Select value={formData.challenge_id} onValueChange={(value) => setFormData({ ...formData, challenge_id: value })}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Selecione um desafio" />
                  </SelectTrigger>
                  <SelectContent>
                    {challenges?.map((challenge) => (
                      <SelectItem key={challenge.id} value={challenge.id}>
                        {challenge.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    placeholder="Digite o título da solução"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="h-12"
                  />
                </div>

                <div>
                  <Label htmlFor="team_name">Nome da Equipe</Label>
                  <Input
                    id="team_name"
                    placeholder="Nome da equipe"
                    value={formData.team_name}
                    onChange={(e) => setFormData({ ...formData, team_name: e.target.value })}
                    className="h-12"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="participant_type">Tipo de Participante</Label>
                <Input
                  id="participant_type"
                  placeholder="Ex: Pessoa Física, Empresa, Startup, etc."
                  value={formData.participant_type}
                  onChange={(e) => setFormData({ ...formData, participant_type: e.target.value })}
                  className="h-12"
                />
              </div>

              <div>
                <Label htmlFor="description">Resumo da Solução</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva resumidamente a solução"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="problem_solved">Problema que Resolve</Label>
                <Textarea
                  id="problem_solved"
                  placeholder="Que problema sua solução resolve?"
                  value={formData.problem_solved}
                  onChange={(e) => setFormData({ ...formData, problem_solved: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="contribution_objectives">Contribuição para Objetivos</Label>
                <Textarea
                  id="contribution_objectives"
                  placeholder="Como contribui para os objetivos?"
                  value={formData.contribution_objectives}
                  onChange={(e) => setFormData({ ...formData, contribution_objectives: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="direct_beneficiaries">Beneficiários Diretos</Label>
                <Textarea
                  id="direct_beneficiaries"
                  placeholder="Quem são os beneficiários diretos?"
                  value={formData.direct_beneficiaries}
                  onChange={(e) => setFormData({ ...formData, direct_beneficiaries: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="detailed_operation">Funcionamento Detalhado</Label>
                <Textarea
                  id="detailed_operation"
                  placeholder="Como funciona em detalhes?"
                  value={formData.detailed_operation}
                  onChange={(e) => setFormData({ ...formData, detailed_operation: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="solution_differentials">Diferenciais da Solução</Label>
                <Textarea
                  id="solution_differentials"
                  placeholder="Quais os diferenciais?"
                  value={formData.solution_differentials}
                  onChange={(e) => setFormData({ ...formData, solution_differentials: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="benefits">Benefícios Esperados</Label>
                <Textarea
                  id="benefits"
                  placeholder="Descreva os benefícios da solução"
                  value={formData.benefits}
                  onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="territory_replication">Replicação em Territórios</Label>
                <Textarea
                  id="territory_replication"
                  placeholder="Pode ser replicada? Como?"
                  value={formData.territory_replication}
                  onChange={(e) => setFormData({ ...formData, territory_replication: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="required_resources">Recursos Necessários</Label>
                <Textarea
                  id="required_resources"
                  placeholder="Quais recursos são necessários?"
                  value={formData.required_resources}
                  onChange={(e) => setFormData({ ...formData, required_resources: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="validation_prototyping">Validação e Prototipagem</Label>
                <Textarea
                  id="validation_prototyping"
                  placeholder="Foi validada ou prototipada?"
                  value={formData.validation_prototyping}
                  onChange={(e) => setFormData({ ...formData, validation_prototyping: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="success_indicators">Indicadores de Sucesso</Label>
                <Textarea
                  id="success_indicators"
                  placeholder="Indicadores de sucesso"
                  value={formData.success_indicators}
                  onChange={(e) => setFormData({ ...formData, success_indicators: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="established_partnerships">Parcerias Estabelecidas</Label>
                <Textarea
                  id="established_partnerships"
                  placeholder="Parcerias existentes"
                  value={formData.established_partnerships}
                  onChange={(e) => setFormData({ ...formData, established_partnerships: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="solution_continuity">Continuidade da Solução</Label>
                <Textarea
                  id="solution_continuity"
                  placeholder="Como será garantida a continuidade?"
                  value={formData.solution_continuity}
                  onChange={(e) => setFormData({ ...formData, solution_continuity: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Links e Redes Sociais</Label>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="linkedin_link">LinkedIn</Label>
                    <Input
                      id="linkedin_link"
                      placeholder="URL do LinkedIn"
                      value={formData.linkedin_link}
                      onChange={(e) => setFormData({ ...formData, linkedin_link: e.target.value })}
                      className="h-12"
                    />
                  </div>
                  <div>
                    <Label htmlFor="instagram_link">Instagram</Label>
                    <Input
                      id="instagram_link"
                      placeholder="URL do Instagram"
                      value={formData.instagram_link}
                      onChange={(e) => setFormData({ ...formData, instagram_link: e.target.value })}
                      className="h-12"
                    />
                  </div>
                  <div>
                    <Label htmlFor="portfolio_link">Portfólio</Label>
                    <Input
                      id="portfolio_link"
                      placeholder="URL do Portfólio"
                      value={formData.portfolio_link}
                      onChange={(e) => setFormData({ ...formData, portfolio_link: e.target.value })}
                      className="h-12"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="axis">Eixo</Label>
                <Select value={formData.axis} onValueChange={(value) => setFormData({ ...formData, axis: value as InnovationAxis })}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Selecione o eixo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inovacao_governo">Inovação no Governo</SelectItem>
                    <SelectItem value="desenvolvimento_tecnologico">Desenvolvimento Tecnológico</SelectItem>
                    <SelectItem value="ia_ml">Inteligência Artificial e ML</SelectItem>
                    <SelectItem value="iot">Internet das Coisas</SelectItem>
                    <SelectItem value="sustentabilidade">Sustentabilidade</SelectItem>
                    <SelectItem value="saude_biotecnologia">Saúde e Biotecnologia</SelectItem>
                    <SelectItem value="educacao">Educação</SelectItem>
                    <SelectItem value="mobilidade">Mobilidade</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="solution_status_id">Status da Solução</Label>
                <Select 
                  value={formData.solution_status_id || "none"} 
                  onValueChange={(value) => setFormData({ 
                    ...formData, 
                    solution_status_id: value === "none" ? undefined : value 
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status da solução" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum</SelectItem>
                    {solutionStatuses?.map((status) => (
                      <SelectItem key={status.id} value={status.id}>
                        {status.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {editingId && (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="sendWhatsApp"
                    checked={sendWhatsApp}
                    onChange={(e) => setSendWhatsApp(e.target.checked)}
                    className="h-4 w-4 rounded"
                  />
                  <Label htmlFor="sendWhatsApp" className="cursor-pointer">
                    Enviar notificação por WhatsApp ao alterar o status
                  </Label>
                </div>
              )}

              <div>
                <Label htmlFor="attachments">Anexos</Label>
                <div className="space-y-2">
                  <Input
                    id="attachments"
                    type="file"
                    multiple
                    onChange={(e) => handleFileUpload(e.target.files)}
                  />
                  {attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {attachments.map((url, index) => (
                        <div key={index} className="relative">
                          <img src={url} alt={`Anexo ${index + 1}`} className="h-20 w-20 object-cover rounded" />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                            onClick={() => removeAttachment(url)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm} className="rounded-full">
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="rounded-full">
                  {editingId ? "Atualizar" : "Criar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {solutions && solutions.length === 0 ? (
          <Card className="p-12">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center">
                <Lightbulb className="h-8 w-8 text-secondary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Nenhuma solução cadastrada</h3>
                <p className="text-sm text-muted-foreground">Crie a primeira solução para começar</p>
              </div>
            </div>
          </Card>
        ) : (
          solutions?.map((solution) => (
          <Card key={solution.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{solution.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Desafio: {solution.challenges?.title}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(solution)}
                    className="rounded-full"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => setDeleteId(solution.id)}
                    className="rounded-full"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm line-clamp-2">{solution.description}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">
                  {solution.axis}
                </span>
                {solution.solution_statuses && (
                  <span className="text-xs bg-green-500/10 text-green-700 px-2 py-1 rounded-full">
                    {solution.solution_statuses.name}
                  </span>
                )}
              </div>
              {solution.profiles && (
                <p className="text-xs text-muted-foreground mt-2">
                  Criado por: {solution.profiles.full_name}
                </p>
              )}
            </CardContent>
          </Card>
        ))
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta solução? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              className="rounded-full"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
