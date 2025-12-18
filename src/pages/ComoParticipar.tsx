import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import { howToParticipateApi } from "@/lib/api";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ComoParticipar() {
  const { data: steps, isLoading } = useQuery({
    queryKey: ["how-to-participate"],
    queryFn: () => howToParticipateApi.getAll(),
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        <section className="bg-primary text-primary-foreground py-16 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Como Participar</h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              Siga os passos abaixo para submeter seus desafios ou propostas de solução
            </p>
          </div>
        </section>

        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : steps && steps.length > 0 ? (
              <div className="space-y-8">
                {steps.sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0)).map((step: any, index: number) => (
                  <Card key={step.id} className="relative overflow-hidden group hover:shadow-lg transition-shadow">
                    <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-lg">
                        {index + 1}
                      </div>
                      <CardTitle className="text-2xl">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="prose prose-lg text-muted-foreground max-w-none">
                        {step.description}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <CheckCircle2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold">Os passos serão publicados em breve</h3>
                <p className="text-muted-foreground">Fique atento às nossas atualizações!</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
