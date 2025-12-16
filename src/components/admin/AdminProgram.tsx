import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DOMPurify from "dompurify";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface ProgramFormData {
  title: string;
  content: string;
  section: string;
  order_index: number;
}

export default function AdminProgram() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProgramFormData>({
    title: "",
    content: "",
    section: "",
    order_index: 0,
  });

  // Quill editor modules configuration
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  // Fetch program info
  const { data: programInfo, isLoading } = useQuery({
    queryKey: ["admin-program-info"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("program_info")
        .select("*")
        .order("order_index", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  // Create program info mutation
  const createMutation = useMutation({
    mutationFn: async (data: ProgramFormData) => {
      const { error } = await supabase.from("program_info").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-program-info"] });
      toast({ title: "Informação criada com sucesso!" });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erro ao criar informação",
        description: error.message,
      });
    },
  });

  // Update program info mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ProgramFormData }) => {
      const { error } = await supabase.from("program_info").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-program-info"] });
      toast({ title: "Informação atualizada com sucesso!" });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar informação",
        description: error.message,
      });
    },
  });

  // Delete program info mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("program_info").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-program-info"] });
      toast({ title: "Informação excluída com sucesso!" });
      setDeleteId(null);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erro ao excluir informação",
        description: error.message,
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      section: "",
      order_index: 0,
    });
    setEditingId(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (item: any) => {
    setFormData({
      title: item.title,
      content: item.content,
      section: item.section,
      order_index: item.order_index,
    });
    setEditingId(item.id);
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Sobre o Programa</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Informação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Editar Informação" : "Nova Informação"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  placeholder="Título da seção"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="section">Seção *</Label>
                <Input
                  id="section"
                  placeholder="Ex: sobre, objetivos, como-funciona"
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order_index">Ordem de Exibição</Label>
                <Input
                  id="order_index"
                  type="number"
                  placeholder="0"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Conteúdo *</Label>
                <div className="border rounded-md">
                  <ReactQuill
                    theme="snow"
                    value={formData.content}
                    onChange={(value) => setFormData({ ...formData, content: value })}
                    modules={modules}
                    className="bg-background"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={resetForm} className="flex-1 rounded-full">
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 rounded-full"
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {editingId ? "Atualizar" : "Criar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {programInfo?.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Seção: {item.section} | Ordem: {item.order_index}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(item)} className="rounded-full">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setDeleteId(item.id)}
                    className="rounded-full"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div 
                className="prose prose-sm max-w-none dark:prose-invert [&_a]:text-primary [&_a]:underline"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.content) }}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta informação? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
