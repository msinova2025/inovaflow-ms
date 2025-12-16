import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";

export default function Eventos() {
  const { data: events, isLoading } = useQuery({
    queryKey: ["all-events"],
    queryFn: async () => {
      const { data } = await supabase
        .from("events")
        .select("*")
        .order("start_date", { ascending: true });
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
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Eventos do Programa</h1>
              <p className="text-lg text-primary-foreground/90">
                Participe de workshops, palestras e encontros do ecossistema de inovação do Mato
                Grosso do Sul
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Carregando eventos...</p>
              </div>
            ) : events && events.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <Card key={event.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                    {event.image_url && (
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                      <CardDescription className="line-clamp-3">{event.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(event.start_date).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      <Button className="w-full rounded-full" variant="outline" asChild>
                        <Link to={`/eventos/${event.id}`}>
                          Saiba mais
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Nenhum evento programado</h3>
                <p className="text-muted-foreground mb-6">
                  Novos eventos serão anunciados em breve. Acompanhe nossas redes sociais!
                </p>
                <Button asChild>
                  <a href="/">Voltar para home</a>
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
