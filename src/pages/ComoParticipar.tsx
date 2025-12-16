import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface ParticipateItem {
  id: string;
  section: string;
  title: string;
  content: string;
  order_index: number;
}

export default function ComoParticipar() {
  const [items, setItems] = useState<ParticipateItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const { data, error } = await supabase
        .from("how_to_participate")
        .select("*")
        .order("order_index", { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error("Error loading participate info:", error);
    } finally {
      setLoading(false);
    }
  };

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, ParticipateItem[]>);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
              Como Participar
            </h1>
            <p className="text-xl text-muted-foreground text-center max-w-3xl mx-auto">
              Saiba como fazer parte do MS Inova Mais e contribuir para a inovação
            </p>
          </div>
        </section>

        {loading ? (
          <div className="container py-20 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <section className="py-16">
            <div className="container max-w-4xl">
              <div className="space-y-12">
                {Object.entries(groupedItems).map(([section, sectionItems]) => (
                  <div key={section} className="space-y-6">
                    <h2 className="text-3xl font-bold text-primary border-b-2 border-primary pb-2">
                      {section}
                    </h2>
                    <div className="space-y-8">
                      {sectionItems.map((item) => (
                        <div key={item.id} className="bg-card rounded-lg p-6 shadow-sm">
                          <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                          <div 
                            className="prose prose-sm max-w-none text-muted-foreground"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.content) }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
