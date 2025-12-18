import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { newsApi } from "@/lib/api";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, User } from "lucide-react";
import DOMPurify from "dompurify";

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: news, isLoading } = useQuery({
    queryKey: ["news-detail", id],
    queryFn: () => newsApi.getById(id!),
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

  if (!news) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Notícia não encontrada</h1>
          <Button onClick={() => navigate("/noticias")}>Voltar para notícias</Button>
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
            onClick={() => navigate("/noticias")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para notícias
          </Button>

          {news.image_url && (
            <div className="mb-8 rounded-2xl overflow-hidden shadow-lg aspect-video">
              <img
                src={news.image_url}
                alt={news.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              {news.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground border-y py-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>
                  {new Date(news.published_at).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              {news.author && (
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span>{news.author}</span>
                </div>
              )}
            </div>
          </header>

          <div
            className="prose prose-lg max-w-none text-foreground/80"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(news.content) }}
          />
        </article>
      </main>

      <Footer />
    </div>
  );
}