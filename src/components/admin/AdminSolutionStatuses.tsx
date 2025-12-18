import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { solutionStatusesApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface SolutionStatus {
  id: string;
  name: string;
  message: string;
  created_at: string;
  updated_at: string;
}

interface StatusFormData {
  name: string;
  message: string;
}

export default function AdminSolutionStatuses() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState<SolutionStatus | null>(null);
  const [formData, setFormData] = useState<StatusFormData>({
    name: "",
    message: "",
  });

  const { data: statuses, isLoading } = useQuery({
    queryKey: ["solution-statuses"],
    queryFn: () => solutionStatusesApi.getAll(),
  });

  const checkStatusUsage = async (statusId: string) => {
    // Mocking usage check
    return false;
  };

  const createMutation = useMutation({
    mutationFn: (data: StatusFormData) => solutionStatusesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["solution-statuses"] });
      toast({
        title: "Status criado",
        description: "O status foi criado com sucesso.",
      });
      setIsDialogOpen(false);
      setFormData({ name: "", message: "" });
    },
    onError: (error) => {
      console.error("Error creating status:", error);
      toast({
        title: "Erro ao criar status",
        description: "Ocorreu um erro ao criar o status.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: StatusFormData }) => solutionStatusesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["solution-statuses"] });
      toast({
        title: "Status atualizado",
        description: "O status foi atualizado com sucesso.",
      });
      setIsDialogOpen(false);
      setEditingStatus(null);
      setFormData({ name: "", message: "" });
    },
    onError: (error) => {
      console.error("Error updating status:", error);
      toast({
        title: "Erro ao atualizar status",
        description: "Ocorreu um erro ao atualizar o status.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => solutionStatusesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["solution-statuses"] });
      toast({
        title: "Status excluído",
        description: "O status foi excluído com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error("Error deleting status:", error);
      toast({
        title: "Erro ao excluir status",
        description: error.message || "Ocorreu um erro ao excluir o status.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.message) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    if (editingStatus) {
      updateMutation.mutate({ id: editingStatus.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (status: SolutionStatus) => {
    setEditingStatus(status);
    setFormData({
      name: status.name,
      message: status.message,
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingStatus(null);
    setFormData({ name: "", message: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Status de Soluções</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full">
              <Plus className="mr-2 h-4 w-4" />
              Novo Status
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingStatus ? "Editar Status" : "Criar Novo Status"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Status *</Label>
                <Input
                  id="name"
                  placeholder="Ex: Em Análise"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Mensagem WhatsApp *</Label>
                <Textarea
                  id="message"
                  placeholder="Mensagem que será enviada ao solucionador quando este status for atribuído"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={handleCloseDialog} className="rounded-full">
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="rounded-full"
                >
                  {(createMutation.isPending || updateMutation.isPending)
                    ? "Salvando..."
                    : editingStatus
                      ? "Atualizar"
                      : "Criar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Carregando...</div>
      ) : statuses && statuses.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {statuses.map((status) => (
            <Card key={status.id}>
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <span>{status.name}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(status)}
                      className="h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir este status? Esta ação não pode ser desfeita.
                            {" "}Se o status estiver em uso, não poderá ser excluído.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-full">Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteMutation.mutate(status.id)}
                            className="rounded-full bg-destructive hover:bg-destructive/90"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {status.message}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Nenhum status cadastrado ainda.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
