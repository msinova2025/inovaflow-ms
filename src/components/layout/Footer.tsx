import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Youtube, Phone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { geralApi } from "@/lib/api";

export const Footer = () => {
  const { data: geral } = useQuery({
    queryKey: ["geral"],
    queryFn: () => geralApi.get(),
  });

  return <footer className="border-t border-border bg-muted/50">
    <div className="mx-auto px-4 md:px-16 lg:px-24 max-w-[1400px] py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-0">

            <span className="text-lg font-bold text-primary mx-0">MS INOVA MAIS</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Plataforma de Gestão em Inovação e Competitividade do Estado de Mato Grosso do Sul
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Navegação</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/#sobre" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Sobre o programa
              </Link>
            </li>
            <li>
              <Link to="/desafios" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Desafios
              </Link>
            </li>
            <li>
              <Link to="/eventos" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Eventos
              </Link>
            </li>
            <li>
              <Link to="/noticias" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Notícias
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Para você</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/auth?mode=register&type=challenger" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Sou Desafiador
              </Link>
            </li>
            <li>
              <Link to="/auth?mode=register&type=solver" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Sou Solucionador
              </Link>
            </li>
            <li>
              {geral?.contact_phone && (
                <a
                  href={`https://wa.me/55${geral.contact_phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  Contato
                </a>
              )}
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Redes Sociais</h3>
          <div className="flex space-x-4">
            {geral?.facebook_url && (
              <a href={geral.facebook_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            )}
            {geral?.instagram_url && (
              <a href={geral.instagram_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            )}
            {geral?.linkedin_url && (
              <a href={geral.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            )}
            {geral?.youtube_url && (
              <a href={geral.youtube_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-muted-foreground">
          © 2026 MS INOVA MAIS. Todos os direitos reservados.
        </p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link to="/termos-uso" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Termos de Uso
          </Link>
          <Link to="/politica-privacidade" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Política de Privacidade
          </Link>
        </div>
      </div>
    </div>
  </footer>;
};