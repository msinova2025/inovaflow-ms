import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import DOMPurify from "dompurify";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Sobre() {
  const { data: programInfo, isLoading } = useQuery({
    queryKey: ["program-info"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("program_info")
        .select("*")
        .order("order_index", { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  // Group by section
  const groupedInfo = programInfo?.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, typeof programInfo>);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-16 md:py-20">
          <div className="mx-auto px-4 md:px-16 lg:px-24 max-w-[1400px]">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Sobre o Programa</h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-3xl">
              Conheça mais sobre o MS INOVA MAIS e como ele transforma a inovação no Mato Grosso do Sul
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 md:py-16 lg:py-20">
          <div className="mx-auto px-4 md:px-16 lg:px-24 max-w-[1400px]">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : groupedInfo && Object.keys(groupedInfo).length > 0 ? (
              <div className="space-y-12">
                {Object.entries(groupedInfo).map(([section, items]) => (
                  <div key={section} className="space-y-6">
                    <h2 className="text-3xl font-bold text-foreground border-b-2 border-primary pb-3">
                      {section}
                    </h2>
                    <div className="grid gap-6">
                      {items.map((item) => (
                        <Card key={item.id} className="border-l-4 border-l-primary">
                          <CardContent className="p-6">
                            <h3 className="text-xl font-semibold text-foreground mb-4">
                              {item.title}
                            </h3>
                            <div
                              className="prose prose-lg max-w-none text-foreground/80"
                              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.content) }}
                            />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-lg text-muted-foreground">
                  Informações sobre o programa em breve.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
