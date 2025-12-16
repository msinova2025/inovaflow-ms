import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Desafios from "./pages/Desafios";
import ChallengeDetail from "./pages/ChallengeDetail";
import Eventos from "./pages/Eventos";
import EventDetail from "./pages/EventDetail";
import Noticias from "./pages/Noticias";
import NewsDetail from "./pages/NewsDetail";
import Contato from "./pages/Contato";
import Profile from "./pages/Profile";
import Sobre from "./pages/Sobre";
import ComoParticipar from "./pages/ComoParticipar";
import TermosUso from "./pages/TermosUso";
import PoliticaPrivacidade from "./pages/PoliticaPrivacidade";
import NotFound from "./pages/NotFound";
import MyChallenges from "./pages/MyChallenges";
import MySolutions from "./pages/MySolutions";
import ReceivedSolutions from "./pages/ReceivedSolutions";
import CreateChallenge from "./pages/CreateChallenge";
import ScrollToTop from "./components/ScrollToTop";
import CookieBanner from "./components/CookieBanner";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <CookieBanner />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/meus-desafios" element={<MyChallenges />} />
          <Route path="/minhas-solucoes" element={<MySolutions />} />
          <Route path="/solucoes-recebidas" element={<ReceivedSolutions />} />
          <Route path="/criar-desafio" element={<CreateChallenge />} />
          <Route path="/criar-desafio/:id" element={<CreateChallenge />} />
          <Route path="/desafios" element={<Desafios />} />
          <Route path="/desafios/:id" element={<ChallengeDetail />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/eventos/:id" element={<EventDetail />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/noticias/:id" element={<NewsDetail />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/como-participar" element={<ComoParticipar />} />
          <Route path="/termos-uso" element={<TermosUso />} />
          <Route path="/politica-privacidade" element={<PoliticaPrivacidade />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
