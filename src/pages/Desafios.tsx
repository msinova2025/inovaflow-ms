import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { challengesApi } from "@/lib/api";
import { Target, Calendar, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Desafios() {
  const { data: challenges, isLoading } = useQuery({
    queryKey: ["public-challenges"],
    queryFn: () => challengesApi.getAll(),
  });

  const axisLabels = {
    desenvolvimento_tecnologico: "Desenvolvimento Tecnológico",
    iot: "Internet das Coisas",
    inovacao_governo: "Inovação para o Governo",
    sustentabilidade: "Sustentabilidade",
    ia_ml: "Inteligência Artificial",
    saude_biotecnologia: "Saúde e Biotecnologia",
    educacao: "Educação",
    mobilidade: "Mobilidade",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-r from-primary to-secondary text-primary-foreground py-16">
          <div className="container">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Desafios Abertos</h1>
              <p className="text-lg text-primary-foreground/90">
                Explore os desafios publicados por organizações e empresas que buscam soluções
                inovadoras. Escolha um desafio e envie sua proposta!
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Carregando desafios...</p>
              </div>
            ) : challenges && challenges.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {challenges.map((challenge) => (
                  <Card key={challenge.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                    {challenge.banner_url && (
                      <div className="w-full h-48 overflow-hidden">
                        <img
                          src={challenge.banner_url}
                          alt={challenge.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="secondary">{axisLabels[challenge.axis as keyof typeof axisLabels]}</Badge>
                        <Target className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="line-clamp-2">{challenge.title}</CardTitle>
                      <CardDescription className="line-clamp-3">{challenge.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Building2 className="h-4 w-4 mr-2" />
                        {challenge.proposer}
                      </div>
                      {challenge.end_date && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          Até {new Date(challenge.end_date).toLocaleDateString("pt-BR")}
                        </div>
                      )}
                      <Button className="w-full" asChild>
                        <Link to={`/desafios/${challenge.id}`}>Ver detalhes</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Target className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Nenhum desafio disponível no momento</h3>
                <p className="text-muted-foreground mb-6">
                  Novos desafios serão publicados em breve. Volte mais tarde!
                </p>
                <Button asChild>
                  <Link to="/">Voltar para home</Link>
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
