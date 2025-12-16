import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Send, Upload, X } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

type InnovationAxis = "inovacao_governo" | "desenvolvimento_tecnologico" | "ia_ml" | "iot" | "sustentabilidade" | "saude_biotecnologia" | "educacao" | "mobilidade";
type RelationshipType = "G2G" | "G2C" | "G2A" | "B2G" | "B2C";

interface ChallengeFormData {
  title: string;
  description: string;
  proposer: string;
  modality: string;
  axis: InnovationAxis;
  relationship_type: RelationshipType;
  expected_results: string;
  benefits: string;
  contact_email: string;
  contact_phone: string;
  start_date: string;
  end_date: string;
}

export default function CreateChallenge() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string>("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem(`challenge-draft-${id || "new"}`);
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      title: "",
      description: "",
      proposer: "",
      modality: "",
      axis: "inovacao_governo" as InnovationAxis,
      relationship_type: "G2G" as RelationshipType,
      expected_results: "",
      benefits: "",
      contact_email: "",
      contact_phone: "",
      start_date: "",
      end_date: "",
    };
  };

  const [formData, setFormData] = useState<ChallengeFormData>(loadFromLocalStorage);

  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const { data: profile } = useQuery({
    queryKey: ["profile", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const { data: existingChallenge } = useQuery({
    queryKey: ["challenge", id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from("challenges")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Carregar dados do desafio existente
  useEffect(() => {
    if (existingChallenge && !existingChallenge.status) {
      setFormData({
        title: existingChallenge.title || "",
        description: existingChallenge.description || "",
        proposer: existingChallenge.proposer || "",
        modality: existingChallenge.modality || "",
        axis: existingChallenge.axis || "inovacao_governo",
        relationship_type: existingChallenge.relationship_type || "G2G",
        expected_results: existingChallenge.expected_results || "",
        benefits: existingChallenge.benefits || "",
        contact_email: existingChallenge.contact_email || "",
        contact_phone: existingChallenge.contact_phone || "",
        start_date: existingChallenge.start_date || "",
        end_date: existingChallenge.end_date || "",
      });
      setBannerUrl(existingChallenge.banner_url || "");
      
      // Tratar attachments como array
      if (existingChallenge.attachments && Array.isArray(existingChallenge.attachments)) {
        setAttachments(existingChallenge.attachments as string[]);
      } else {
        setAttachments([]);
      }
    }
  }, [existingChallenge]);

  // Verificar se o desafio já foi enviado
  useEffect(() => {
    if (existingChallenge && existingChallenge.status !== "draft") {
      const isAdmin = profile?.user_type === "admin" || profile?.user_type === "advanced";
      if (!isAdmin) {
        toast({
          title: "Acesso negado",
          description: "Este desafio já foi enviado e não pode mais ser editado.",
          variant: "destructive",
        });
        navigate(`/desafios/${id}`);
      }
    }
  }, [existingChallenge, profile, id, navigate, toast]);

  // Salvar no localStorage
  useEffect(() => {
    localStorage.setItem(`challenge-draft-${id || "new"}`, JSON.stringify(formData));
  }, [formData, id]);

  // Verificar permissão
  useEffect(() => {
    if (profile && profile.user_type !== "challenger" && profile.user_type !== "admin" && profile.user_type !== "advanced") {
      toast({
        title: "Acesso negado",
        description: "Apenas desafiadores podem criar desafios.",
        variant: "destructive",
      });
      navigate("/dashboard");
    }
  }, [profile, navigate, toast]);

  const handleBannerUpload = async (file: File) => {
    if (!session?.user?.id) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${session.user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('challenge-banners')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('challenge-banners')
        .getPublicUrl(fileName);

      setBannerUrl(publicUrl);
      toast({ title: "Banner enviado com sucesso!" });
    } catch (error: any) {
      toast({
        title: "Erro ao enviar banner",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAttachmentUpload = async (files: FileList | null) => {
    if (!files || !session?.user?.id) return;

    try {
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${session.user.id}/${Date.now()}_${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from('uploads')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('uploads')
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
      }

      setAttachments([...attachments, ...uploadedUrls]);
      toast({ title: "Anexos enviados com sucesso!" });
    } catch (error: any) {
      toast({
        title: "Erro ao enviar anexos",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const saveMutation = useMutation({
    mutationFn: async (status: "draft" | "pending") => {
      if (!session?.user?.id) throw new Error("Não autenticado");

      const challengeData = {
        title: formData.title,
        description: formData.description,
        proposer: formData.proposer,
        modality: formData.modality,
        axis: formData.axis,
        relationship_type: formData.relationship_type,
        expected_results: formData.expected_results || null,
        benefits: formData.benefits || null,
        contact_email: formData.contact_email || null,
        contact_phone: formData.contact_phone || null,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        banner_url: bannerUrl || null,
        attachments: attachments.length > 0 ? attachments : null,
        status,
        created_by: session.user.id,
      };

      if (id) {
        const { error } = await supabase
          .from("challenges")
          .update(challengeData)
          .eq("id", id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("challenges")
          .insert(challengeData)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: (data, status) => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
      queryClient.invalidateQueries({ queryKey: ["my-challenges"] });
      
      if (status === "pending") {
        localStorage.removeItem(`challenge-draft-${id || "new"}`);
        toast({
          title: "Desafio enviado com sucesso!",
          description: "Seu desafio está aguardando aprovação da equipe.",
        });
        navigate("/meus-desafios");
      } else {
        toast({
          title: "Rascunho salvo!",
          description: "Você pode continuar editando depois.",
        });
        if (data && !id) {
          navigate(`/criar-desafio/${data.id}`);
        }
      }
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSaveDraft = () => {
    if (!formData.title) {
      toast({
        title: "Título obrigatório",
        description: "Por favor, preencha o título do desafio.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    saveMutation.mutate("draft", {
      onSettled: () => setIsSubmitting(false),
    });
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.description || !formData.proposer || !formData.modality) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    setShowSubmitDialog(true);
  };

  const confirmSubmit = () => {
    setIsSubmitting(true);
    saveMutation.mutate("pending", {
      onSettled: () => {
        setIsSubmitting(false);
        setShowSubmitDialog(false);
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Button variant="ghost" className="mb-8 rounded-full" onClick={() => navigate("/meus-desafios")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar aos meus desafios
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">
                {id ? "Editar Desafio" : "Criar Novo Desafio"}
              </CardTitle>
              <p className="text-muted-foreground">
                Preencha os campos abaixo. Você pode salvar como rascunho e continuar depois.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título do Desafio *</Label>
                <Input
                  id="title"
                  placeholder="Digite o título do desafio"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva o desafio detalhadamente"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={6}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="proposer">Proponente *</Label>
                  <Input
                    id="proposer"
                    placeholder="Nome do proponente"
                    value={formData.proposer}
                    onChange={(e) => setFormData({ ...formData, proposer: e.target.value })}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="modality">Modalidade *</Label>
                  <Input
                    id="modality"
                    placeholder="Ex: Hackathon, Chamada Pública, etc."
                    value={formData.modality}
                    onChange={(e) => setFormData({ ...formData, modality: e.target.value })}
                    className="h-12"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="axis">Eixo de Inovação *</Label>
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

                <div className="space-y-2">
                  <Label htmlFor="relationship_type">Tipo de Relacionamento *</Label>
                  <Select value={formData.relationship_type} onValueChange={(value) => setFormData({ ...formData, relationship_type: value as RelationshipType })}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="G2G">G2G (Governo para Governo)</SelectItem>
                      <SelectItem value="G2C">G2C (Governo para Cidadão)</SelectItem>
                      <SelectItem value="G2A">G2A (Governo para Agências)</SelectItem>
                      <SelectItem value="B2G">B2G (Empresa para Governo)</SelectItem>
                      <SelectItem value="B2C">B2C (Empresa para Cidadão)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expected_results">Resultados Esperados</Label>
                <Textarea
                  id="expected_results"
                  placeholder="Quais resultados você espera?"
                  value={formData.expected_results}
                  onChange={(e) => setFormData({ ...formData, expected_results: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="benefits">Benefícios</Label>
                <Textarea
                  id="benefits"
                  placeholder="Quais benefícios este desafio pode trazer?"
                  value={formData.benefits}
                  onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_email">E-mail de Contato</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    placeholder="email@exemplo.com"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Telefone de Contato</Label>
                  <Input
                    id="contact_phone"
                    placeholder="(00) 00000-0000"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                    className="h-12"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Data de Início</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_date">Data de Encerramento</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="banner">Banner do Desafio</Label>
                <div className="space-y-2">
                  <Input
                    id="banner"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setBannerFile(file);
                        handleBannerUpload(file);
                      }
                    }}
                    className="h-12"
                  />
                  {bannerUrl && (
                    <div className="relative">
                      <img src={bannerUrl} alt="Banner" className="w-full h-48 object-cover rounded-lg" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 rounded-full"
                        onClick={() => setBannerUrl("")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="attachments">Anexos</Label>
                <div className="space-y-2">
                  <Input
                    id="attachments"
                    type="file"
                    multiple
                    onChange={(e) => handleAttachmentUpload(e.target.files)}
                    className="h-12"
                  />
                  {attachments.length > 0 && (
                    <div className="space-y-2">
                      {attachments.map((url, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                          <span className="text-sm truncate flex-1">Anexo {index + 1}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-12 rounded-full"
                  onClick={handleSaveDraft}
                  disabled={isSubmitting}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Rascunho
                </Button>
                <Button
                  type="button"
                  className="flex-1 h-12 rounded-full"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Enviar Desafio
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar envio do desafio?</AlertDialogTitle>
            <AlertDialogDescription>
              Após enviar, você não poderá mais editar este desafio. Ele será enviado para análise da equipe.
              Tem certeza que deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Cancelar</AlertDialogCancel>
            <AlertDialogAction className="rounded-full" onClick={confirmSubmit}>
              Sim, enviar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
}
