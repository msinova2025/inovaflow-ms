import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { eventsApi } from "@/lib/api";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Clock } from "lucide-react";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: event, isLoading } = useQuery({
    queryKey: ["event-detail", id],
    queryFn: () => eventsApi.getById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-10 w-32 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded-xl"></div>
            <div className="space-y-4">
              <div className="h-10 w-3/4 bg-muted rounded"></div>
              <div className="h-4 w-1/4 bg-muted rounded"></div>
              <div className="h-32 w-full bg-muted rounded"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Evento não encontrado</h1>
          <Button onClick={() => navigate("/eventos")}>Voltar para eventos</Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <article className="container py-12 max-w-4xl mx-auto">
          <Button
            variant="ghost"
            className="mb-8 rounded-full"
            onClick={() => navigate("/eventos")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para eventos
          </Button>

          {event.image_url && (
            <div className="mb-8 rounded-2xl overflow-hidden shadow-lg aspect-video">
              <img
                src={event.image_url}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              {event.title}
            </h1>
            <div className="grid sm:grid-cols-2 gap-4 border-y py-6">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Data</p>
                  <p>
                    {new Date(event.start_date).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Clock className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Horário</p>
                  <p>
                    {new Date(event.start_date).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              {event.location && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Local</p>
                    <p>{event.location}</p>
                  </div>
                </div>
              )}
            </div>
          </header>

          <div className="prose prose-lg max-w-none text-foreground/80 space-y-6">
            <p className="text-xl leading-relaxed">
              {event.description}
            </p>
            {event.content && (
              <div dangerouslySetInnerHTML={{ __html: event.content }} />
            )}
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}