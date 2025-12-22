import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { challengesApi } from "@/lib/api";
import { formatPhone } from "@/lib/utils";

type InnovationAxis = any; // Simplified for REST API migration
type RelationshipType = any;
type ContentStatus = any;

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
  const [attachments, setAttachments] = useState<any[]>([]);
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
    queryFn: () => challengesApi.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: async (data: ChallengeFormData & { attachments: any }) => {
      // Use Base64 banner from preview
      const bannerUrl = bannerPreview;

      await challengesApi.create({
        ...data,
        banner_url: bannerUrl,
        // backend handle req.user.id
      });

      if (data.contact_phone) {
        console.log("Mocking WhatsApp to:", data.contact_phone);
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
      // Use Base64 banner from preview
      const bannerUrl = bannerPreview;

      await challengesApi.update(id, bannerUrl ? { ...data, banner_url: bannerUrl } : data);
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
    mutationFn: (id: string) => challengesApi.delete(id),
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

    setUploadingFiles(Array.from(files));
    const newAttachments: any[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      await new Promise((resolve) => {
        reader.onloadend = () => {
          newAttachments.push({
            name: file.name,
            type: file.type,
            data: reader.result as string
          });
          resolve(null);
        };
        reader.readAsDataURL(file);
      });
    }

    setAttachments([...attachments, ...newAttachments]);
    setUploadingFiles([]);
  };

  const removeAttachment = (indexToRemove: number) => {
    setAttachments(attachments.filter((_, index) => index !== indexToRemove));
  };

  const handleAttachmentClick = (att: any) => {
    if (typeof att === 'string') {
      window.open(att, '_blank');
      return;
    }

    if (att.data) {
      // Create a Blob from Base64
      try {
        const arr = att.data.split(',');
        const mime = arr[0].match(/:(.*?);/)![1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], { type: mime });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
      } catch (e) {
        console.error("Error opening attachment:", e);
        toast({
          variant: "destructive",
          title: "Erro ao abrir arquivo",
          description: "Formato inválido.",
        });
      }
    }
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
                      {attachments.map((att, index) => (
                        <div key={index} className="relative flex items-center p-2 border rounded-lg bg-gray-50 group hover:border-primary/50 transition-colors">
                          <button
                            type="button"
                            onClick={() => handleAttachmentClick(att)}
                            className="text-xs truncate max-w-[200px] mr-8 text-blue-600 hover:underline cursor-pointer flex items-center gap-2"
                            title={att.name || 'Anexo'}
                          >
                            <span className="font-medium">{att.name || `Anexo ${index + 1}`}</span>
                          </button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeAttachment(index)}
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
