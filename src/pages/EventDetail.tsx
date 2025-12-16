import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, ArrowLeft, ExternalLink } from "lucide-react";

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Evento não encontrado</h1>
            <Button asChild>
              <Link to="/eventos">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para eventos
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <article className="container py-8 max-w-4xl">
          <Button variant="ghost" className="mb-6 rounded-full" asChild>
            <Link to="/eventos">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para eventos
            </Link>
          </Button>

          {event.image_url && (
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full h-[400px] object-cover rounded-lg mb-8"
            />
          )}

          <div className="flex items-center text-muted-foreground mb-4">
            <Calendar className="h-4 w-4 mr-2" />
            <time dateTime={event.start_date}>
              {new Date(event.start_date).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </time>
            {event.end_date && (
              <>
                <span className="mx-2">até</span>
                <time dateTime={event.end_date}>
                  {new Date(event.end_date).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </>
            )}
          </div>

          <h1 className="text-4xl font-bold mb-6">{event.title}</h1>

          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-xl">{event.description}</p>
          </div>

          {event.link && (
            <Button className="rounded-full" size="lg" asChild>
              <a href={event.link} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Acessar link do evento
              </a>
            </Button>
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
}