import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Plus, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatCPFOrCNPJ, formatPhone } from "@/lib/utils";

type UserType = "admin" | "advanced" | "challenger" | "solver";

interface UserFormData {
  full_name: string;
  cpf_cnpj: string;
  phone: string;
  organization: string;
  user_type: UserType;
}

export function AdminUsers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<UserFormData>({
    full_name: "",
    cpf_cnpj: "",
    phone: "",
    organization: "",
    user_type: "solver",
  });

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => usersApi.getAll(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UserFormData> }) => {
      // Backend will handle the complex role update logic
      const updateData = {
        full_name: data.full_name,
        phone: data.phone,
        organization: data.organization,
        role: data.user_type, // Map user_type to role for backend
      };
      return usersApi.update(id, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast({ title: "Usuário atualizado com sucesso!" });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar usuário",
        description: error.message,
      });
    },
  });

  const resetForm = () => {
    setFormData({
      full_name: "",
      cpf_cnpj: "",
      phone: "",
      organization: "",
      user_type: "solver",
    });
    setEditingId(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (user: any) => {
    setFormData({
      full_name: user.full_name,
      cpf_cnpj: user.cpf_cnpj || "",
      phone: user.phone || "",
      organization: user.organization || "",
      user_type: user.user_type,
    });
    setEditingId(user.id);
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Usuários</h2>
      </div>

      <div className="grid gap-4">
        {users?.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.avatar_url || undefined} alt={user.full_name} />
                    <AvatarFallback className="bg-primary/10">
                      <User className="h-8 w-8 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{user.full_name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {user.organization || "Sem organização"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(user)}
                  className="rounded-full"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">CPF/CNPJ:</span> {user.cpf_cnpj || "N/A"}
                </div>
                <div>
                  <span className="text-muted-foreground">Telefone:</span> {user.phone || "N/A"}
                </div>
              </div>
              <div className="mt-2">
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {user.user_type}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="full_name">Nome Completo</Label>
              <Input
                id="full_name"
                placeholder="Digite o nome completo"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
                className="rounded-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cpf_cnpj">CPF/CNPJ</Label>
                <Input
                  id="cpf_cnpj"
                  placeholder="000.000.000-00"
                  value={formData.cpf_cnpj}
                  onChange={(e) => setFormData({ ...formData, cpf_cnpj: formatCPFOrCNPJ(e.target.value) })}
                  className="rounded-full"
                />
              </div>

              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  placeholder="(00) 00000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                  className="rounded-full"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="organization">Organização</Label>
              <Input
                id="organization"
                placeholder="Nome da organização"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="rounded-full"
              />
            </div>

            <div>
              <Label htmlFor="user_type">Tipo de Usuário</Label>
              <Select value={formData.user_type} onValueChange={(value) => setFormData({ ...formData, user_type: value as UserType })}>
                <SelectTrigger className="rounded-full">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="advanced">Avançado</SelectItem>
                  <SelectItem value="challenger">Desafiador</SelectItem>
                  <SelectItem value="solver">Solucionador</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={resetForm} className="rounded-full">
                Cancelar
              </Button>
              <Button type="submit" disabled={updateMutation.isPending} className="rounded-full">
                Atualizar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
