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
import { Pencil, Trash2, Plus, Upload, X, Target } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import type { Database } from "@/integrations/supabase/types";
import { formatPhone } from "@/lib/utils";

type InnovationAxis = Database["public"]["Enums"]["innovation_axis"];
type RelationshipType = Database["public"]["Enums"]["relationship_type"];
type ContentStatus = Database["public"]["Enums"]["content_status"];

interface ChallengeFormData {
  title: string;
  description: string;
  proposer: string;
  modality: string;
  axis: InnovationAxis;
  relationship_type: RelationshipType;
  start_date: string;
  end_date: string;
  benefits: string;
  expected_results: string;
  contact_email: string;
  contact_phone: string;
  status: ContentStatus;
}

export function AdminChallenges() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<ChallengeFormData>({
    title: "",
    description: "",
    proposer: "",
    modality: "",
    axis: "inovacao_governo",
    relationship_type: "B2G",
    start_date: "",
    end_date: "",
    benefits: "",
    expected_results: "",
    contact_email: "",
    contact_phone: "",
    status: "draft",
  });

  const { data: challenges, isLoading } = useQuery({
    queryKey: ["admin-challenges"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("challenges")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ChallengeFormData & { attachments: any }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let bannerUrl = null;

      // Upload do banner se houver
      if (bannerFile) {
        const fileExt = bannerFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('challenge-banners')
          .upload(fileName, bannerFile);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('challenge-banners')
          .getPublicUrl(uploadData.path);
        
        bannerUrl = publicUrl;
      }

      const { error } = await supabase.from("challenges").insert({
        title: data.title,
        description: data.description,
        proposer: data.proposer,
        modality: data.modality,
        axis: data.axis,
        relationship_type: data.relationship_type,
        start_date: data.start_date || null,
        end_date: data.end_date || null,
        benefits: data.benefits || null,
        expected_results: data.expected_results || null,
        contact_email: data.contact_email || null,
        contact_phone: data.contact_phone || null,
        status: data.status,
        attachments: data.attachments || null,
        banner_url: bannerUrl,
        created_by: user.id,
      });
      if (error) throw error;

      // Enviar mensagem WhatsApp para o criador
      if (data.contact_phone) {
        try {
          await supabase.functions.invoke('send-whatsapp', {
            body: {
              recipients: data.contact_phone.replace(/\D/g, ''),
              message: `Olá! Seu desafio "${data.title}" foi recebido com sucesso pela equipe MS INOVA MAIS. Em breve você receberá informações sobre o status da avaliação. Obrigado por participar!`
            }
          });
        } catch (whatsappError) {
          console.error('Erro ao enviar WhatsApp:', whatsappError);
          // Não falha a criação se o WhatsApp falhar
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-challenges"] });
      toast({ title: "Desafio criado com sucesso!" });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erro ao criar desafio",
        description: error.message,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ChallengeFormData> & { attachments?: any } }) => {
      let bannerUrl = null;

      // Upload do banner se houver um novo arquivo
      if (bannerFile) {
        const fileExt = bannerFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('challenge-banners')
          .upload(fileName, bannerFile);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('challenge-banners')
          .getPublicUrl(uploadData.path);
        
        bannerUrl = publicUrl;
      }

      const updateData = bannerUrl ? { ...data, banner_url: bannerUrl } : data;

      const { error } = await supabase
        .from("challenges")
        .update(updateData)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-challenges"] });
      toast({ title: "Desafio atualizado com sucesso!" });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar desafio",
        description: error.message,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("challenges").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-challenges"] });
      toast({ title: "Desafio excluído com sucesso!" });
      setDeleteId(null);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erro ao excluir desafio",
        description: error.message,
      });
    },
  });

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    setUploadingFiles(fileArray);

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
    setUploadingFiles([]);
  };

  const removeAttachment = (url: string) => {
    setAttachments(attachments.filter(a => a !== url));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      proposer: "",
      modality: "",
      axis: "inovacao_governo",
      relationship_type: "B2G",
      start_date: "",
      end_date: "",
      benefits: "",
      expected_results: "",
      contact_email: "",
      contact_phone: "",
      status: "draft",
    });
    setAttachments([]);
    setBannerFile(null);
    setBannerPreview(null);
    setEditingId(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (challenge: any) => {
    setFormData({
      title: challenge.title,
      description: challenge.description,
      proposer: challenge.proposer,
      modality: challenge.modality,
      axis: challenge.axis,
      relationship_type: challenge.relationship_type,
      start_date: challenge.start_date || "",
      end_date: challenge.end_date || "",
      benefits: challenge.benefits || "",
      expected_results: challenge.expected_results || "",
      contact_email: challenge.contact_email || "",
      contact_phone: challenge.contact_phone || "",
      status: challenge.status,
    });
    setAttachments(challenge.attachments || []);
    setBannerPreview(challenge.banner_url || null);
    setBannerFile(null);
    setEditingId(challenge.id);
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataWithAttachments = { ...formData, attachments };
    
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: dataWithAttachments });
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
        <h2 className="text-2xl font-bold">Gerenciar Desafios</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()} className="rounded-full">
              <Plus className="mr-2 h-4 w-4" />
              Novo Desafio
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Desafio" : "Novo Desafio"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  placeholder="Digite o título"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva o desafio"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                  className="rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="proposer">Proponente</Label>
                  <Input
                    id="proposer"
                    placeholder="Nome do proponente"
                    value={formData.proposer}
                    onChange={(e) => setFormData({ ...formData, proposer: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="modality">Modalidade</Label>
                  <Input
                    id="modality"
                    placeholder="Ex: Presencial, Online"
                    value={formData.modality}
                    onChange={(e) => setFormData({ ...formData, modality: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="axis">Eixo</Label>
                  <Select value={formData.axis} onValueChange={(value) => setFormData({ ...formData, axis: value as InnovationAxis })}>
                    <SelectTrigger>
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
                  <Label htmlFor="relationship_type">Tipo de Relacionamento</Label>
                  <Select value={formData.relationship_type} onValueChange={(value) => setFormData({ ...formData, relationship_type: value as RelationshipType })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="B2G">B2G - Business to Government</SelectItem>
                      <SelectItem value="G2G">G2G - Government to Government</SelectItem>
                      <SelectItem value="B2C">B2C - Business to Citizen</SelectItem>
                      <SelectItem value="G2A">G2A - Government to Administration</SelectItem>
                      <SelectItem value="G2C">G2C - Government to Citizen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Data de Início</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="end_date">Data de Término</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="benefits">Benefícios</Label>
                <Textarea
                  id="benefits"
                  placeholder="Descreva os benefícios"
                  value={formData.benefits}
                  onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                  rows={3}
                  className="rounded-xl"
                />
              </div>

              <div>
                <Label htmlFor="expected_results">Resultados Esperados</Label>
                <Textarea
                  id="expected_results"
                  placeholder="Descreva os resultados esperados"
                  value={formData.expected_results}
                  onChange={(e) => setFormData({ ...formData, expected_results: e.target.value })}
                  rows={3}
                  className="rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact_email">E-mail de Contato</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    placeholder="email@exemplo.com"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="contact_phone">Telefone de Contato</Label>
                  <Input
                    id="contact_phone"
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: formatPhone(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as ContentStatus })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="approved">Aprovado</SelectItem>
                    <SelectItem value="rejected">Rejeitado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Upload de Banner */}
              <div className="space-y-2">
                <Label htmlFor="banner">Banner do Desafio (opcional)</Label>
                <Input
                  id="banner"
                  type="file"
                  accept="image/*"
                  className="h-12"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setBannerFile(file);
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setBannerPreview(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {bannerPreview && (
                  <div className="mt-2">
                    <img src={bannerPreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="attachments">Anexos</Label>
                <div className="space-y-2">
                  <Input
                    id="attachments"
                    type="file"
                    multiple
                    className="h-12"
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
        {challenges && challenges.length === 0 ? (
          <Card className="p-12">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Nenhum desafio cadastrado</h3>
                <p className="text-sm text-muted-foreground">Crie o primeiro desafio para começar</p>
              </div>
            </div>
          </Card>
        ) : (
          challenges?.map((challenge) => (
          <Card key={challenge.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{challenge.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{challenge.proposer}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(challenge)}
                    className="rounded-full"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => setDeleteId(challenge.id)}
                    className="rounded-full"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm line-clamp-2">{challenge.description}</p>
              <div className="flex gap-2 mt-2">
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {challenge.status}
                </span>
                <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">
                  {challenge.axis}
                </span>
              </div>
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
              Tem certeza que deseja excluir este desafio? Esta ação não pode ser desfeita.
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
