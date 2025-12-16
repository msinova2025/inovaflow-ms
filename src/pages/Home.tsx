import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroAnimation } from "@/components/HeroAnimation";
import heroImage from "@/assets/hero1.png";
import bandeiraMS from "@/assets/bandeira-ms.png";
import teamCollaboration from "@/assets/team-collaboration.png";
import semadescLogo from "@/assets/semadesc.png";
import governoMSLogo from "@/assets/governo-ms.png";
import sebraeLogo from "@/assets/sebrae.png";
import iaupeLogo from "@/assets/iaupe.png";
import qrCodeRedeNit from "@/assets/qr-code-rede-nit.png";
import { Target, Lightbulb, Users, TrendingUp, Calendar, FileText, CheckCircle, ArrowRight, ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
export default function Home() {
  const {
    data: stats
  } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const [challenges, solutions, events, profiles] = await Promise.all([supabase.from("challenges").select("*", {
        count: "exact",
        head: true
      }), supabase.from("solutions").select("*", {
        count: "exact",
        head: true
      }), supabase.from("events").select("*", {
        count: "exact",
        head: true
      }), supabase.from("profiles").select("*", {
        count: "exact",
        head: true
      })]);
      return {
        challenges: challenges.count || 0,
        solutions: solutions.count || 0,
        events: events.count || 0,
        members: profiles.count || 0,
        initiatives: (challenges.count || 0) + (solutions.count || 0)
      };
    }
  });
  const {
    data: news
  } = useQuery({
    queryKey: ["latest-news"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("news").select("*").order("published_at", {
        ascending: false
      }).limit(3);
      return data || [];
    }
  });
  const {
    data: events
  } = useQuery({
    queryKey: ["upcoming-events"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("events").select("*").gte("start_date", new Date().toISOString()).order("start_date", {
        ascending: true
      }).limit(3);
      return data || [];
    }
  });

  const {
    data: challenges
  } = useQuery({
    queryKey: ["approved-challenges"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("challenges").select("*, profiles(full_name)").eq("status", "approved").order("created_at", {
        ascending: false
      }).limit(5);
      return data || [];
    }
  });
  return <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground overflow-hidden">
        <HeroAnimation />
        {/* Bandeira MS - apenas mobile */}
        <div 
          className="md:hidden absolute top-0 right-0 h-full w-2/3 bg-no-repeat bg-contain bg-right-top opacity-50 pointer-events-none"
          style={{ 
            backgroundImage: `url(${bandeiraMS})`,
            zIndex: 1
          }}
        />
        <div className="relative mx-auto py-12 md:py-16 max-w-[1400px] lg:py-0" style={{ zIndex: 2 }}>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-0 items-center">
            <div className="order-1 space-y-6 text-left py-0 px-4 md:px-16 lg:px-24">
              <h2 className="text-3xl md:text-4xl text-slate-50 font-extrabold">MS INOVA MAIS</h2>
              <h1 className="font-heading sm:text-4xl md:text-5xl leading-tight text-2xl font-semibold">
                Plataforma de Conexão em Inovação e Competitividade
              </h1>
              <p className="text-base sm:text-lg md:text-xl leading-relaxed text-primary-foreground/90">
                Ponto de encontro para compartilhar ideias, conhecimentos e recursos, visando estimular a criação de
                soluções inovadoras e aumentar a competitividade das empresas
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2">
                <Button size="lg" className="h-11 md:h-12 bg-[#ffd500] hover:bg-[#e6c000] text-black font-semibold text-base rounded-full" asChild>
                  <Link to="/sobre">
                    <ArrowDown className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                    Conheça o programa
                  </Link>
                </Button>
              </div>
            </div>
            <div className="order-2 flex justify-end -mr-4 md:-mr-16 lg:-mr-24">
              <img src={heroImage} alt="Inovação no MS" className="hidden md:block w-full h-auto object-contain object-right" style={{
              minHeight: "600px",
              maxHeight: "800px"
            }} />
            </div>
          </div>
        </div>
      </section>

      {/* MS INOVA MAIS Section */}
      <section id="sobre" className="bg-muted/30">
        <div className="mx-auto px-4 md:px-16 lg:px-24 py-12 md:py-16 lg:py-20 max-w-[1400px]">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6">
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">MS INOVA MAIS</h2>
              <p className="text-sm sm:text-base md:text-lg text-foreground/80 leading-relaxed">
                MS INOVA MAIS é um programa do Governo do Estado de Mato Grosso do Sul que visa capacitar servidores
                públicos para promover a inovação na gestão estadual
              </p>

              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-foreground">Acesso a Recursos:</span>
                    <span className="text-foreground/80">
                      {" "}
                      Obtenha financiamento e materiais necessários para desenvolver seu projeto.
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-foreground">Mentorias Especializadas:</span>
                    <span className="text-foreground/80">
                      {" "}
                      Receba orientação de especialistas para aprimorar suas ideias.
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-foreground">Rede de Contatos:</span>
                    <span className="text-foreground/80">
                      {" "}
                      Conecte-se com outros inovadores e potenciais parceiros de negócios.
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-foreground">Visibilidade:</span>
                    <span className="text-foreground/80">
                      {" "}
                      Ganhe exposição e reconhecimento no mercado e na comunidade.
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button size="lg" className="h-11 md:h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base rounded-full" asChild>
                  <Link to="/auth?mode=register">Inscrever-se</Link>
                </Button>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <img src={teamCollaboration} alt="Equipe colaborando" className="w-full max-w-md lg:max-w-full h-auto object-cover rounded-2xl shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* CONHEÇA A REDE NIT Section */}
      <section className="bg-background">
        <div className="mx-auto px-4 md:px-16 lg:px-24 py-12 md:py-16 lg:py-20 max-w-[1400px]">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6">
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-primary">CONHEÇA A REDE NIT</h2>
              <div className="text-sm sm:text-base md:text-lg text-foreground/80 leading-relaxed space-y-4">
                <p>
                  As políticas públicas de ciência, tecnologia e inovação promovem a integração entre universidades, governo, setor privado, sociedade civil e startups.
                </p>
                <p>
                  O objetivo é transformar o conhecimento em soluções práticas para desafios reais.
                </p>
                <p>
                  O governo atua como conector e indutor do ecossistema de inovação.
                </p>
                <p>
                  Programas e redes fortalecem a colaboração entre academia e mercado.
                </p>
                <p>
                  Assim, ciência e inovação se unem para gerar impacto social e desenvolvimento sustentável.
                </p>
              </div>
              <div className="pt-2">
                <a 
                  href="https://d5476f22fe30a6aafd66d97d650e6432.cdn.bubble.io/f1761065767934x704823221281738900/RedeNITMS.pdf?_gl=1*u46l0b*_gcl_au*MTA2MDg5Mzc1NC4xNzYwMDExNzMz*_ga*MTQyMTc5Mjk5OC4xNzU0NTI4NTMw*_ga_BFPVR2DEE2*czE3NjEwNDQzMzgkbzMwJGcxJHQxNzYxMDY1NzUyJGo0OSRsMCRoMA.." 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center h-11 md:h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base rounded-full transition-colors"
                >
                  Baixar PDF da Rede NIT
                </a>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <img 
                src={qrCodeRedeNit} 
                alt="QR Code - Rede NIT" 
                className="w-full max-w-md lg:max-w-full h-auto max-h-[400px] object-contain rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="como-funciona" className="bg-muted/30">
        <div className="mx-auto px-4 md:px-16 lg:px-24 py-12 md:py-16 lg:py-20 max-w-[1400px]">
          <div className="text-center mb-8 md:mb-12 space-y-2 md:space-y-4">
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-primary">Como funciona?</h2>
            <p className="text-sm sm:text-base md:text-lg text-foreground/80">
              Conectando desafios com soluções em 4 passos simples
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            <Link to="/como-participar">
              <Card className="p-4 md:p-6 text-center space-y-3 md:space-y-4 hover:shadow-lg transition-shadow border-2 hover:border-primary cursor-pointer h-full">
                <div className="mx-auto w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Target className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </div>
                <h3 className="text-base md:text-lg lg:text-xl font-semibold">1. Cadastre um desafio</h3>
                <p className="text-xs sm:text-sm md:text-base text-foreground/80">
                  Desafiadores publicam problemas reais que precisam de soluções inovadoras
                </p>
              </Card>
            </Link>

            <Link to="/desafios">
              <Card className="p-4 md:p-6 text-center space-y-3 md:space-y-4 hover:shadow-lg transition-shadow border-2 hover:border-primary cursor-pointer h-full">
                <div className="mx-auto w-12 h-12 md:w-16 md:h-16 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Lightbulb className="h-6 w-6 md:h-8 md:w-8 text-secondary" />
                </div>
                <h3 className="text-base md:text-lg lg:text-xl font-semibold">2. Envie sua solução</h3>
                <p className="text-xs sm:text-sm md:text-base text-foreground/80">
                  Solucionadores analisam desafios e propõem ideias criativas e viáveis
                </p>
              </Card>
            </Link>

            <Link to="/sobre">
              <Card className="p-4 md:p-6 text-center space-y-3 md:space-y-4 hover:shadow-lg transition-shadow border-2 hover:border-primary cursor-pointer h-full">
                <div className="mx-auto w-12 h-12 md:w-16 md:h-16 bg-accent/10 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 md:h-8 md:w-8 text-accent-foreground" />
                </div>
                <h3 className="text-base md:text-lg lg:text-xl font-semibold">3. Avaliação técnica</h3>
                <p className="text-xs sm:text-sm md:text-base text-foreground/80">
                  Nossa equipe e desafiadores avaliam as propostas recebidas
                </p>
              </Card>
            </Link>

            <Link to="/sobre">
              <Card className="p-4 md:p-6 text-center space-y-3 md:space-y-4 hover:shadow-lg transition-shadow border-2 hover:border-primary cursor-pointer h-full">
                <div className="mx-auto w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </div>
                <h3 className="text-base md:text-lg lg:text-xl font-semibold">4. Implementação</h3>
                <p className="text-xs sm:text-sm md:text-base text-foreground/80">
                  Soluções aprovadas são implementadas com apoio do ecossistema
                </p>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Challenges Carousel */}
      {challenges && challenges.length > 0 && <section className="bg-background">
          <div className="mx-auto px-4 md:px-16 lg:px-24 py-12 md:py-16 lg:py-20 max-w-[1400px]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 md:mb-12 gap-4">
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
                Desafios Abertos
              </h2>
              <Button variant="outline" className="h-10" asChild>
                <Link to="/desafios">
                  Ver todos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <Carousel className="w-full max-w-5xl mx-auto">
              <CarouselContent>
                {challenges.map((challenge) => (
                  <CarouselItem key={challenge.id}>
                    <Card className="overflow-hidden">
                      {challenge.banner_url && (
                        <img 
                          src={challenge.banner_url} 
                          alt={challenge.title} 
                          className="w-full h-64 md:h-80 object-cover" 
                        />
                      )}
                      <div className="p-6 md:p-8 space-y-4">
                        <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                          {challenge.title}
                        </h3>
                        <p className="text-base md:text-lg text-foreground/80 line-clamp-3">
                          {challenge.description}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>Por {challenge.profiles?.full_name || challenge.proposer}</span>
                        </div>
                        <Button className="w-full h-11 rounded-full" asChild>
                          <Link to={`/desafios/${challenge.id}`}>
                            Ver detalhes
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0 md:-left-12" />
              <CarouselNext className="right-0 md:-right-12" />
            </Carousel>
          </div>
        </section>}

      {/* Stats Section */}
      <section className="bg-[#004f9f]">
        <div className="mx-auto px-4 md:px-16 lg:px-24 py-12 md:py-16 lg:py-20 max-w-[1400px]">
          <div className="text-center mb-8 md:mb-12 space-y-2 md:space-y-4">
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              Indicadores do programa
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-white/90">
              Acompanhe o impacto da inovação no Mato Grosso do Sul
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all rounded-full">
              <CardContent className="text-center p-6 md:p-8">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">{stats?.members || 0}</div>
                <div className="text-xs sm:text-sm md:text-base text-white/90 mt-2">Integrantes</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all rounded-full">
              <CardContent className="text-center p-6 md:p-8">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">{stats?.initiatives || 0}</div>
                <div className="text-xs sm:text-sm md:text-base text-white/90 mt-2">Iniciativas</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all rounded-full">
              <CardContent className="text-center p-6 md:p-8">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">{stats?.challenges || 0}</div>
                <div className="text-xs sm:text-sm md:text-base text-white/90 mt-2">Desafios</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all rounded-full">
              <CardContent className="text-center p-6 md:p-8">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">{stats?.events || 0}</div>
                <div className="text-xs sm:text-sm md:text-base text-white/90 mt-2">Eventos</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Latest News */}
      {news && news.length > 0 && <section className="bg-muted/30">
          <div className="mx-auto px-4 md:px-16 lg:px-24 py-12 md:py-16 lg:py-20 max-w-[1400px]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 md:mb-12 gap-4">
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
                Notícias relacionadas
              </h2>
              <Button variant="outline" className="h-10" asChild>
                <Link to="/noticias">
                  Ver todas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {news.map(item => <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {item.image_url && <img src={item.image_url} alt={item.title} className="w-full h-40 sm:h-48 object-cover" />}
                  <div className="p-4 md:p-6 space-y-3 md:space-y-4">
                    <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                      <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                      {new Date(item.published_at).toLocaleDateString("pt-BR")}
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold line-clamp-2">{item.title}</h3>
                    <p className="text-xs sm:text-sm md:text-base text-foreground/80 line-clamp-3">{item.summary}</p>
                    <Button variant="link" className="p-0 h-auto text-sm" asChild>
                      <Link to={`/noticias/${item.id}`}>
                        Continue lendo
                        <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                      </Link>
                    </Button>
                  </div>
                </Card>)}
            </div>
          </div>
        </section>}

      {/* Upcoming Events */}
      {events && events.length > 0 && <section className="bg-background">
          <div className="mx-auto px-4 md:px-16 lg:px-24 py-12 md:py-16 lg:py-20 max-w-[1400px]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 md:mb-12 gap-4">
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
                Eventos do programa
              </h2>
              <Button variant="outline" className="h-10" asChild>
                <Link to="/eventos">
                  Ver todos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {events.map(event => <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {event.image_url && <img src={event.image_url} alt={event.title} className="w-full h-40 sm:h-48 object-cover" />}
                  <div className="p-4 md:p-6 space-y-3 md:space-y-4">
                    <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                      {new Date(event.start_date).toLocaleDateString("pt-BR")}
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold line-clamp-2">{event.title}</h3>
                    <p className="text-xs sm:text-sm md:text-base text-foreground/80 line-clamp-3">
                      {event.description}
                    </p>
                    <Button variant="outline" className="w-full h-9 md:h-10 text-sm rounded-full" asChild>
                      <Link to={`/eventos/${event.id}`}>
                        Saiba mais
                      </Link>
                    </Button>
                  </div>
                </Card>)}
            </div>
          </div>
        </section>}

      {/* CTA Section */}
      <section className="bg-[#004f9f] text-primary-foreground">
        <div className="mx-auto px-4 md:px-16 lg:px-24 py-12 md:py-16 lg:py-20 text-center space-y-4 md:space-y-6 max-w-[1400px]">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold">
            Faça parte do ecossistema de inovação do MS
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
            Seja você um desafiador ou solucionador, junte-se a nós e contribua para transformar Mato Grosso do Sul em
            referência de inovação
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center pt-2">
            <Button size="lg" className="h-11 md:h-12 text-base rounded-full bg-[#007f31] hover:bg-[#006625] text-white font-semibold shadow-lg" asChild>
              <Link to="/auth?mode=register&type=challenger">
                <Target className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                Sou Desafiador
              </Link>
            </Button>
            <Button size="lg" className="h-11 md:h-12 text-base rounded-full bg-[#ffd500] hover:bg-[#e6c000] text-black font-semibold shadow-lg" asChild>
              <Link to="/auth?mode=register&type=solver">
                <Lightbulb className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                Sou Solucionador
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Instituições Apoiadoras Section */}
      <section className="bg-white">
        <div className="mx-auto px-4 md:px-16 lg:px-24 py-12 md:py-16 lg:py-20 max-w-[1400px]">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
              Instituições Apoiadoras
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            <img src={semadescLogo} alt="SEMADESC - Secretaria de Estado de Meio Ambiente, Desenvolvimento, Ciência, Tecnologia e Inovação" className="w-full max-w-[200px] h-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
            <img src={governoMSLogo} alt="Governo de Mato Grosso do Sul" className="w-full max-w-[200px] h-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
            <img src={sebraeLogo} alt="SEBRAE" className="w-full max-w-[200px] h-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
            <img src={iaupeLogo} alt="IAUPE - Instituto de Apoio a Universidade de Pernambuco" className="w-full max-w-[200px] h-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
          </div>
        </div>
      </section>

      <Footer />
    </div>;
}