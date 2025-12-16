import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import DOMPurify from "dompurify";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, ArrowLeft } from "lucide-react";

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: news, isLoading } = useQuery({
    queryKey: ["news", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
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

  if (!news) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Notícia não encontrada</h1>
            <Button asChild>
              <Link to="/noticias">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para notícias
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
            <Link to="/noticias">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para notícias
            </Link>
          </Button>

          {news.image_url && (
            <img
              src={news.image_url}
              alt={news.title}
              className="w-full h-[400px] object-cover rounded-lg mb-8"
            />
          )}

          <div className="flex items-center text-muted-foreground mb-4">
            <Calendar className="h-4 w-4 mr-2" />
            <time dateTime={news.published_at}>
              {new Date(news.published_at).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </time>
          </div>

          <h1 className="text-4xl font-bold mb-6">{news.title}</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-muted-foreground mb-8">{news.summary}</p>
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(news.content) }} />
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}