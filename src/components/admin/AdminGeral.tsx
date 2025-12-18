import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { geralApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";

interface GeralData {
  id: string;
  contact_phone: string;
  facebook_url: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  youtube_url: string | null;
  ouvidoria_url: string | null;
  transparencia_url: string | null;
  servicos_url: string | null;
}

export default function AdminGeral() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: geral, isLoading } = useQuery({
    queryKey: ["geral"],
    queryFn: () => geralApi.get(),
  });

  const [formData, setFormData] = useState<Partial<GeralData>>({});

  const updateMutation = useMutation({
    mutationFn: (data: Partial<GeralData>) => {
      if (!geral?.id) throw new Error("ID não encontrado");
      return geralApi.update(geral.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["geral"] });
      toast({
        title: "Configurações atualizadas",
        description: "As configurações gerais foram atualizadas com sucesso.",
      });
      setFormData({});
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: error.message,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updates = Object.keys(formData).reduce((acc, key) => {
      const value = formData[key as keyof GeralData];
      if (value !== undefined && value !== "") {
        acc[key as keyof GeralData] = value;
      }
      return acc;
    }, {} as Partial<GeralData>);

    if (Object.keys(updates).length === 0) {
      toast({
        variant: "destructive",
        title: "Nenhuma alteração",
        description: "Faça pelo menos uma alteração antes de salvar.",
      });
      return;
    }

    updateMutation.mutate(updates);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Configurações Gerais</h2>
        <p className="text-muted-foreground">
          Gerencie as informações de contato e links do site
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Contato</CardTitle>
            <CardDescription>Informações de contato do programa</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contact_phone">Telefone de Contato</Label>
              <Input
                id="contact_phone"
                type="tel"
                placeholder={geral?.contact_phone}
                value={formData.contact_phone || ""}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Redes Sociais</CardTitle>
            <CardDescription>Links das redes sociais do programa</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="facebook_url">Facebook</Label>
              <Input
                id="facebook_url"
                type="url"
                placeholder={geral?.facebook_url || "https://facebook.com"}
                value={formData.facebook_url || ""}
                onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram_url">Instagram</Label>
              <Input
                id="instagram_url"
                type="url"
                placeholder={geral?.instagram_url || "https://instagram.com"}
                value={formData.instagram_url || ""}
                onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin_url">LinkedIn</Label>
              <Input
                id="linkedin_url"
                type="url"
                placeholder={geral?.linkedin_url || "https://linkedin.com"}
                value={formData.linkedin_url || ""}
                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="youtube_url">YouTube</Label>
              <Input
                id="youtube_url"
                type="url"
                placeholder={geral?.youtube_url || "https://youtube.com"}
                value={formData.youtube_url || ""}
                onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Links do Header</CardTitle>
            <CardDescription>Links externos exibidos no header</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ouvidoria_url">Ouvidoria</Label>
              <Input
                id="ouvidoria_url"
                type="url"
                placeholder={geral?.ouvidoria_url || "https://www.ms.gov.br/ouvidoria"}
                value={formData.ouvidoria_url || ""}
                onChange={(e) => setFormData({ ...formData, ouvidoria_url: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transparencia_url">Transparência</Label>
              <Input
                id="transparencia_url"
                type="url"
                placeholder={geral?.transparencia_url || "https://www.ms.gov.br/transparencia"}
                value={formData.transparencia_url || ""}
                onChange={(e) => setFormData({ ...formData, transparencia_url: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="servicos_url">Serviços</Label>
              <Input
                id="servicos_url"
                type="url"
                placeholder={geral?.servicos_url || "https://www.ms.gov.br/servicos"}
                value={formData.servicos_url || ""}
                onChange={(e) => setFormData({ ...formData, servicos_url: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="w-full rounded-full"
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar Alterações
            </>
          )}
        </Button>
      </form>
    </div>
  );
}