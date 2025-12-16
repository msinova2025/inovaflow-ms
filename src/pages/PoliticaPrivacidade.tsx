import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function PoliticaPrivacidade() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
              Política de Privacidade
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
                <h2 className="text-2xl font-bold mb-4">1. Introdução</h2>
                <p className="text-muted-foreground">
                  Esta Política de Privacidade descreve como o MS Inova Mais, uma iniciativa do Governo do Estado de Mato Grosso do Sul, coleta, usa, armazena e protege suas informações pessoais quando você utiliza nossa plataforma.
                </p>
                <p className="text-muted-foreground mt-3">
                  Estamos comprometidos em proteger sua privacidade e em cumprir a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018) e demais legislações aplicáveis.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">2. Informações que Coletamos</h2>
                
                <h3 className="text-xl font-semibold mb-3 mt-4">2.1 Informações fornecidas por você:</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li><strong>Dados de cadastro:</strong> Nome completo, e-mail, CPF/CNPJ, telefone, organização</li>
                  <li><strong>Dados de perfil:</strong> Tipo de usuário (desafiador ou solucionador), foto de perfil</li>
                  <li><strong>Conteúdo publicado:</strong> Desafios, soluções, comentários e documentos enviados</li>
                  <li><strong>Dados de comunicação:</strong> Mensagens enviadas através da plataforma</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 mt-6">2.2 Informações coletadas automaticamente:</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li><strong>Dados de navegação:</strong> Endereço IP, tipo de navegador, páginas visitadas</li>
                  <li><strong>Cookies:</strong> Informações armazenadas para melhorar sua experiência</li>
                  <li><strong>Dados de uso:</strong> Como você interage com a plataforma</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">3. Como Utilizamos suas Informações</h2>
                <p className="text-muted-foreground mb-3">
                  Utilizamos suas informações pessoais para:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Criar e gerenciar sua conta na plataforma</li>
                  <li>Facilitar a conexão entre desafiadores e solucionadores</li>
                  <li>Processar e exibir desafios e soluções</li>
                  <li>Enviar notificações sobre atividades relevantes</li>
                  <li>Melhorar e personalizar sua experiência na plataforma</li>
                  <li>Realizar análises estatísticas e pesquisas</li>
                  <li>Comunicar atualizações, eventos e notícias</li>
                  <li>Prevenir fraudes e garantir a segurança da plataforma</li>
                  <li>Cumprir obrigações legais e regulatórias</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">4. Base Legal para o Tratamento de Dados</h2>
                <p className="text-muted-foreground mb-3">
                  Tratamos seus dados pessoais com base nas seguintes bases legais:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li><strong>Consentimento:</strong> Quando você concorda com o tratamento de seus dados</li>
                  <li><strong>Execução de contrato:</strong> Para fornecer os serviços da plataforma</li>
                  <li><strong>Legítimo interesse:</strong> Para melhorar nossos serviços e prevenir fraudes</li>
                  <li><strong>Cumprimento de obrigação legal:</strong> Quando exigido por lei</li>
                  <li><strong>Exercício regular de direitos:</strong> Em processos judiciais ou administrativos</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">5. Compartilhamento de Informações</h2>
                <p className="text-muted-foreground mb-3">
                  Podemos compartilhar suas informações nas seguintes situações:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li><strong>Com outros usuários:</strong> Seu perfil público e conteúdo publicado são visíveis para outros usuários</li>
                  <li><strong>Com parceiros:</strong> Organizações parceiras do programa MS Inova Mais</li>
                  <li><strong>Prestadores de serviço:</strong> Empresas que nos ajudam a operar a plataforma (hospedagem, análises, comunicação)</li>
                  <li><strong>Autoridades:</strong> Quando exigido por lei ou para proteger direitos legais</li>
                  <li><strong>Em caso de transferência:</strong> Se houver fusão, aquisição ou venda de ativos</li>
                </ul>
                <p className="text-muted-foreground mt-3">
                  Nunca vendemos suas informações pessoais para terceiros.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">6. Segurança dos Dados</h2>
                <p className="text-muted-foreground">
                  Implementamos medidas técnicas e organizacionais apropriadas para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição. Isso inclui:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-3">
                  <li>Criptografia de dados sensíveis</li>
                  <li>Controles de acesso rigorosos</li>
                  <li>Monitoramento contínuo de segurança</li>
                  <li>Backups regulares</li>
                  <li>Treinamento de equipe sobre proteção de dados</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">7. Retenção de Dados</h2>
                <p className="text-muted-foreground">
                  Mantemos suas informações pessoais apenas pelo tempo necessário para cumprir os propósitos descritos nesta política, a menos que um período de retenção mais longo seja exigido ou permitido por lei.
                </p>
                <p className="text-muted-foreground mt-3">
                  Quando suas informações não forem mais necessárias, nós as excluiremos ou anonimizaremos de forma segura.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">8. Seus Direitos</h2>
                <p className="text-muted-foreground mb-3">
                  De acordo com a LGPD, você tem os seguintes direitos sobre seus dados pessoais:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li><strong>Confirmação e acesso:</strong> Confirmar se tratamos seus dados e acessá-los</li>
                  <li><strong>Correção:</strong> Corrigir dados incompletos, inexatos ou desatualizados</li>
                  <li><strong>Anonimização, bloqueio ou eliminação:</strong> Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade</li>
                  <li><strong>Portabilidade:</strong> Solicitar a portabilidade de seus dados a outro fornecedor</li>
                  <li><strong>Eliminação:</strong> Solicitar a exclusão de dados tratados com base no consentimento</li>
                  <li><strong>Informação:</strong> Obter informações sobre compartilhamento de dados</li>
                  <li><strong>Revogação do consentimento:</strong> Revogar o consentimento a qualquer momento</li>
                  <li><strong>Oposição:</strong> Opor-se ao tratamento de dados</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">9. Cookies e Tecnologias Similares</h2>
                <p className="text-muted-foreground mb-3">
                  Utilizamos cookies e tecnologias similares para:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Manter você conectado à plataforma</li>
                  <li>Lembrar suas preferências</li>
                  <li>Analisar como você usa a plataforma</li>
                  <li>Melhorar a funcionalidade e desempenho</li>
                </ul>
                <p className="text-muted-foreground mt-3">
                  Você pode controlar cookies através das configurações do seu navegador.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">10. Dados de Menores de Idade</h2>
                <p className="text-muted-foreground">
                  Nossa plataforma não é direcionada a menores de 18 anos. Não coletamos intencionalmente informações pessoais de menores. Se tomarmos conhecimento de que coletamos dados de um menor sem autorização dos responsáveis, tomaremos medidas para excluir essas informações.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">11. Transferência Internacional de Dados</h2>
                <p className="text-muted-foreground">
                  Seus dados podem ser transferidos e armazenados em servidores localizados fora do Brasil. Quando isso ocorrer, garantimos que medidas apropriadas de proteção sejam implementadas conforme exigido pela LGPD.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">12. Alterações nesta Política</h2>
                <p className="text-muted-foreground">
                  Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre alterações significativas através da plataforma ou por e-mail. Recomendamos que você revise esta política regularmente.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">13. Encarregado de Dados (DPO)</h2>
                <p className="text-muted-foreground">
                  Para exercer seus direitos ou tirar dúvidas sobre o tratamento de seus dados pessoais, entre em contato com nosso Encarregado de Proteção de Dados através da página de{" "}
                  <a href="/contato" className="text-primary hover:underline">
                    Contato
                  </a>.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">14. Contato</h2>
                <p className="text-muted-foreground">
                  Para questões sobre esta Política de Privacidade ou sobre o tratamento de seus dados pessoais, entre em contato conosco através da página de{" "}
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
