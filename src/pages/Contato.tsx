import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Globe } from "lucide-react";

export default function Contato() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-r from-primary to-secondary text-primary-foreground py-16">
          <div className="container">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Contato</h1>
              <p className="text-lg text-primary-foreground/90">
                Entre em contato com a Secretaria de Estado de Meio Ambiente, Desenvolvimento,
                Ciência, Tecnologia e Inovação (SEMADESC)
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Informações de Contato</CardTitle>
                  <CardDescription>
                    Entre em contato conosco para esclarecer dúvidas ou obter mais informações sobre
                    o programa MS INOVA MAIS
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <p className="font-semibold mb-1">Endereço</p>
                          <p className="text-sm text-muted-foreground">
                            Parque dos Poderes - Bloco III
                            <br />
                            Campo Grande - MS
                            <br />
                            CEP: 79031-902
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Phone className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <p className="font-semibold mb-1">Telefone</p>
                          <p className="text-sm text-muted-foreground">(67) 3318-7200</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Mail className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <p className="font-semibold mb-1">E-mail</p>
                          <p className="text-sm text-muted-foreground">
                            inovacao@semadesc.ms.gov.br
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Globe className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <p className="font-semibold mb-1">Website</p>
                          <a
                            href="https://www.semadesc.ms.gov.br"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            www.semadesc.ms.gov.br
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-4">Horário de Atendimento</h3>
                    <p className="text-sm text-muted-foreground">
                      Segunda a Sexta-feira: 8h às 12h e 13h30 às 17h30
                    </p>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-2">Sobre a SEMADESC</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      A Secretaria de Estado de Meio Ambiente, Desenvolvimento, Ciência, Tecnologia e
                      Inovação é responsável por coordenar e implementar políticas públicas de
                      inovação e desenvolvimento tecnológico no Estado de Mato Grosso do Sul,
                      promovendo o crescimento sustentável e a competitividade do estado.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
