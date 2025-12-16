import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function TermosUso() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
              Termos de Uso
            </h1>
            <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container max-w-4xl">
            <div className="prose prose-lg max-w-none space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">1. Aceitação dos Termos</h2>
                <p className="text-muted-foreground">
                  Ao acessar e utilizar a plataforma MS Inova Mais, você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso. Se você não concordar com qualquer parte destes termos, não deverá utilizar nossa plataforma.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">2. Descrição do Serviço</h2>
                <p className="text-muted-foreground">
                  O MS Inova Mais é uma plataforma que conecta desafiadores (empresas e organizações) com solucionadores (profissionais e inovadores) para promover a inovação e o desenvolvimento de soluções criativas para desafios reais.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">3. Cadastro e Conta de Usuário</h2>
                <p className="text-muted-foreground mb-3">
                  Para utilizar determinadas funcionalidades da plataforma, você deve:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Fornecer informações verdadeiras, precisas e completas durante o registro</li>
                  <li>Manter suas informações de conta atualizadas</li>
                  <li>Manter a confidencialidade de sua senha</li>
                  <li>Ser responsável por todas as atividades realizadas em sua conta</li>
                  <li>Notificar imediatamente sobre qualquer uso não autorizado de sua conta</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">4. Tipos de Usuário</h2>
                <p className="text-muted-foreground mb-3">
                  <strong>Desafiadores:</strong> Empresas, organizações e instituições que apresentam desafios e buscam soluções inovadoras.
                </p>
                <p className="text-muted-foreground">
                  <strong>Solucionadores:</strong> Profissionais, inovadores e desenvolvedores que propõem soluções para os desafios apresentados.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">5. Uso Aceitável</h2>
                <p className="text-muted-foreground mb-3">
                  Você concorda em não utilizar a plataforma para:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Violar qualquer lei ou regulamento aplicável</li>
                  <li>Publicar conteúdo falso, enganoso, difamatório ou ofensivo</li>
                  <li>Infringir direitos de propriedade intelectual de terceiros</li>
                  <li>Transmitir vírus, malware ou qualquer código malicioso</li>
                  <li>Interferir ou interromper o funcionamento da plataforma</li>
                  <li>Coletar dados de outros usuários sem consentimento</li>
                  <li>Usar a plataforma para fins comerciais não autorizados</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">6. Propriedade Intelectual</h2>
                <p className="text-muted-foreground mb-3">
                  Todos os direitos sobre o conteúdo da plataforma MS Inova Mais, incluindo textos, gráficos, logos, ícones e software, são de propriedade do Governo do Estado de Mato Grosso do Sul ou de seus licenciadores.
                </p>
                <p className="text-muted-foreground">
                  Os usuários mantêm os direitos sobre o conteúdo que publicam, mas concedem à plataforma uma licença não exclusiva para usar, reproduzir e exibir tal conteúdo conforme necessário para operar o serviço.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">7. Privacidade e Proteção de Dados</h2>
                <p className="text-muted-foreground">
                  O uso de suas informações pessoais é regido por nossa{" "}
                  <a href="/politica-privacidade" className="text-primary hover:underline">
                    Política de Privacidade
                  </a>
                  , que está incorporada a estes Termos de Uso por referência.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">8. Desafios e Soluções</h2>
                <p className="text-muted-foreground mb-3">
                  <strong>Responsabilidade dos Desafiadores:</strong> Os desafiadores são responsáveis pela precisão e legalidade dos desafios publicados.
                </p>
                <p className="text-muted-foreground">
                  <strong>Responsabilidade dos Solucionadores:</strong> Os solucionadores são responsáveis pela originalidade e viabilidade das soluções propostas.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">9. Moderação de Conteúdo</h2>
                <p className="text-muted-foreground">
                  O MS Inova Mais reserva-se o direito de revisar, moderar, editar ou remover qualquer conteúdo que viole estes termos ou que seja considerado inadequado, a nosso exclusivo critério.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">10. Limitação de Responsabilidade</h2>
                <p className="text-muted-foreground">
                  A plataforma MS Inova Mais é fornecida "como está". Não garantimos que o serviço será ininterrupto, seguro ou livre de erros. Em nenhuma circunstância seremos responsáveis por danos indiretos, incidentais, especiais ou consequenciais.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">11. Suspensão e Encerramento</h2>
                <p className="text-muted-foreground">
                  Reservamo-nos o direito de suspender ou encerrar sua conta e acesso à plataforma, a qualquer momento e sem aviso prévio, caso você viole estes termos.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">12. Alterações nos Termos</h2>
                <p className="text-muted-foreground">
                  Podemos modificar estes Termos de Uso a qualquer momento. As alterações entrarão em vigor imediatamente após sua publicação na plataforma. O uso continuado da plataforma após as alterações constitui aceitação dos novos termos.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">13. Lei Aplicável</h2>
                <p className="text-muted-foreground">
                  Estes Termos de Uso serão regidos e interpretados de acordo com as leis da República Federativa do Brasil, sem consideração a conflitos de disposições legais.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">14. Contato</h2>
                <p className="text-muted-foreground">
                  Para questões sobre estes Termos de Uso, entre em contato através da página de{" "}
                  <a href="/contato" className="text-primary hover:underline">
                    Contato
                  </a>.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
