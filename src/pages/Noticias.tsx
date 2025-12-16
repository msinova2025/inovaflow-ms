import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Noticias() {
  const { data: news, isLoading } = useQuery({
    queryKey: ["all-news"],
    queryFn: async () => {
      const { data } = await supabase
        .from("news")
        .select("*")
        .order("published_at", { ascending: false });
      return data || [];
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-r from-primary to-secondary text-primary-foreground py-16">
          <div className="container">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Notícias</h1>
              <p className="text-lg text-primary-foreground/90">
                Fique por dentro das últimas novidades sobre inovação e tecnologia no Mato Grosso
                do Sul
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Carregando notícias...</p>
              </div>
            ) : news && news.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <CardHeader>
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(item.published_at).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                      <CardTitle className="line-clamp-2">{item.title}</CardTitle>
                      <CardDescription className="line-clamp-3">{item.summary}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="link" className="p-0" asChild>
                        <Link to={`/noticias/${item.id}`}>
                          Continue lendo
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Nenhuma notícia publicada</h3>
                <p className="text-muted-foreground mb-6">
                  Em breve teremos novidades para você. Acompanhe!
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
