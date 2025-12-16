import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Building2, UserCircle, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { formatCPFOrCNPJ, formatPhone } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import logoInovaSmall from "@/assets/logo-inova-small.png";
type UserType = "challenger" | "solver";
export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    toast
  } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(searchParams.get("mode") === "register" ? "register" : "login");

  // Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [documentType, setDocumentType] = useState<"cpf" | "cnpj">("cpf");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [userType, setUserType] = useState<UserType | null>(null);
  const [cnpjLoading, setCnpjLoading] = useState(false);
  const [registerStep, setRegisterStep] = useState(1);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Reset password fields
  const [resetEmail, setResetEmail] = useState("");
  useEffect(() => {
    supabase.auth.getSession().then(({
      data: {
        session
      }
    }) => {
      if (session) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);
  const fetchCNPJData = async (cnpj: string) => {
    const cleanCNPJ = cnpj.replace(/\D/g, "");
    if (cleanCNPJ.length !== 14) return;
    setCnpjLoading(true);
    try {
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCNPJ}`);
      if (response.ok) {
        const data = await response.json();
        setFullName(data.razao_social || "");
        setOrganization(data.nome_fantasia || data.razao_social || "");
        setPhone(data.ddd_telefone_1 || "");
        toast({
          title: "Dados encontrados!",
          description: "Informações da empresa foram preenchidas automaticamente."
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao buscar CNPJ",
        description: "Não foi possível buscar os dados. Preencha manualmente."
      });
    } finally {
      setCnpjLoading(false);
    }
  };
  const handleCNPJChange = (value: string) => {
    const formatted = formatCPFOrCNPJ(value);
    setCpfCnpj(formatted);
    const cleanValue = value.replace(/\D/g, "");
    if (cleanValue.length === 14 && userType === "challenger") {
      fetchCNPJData(value);
    }
  };
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const {
        data: {
          session
        },
        error
      } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword
      });
      if (error) throw error;
      if (session) {
        // Check user role to redirect appropriately
        const {
          data: profile
        } = await supabase.from("profiles").select("user_type, phone").eq("id", session.user.id).single();
        
        // Send WhatsApp message on login
        if (profile?.phone) {
          const cleanPhone = profile.phone.replace(/\D/g, "");
          const phoneWithCountryCode = cleanPhone.startsWith("55") ? cleanPhone : `55${cleanPhone}`;
          
          try {
            await supabase.functions.invoke("send-whatsapp", {
              body: {
                recipients: phoneWithCountryCode,
                message: "Olá! Você acabou de fazer login na plataforma MS Inova Mais. Bem-vindo de volta!"
              }
            });
          } catch (error) {
            console.error("Error sending WhatsApp message:", error);
          }
        }
        
        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando para o painel..."
        });

        // Redirect admins and advanced users to dashboard
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: error.message || "Verifique suas credenciais e tente novamente."
      });
    } finally {
      setLoading(false);
    }
  };
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userType) {
      toast({
        variant: "destructive",
        title: "Selecione um perfil",
        description: "Escolha se você é um Desafiador ou Solucionador."
      });
      return;
    }
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "As senhas não coincidem",
        description: "Por favor, verifique as senhas digitadas."
      });
      return;
    }
    if (!acceptedTerms) {
      toast({
        variant: "destructive",
        title: "Aceite os termos",
        description: "Você precisa aceitar os Termos de Uso e Política de Privacidade para continuar."
      });
      return;
    }
    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/dashboard`;
      const {
        error
      } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            user_type: userType,
            phone,
            organization,
            cpf_cnpj: cpfCnpj
          }
        }
      });
      if (error) throw error;
      
      // Send WhatsApp message on registration
      if (phone) {
        const cleanPhone = phone.replace(/\D/g, "");
        const phoneWithCountryCode = cleanPhone.startsWith("55") ? cleanPhone : `55${cleanPhone}`;
        
        try {
          await supabase.functions.invoke("send-whatsapp", {
            body: {
              recipients: phoneWithCountryCode,
              message: `Olá, ${fullName}! Seu cadastro na plataforma MS Inova Mais foi realizado com sucesso. Verifique seu e-mail para confirmar sua conta.`
            }
          });
        } catch (error) {
          console.error("Error sending WhatsApp message:", error);
        }
      }
      
      toast({
        title: "Cadastro realizado!",
        description: "Verifique seu e-mail para confirmar sua conta."
      });
      setActiveTab("login");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar",
        description: error.message || "Ocorreu um erro ao criar sua conta."
      });
    } finally {
      setLoading(false);
    }
  };
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const {
        error
      } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      if (error) throw error;
      toast({
        title: "E-mail enviado!",
        description: "Verifique sua caixa de entrada para redefinir sua senha."
      });
      setActiveTab("login");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao enviar e-mail",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-screen flex items-center justify-center bg-[#004f9f] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center group">
            <img src={logoInovaSmall} alt="MS Inova Mais" className="h-24 w-auto mb-2" />
            
          </Link>
        </div>

        <Card className="shadow-xl border-2">
          <CardContent className="p-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsContent value="login" className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Bem-vindo de volta!</h2>
                  <p className="text-muted-foreground">Entre com suas credenciais</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-base">E-mail</Label>
                    <Input id="login-email" type="email" placeholder="seu@email.com" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className="h-12" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-base">Senha</Label>
                    <Input id="login-password" type="password" placeholder="••••••••" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className="h-12" required />
                  </div>
                  <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={loading}>
                    {loading ? <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Entrando...
                      </> : "Entrar"}
                  </Button>
                  
                  <div className="flex justify-center gap-4 text-sm text-muted-foreground">
                    <button type="button" onClick={() => setActiveTab("register")} className="hover:text-primary transition-colors underline">
                      Criar conta
                    </button>
                    <span>•</span>
                    <button type="button" onClick={() => setActiveTab("reset")} className="hover:text-primary transition-colors underline">
                      Esqueci minha senha
                    </button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Crie sua conta</h2>
                  <p className="text-muted-foreground">Primeiro, escolha seu perfil</p>
                </div>

                {!userType ? <>
                    <div className="grid grid-cols-2 gap-4">
                      <button type="button" onClick={() => setUserType("challenger")} className="group relative p-6 border-2 border-border rounded-2xl hover:border-primary hover:shadow-lg transition-all duration-300 bg-card hover:bg-primary/5">
                        <div className="flex flex-col items-center space-y-3">
                          <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <Building2 className="h-8 w-8 text-primary" />
                          </div>
                          <div className="text-center">
                            <h3 className="text-base font-bold text-foreground">Desafiador</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              Empresas e organizações
                            </p>
                          </div>
                        </div>
                      </button>

                      <button type="button" onClick={() => setUserType("solver")} className="group relative p-6 border-2 border-border rounded-2xl hover:border-secondary hover:shadow-lg transition-all duration-300 bg-card hover:bg-secondary/5">
                        <div className="flex flex-col items-center space-y-3">
                          <div className="p-3 rounded-full bg-secondary/10 group-hover:bg-secondary/20 transition-colors">
                            <UserCircle className="h-8 w-8 text-secondary" />
                          </div>
                          <div className="text-center">
                            <h3 className="text-base font-bold text-foreground">Solucionador</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              Profissionais inovadores
                            </p>
                          </div>
                        </div>
                      </button>
                    </div>
                    
                    <div className="text-center text-sm text-muted-foreground mt-6">
                      <button type="button" onClick={() => setActiveTab("login")} className="hover:text-primary transition-colors underline">
                        Já tem uma conta? Faça login
                      </button>
                    </div>
                  </> : <form onSubmit={handleRegister} className="space-y-6">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        {userType === "challenger" ? <Building2 className="h-5 w-5 text-primary" /> : <UserCircle className="h-5 w-5 text-secondary" />}
                        <span className="font-semibold text-sm">
                          {userType === "challenger" ? "Desafiador" : "Solucionador"}
                        </span>
                      </div>
                      <Button type="button" variant="ghost" size="sm" onClick={() => {
                    setUserType(null);
                    setRegisterStep(1);
                  }} className="h-8 text-xs">
                        Trocar
                      </Button>
                    </div>

                    {/* Progress indicator */}
                    <div className="flex items-center justify-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${registerStep >= 1 ? 'bg-primary' : 'bg-muted'}`} />
                      <div className={`h-2 w-2 rounded-full ${registerStep >= 2 ? 'bg-primary' : 'bg-muted'}`} />
                      <div className={`h-2 w-2 rounded-full ${registerStep >= 3 ? 'bg-primary' : 'bg-muted'}`} />
                    </div>

                    <div className="space-y-4">
                      {/* Step 1: Dados da Empresa/Pessoa */}
                      {registerStep === 1 && <>
                          {userType === "challenger" && <div className="space-y-2">
                              <Label htmlFor="cnpj" className="text-sm">CNPJ da Empresa *</Label>
                              <Input id="cnpj" placeholder="00.000.000/0000-00" value={cpfCnpj} onChange={e => handleCNPJChange(e.target.value)} className="h-12" required disabled={cnpjLoading} />
                              {cnpjLoading && <p className="text-xs text-muted-foreground flex items-center gap-2">
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                  Buscando dados da empresa...
                                </p>}
                            </div>}

                          <div className="space-y-2">
                            <Label htmlFor="fullName" className="text-sm">
                              {userType === "challenger" ? "Razão Social *" : "Nome Completo *"}
                            </Label>
                            <Input id="fullName" placeholder={userType === "challenger" ? "Nome da empresa" : "Seu nome completo"} value={fullName} onChange={e => setFullName(e.target.value)} className="h-12" required />
                          </div>

                          {userType === "challenger" && <div className="space-y-2">
                              <Label htmlFor="organization" className="text-sm">Nome Fantasia</Label>
                              <Input id="organization" placeholder="Nome fantasia da empresa" value={organization} onChange={e => setOrganization(e.target.value)} className="h-12" />
                            </div>}

                          {userType === "solver" && <>
                              <div className="space-y-2">
                                <Label className="text-sm">Tipo de Documento *</Label>
                                <div className="grid grid-cols-2 gap-2">
                                  <Button
                                    type="button"
                                    variant={documentType === "cpf" ? "default" : "outline"}
                                    className="h-12"
                                    onClick={() => {
                                      setDocumentType("cpf");
                                      setCpfCnpj("");
                                    }}
                                  >
                                    CPF
                                  </Button>
                                  <Button
                                    type="button"
                                    variant={documentType === "cnpj" ? "default" : "outline"}
                                    className="h-12"
                                    onClick={() => {
                                      setDocumentType("cnpj");
                                      setCpfCnpj("");
                                    }}
                                  >
                                    CNPJ
                                  </Button>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="cpf-cnpj" className="text-sm">
                                  {documentType === "cpf" ? "CPF *" : "CNPJ *"}
                                </Label>
                                <Input 
                                  id="cpf-cnpj" 
                                  placeholder={documentType === "cpf" ? "000.000.000-00" : "00.000.000/0000-00"} 
                                  value={cpfCnpj} 
                                  onChange={e => setCpfCnpj(formatCPFOrCNPJ(e.target.value))} 
                                  className="h-12"
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="organization-solver" className="text-sm">Organização</Label>
                                <Input id="organization-solver" placeholder="Sua organização (opcional)" value={organization} onChange={e => setOrganization(e.target.value)} className="h-12" />
                              </div>
                            </>}
                        </>}

                      {/* Step 2: Dados de Contato */}
                      {registerStep === 2 && <>
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm">E-mail *</Label>
                            <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} className="h-12" required />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm">Telefone / WhatsApp</Label>
                            <Input id="phone" placeholder="(67) 99999-9999" value={phone} onChange={e => setPhone(formatPhone(e.target.value))} className="h-12" />
                          </div>
                        </>}

                      {/* Step 3: Senha */}
                      {registerStep === 3 && <>
                          <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm">Senha *</Label>
                            <Input id="password" type="password" placeholder="Mínimo 6 caracteres" value={password} onChange={e => setPassword(e.target.value)} className="h-12" required minLength={6} />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-sm">Confirmar Senha *</Label>
                            <Input id="confirmPassword" type="password" placeholder="Digite a senha novamente" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="h-12" required minLength={6} />
                          </div>

                          <div className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
                            <Checkbox 
                              id="terms" 
                              checked={acceptedTerms}
                              onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                              className="mt-1"
                            />
                            <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                              Li e concordo com os{" "}
                              <a href="/termos-uso" target="_blank" className="text-primary hover:underline font-medium">
                                Termos de Uso
                              </a>
                              {" "}e a{" "}
                              <a href="/politica-privacidade" target="_blank" className="text-primary hover:underline font-medium">
                                Política de Privacidade
                              </a>
                            </label>
                          </div>
                        </>}
                    </div>

                    {/* Navigation buttons */}
                    <div className="flex gap-3">
                      {registerStep > 1 && <Button type="button" variant="outline" className="flex-1 h-12" onClick={() => setRegisterStep(registerStep - 1)}>
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Voltar
                        </Button>}
                      {registerStep < 3 ? <Button type="button" className="flex-1 h-12" onClick={() => {
                    // Simple validation before going to next step
                    if (registerStep === 1 && !fullName) {
                      toast({
                        variant: "destructive",
                        title: "Preencha os campos obrigatórios"
                      });
                      return;
                    }
                    if (registerStep === 2 && !email) {
                      toast({
                        variant: "destructive",
                        title: "Preencha o e-mail"
                      });
                      return;
                    }
                    setRegisterStep(registerStep + 1);
                  }}>
                          Próximo
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button> : <Button type="submit" className="flex-1 h-12 text-base font-semibold" disabled={loading}>
                          {loading ? <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Cadastrando...
                            </> : "Criar conta"}
                        </Button>}
                    </div>
                    
                    <div className="text-center text-sm text-muted-foreground">
                      <button type="button" onClick={() => setActiveTab("login")} className="hover:text-primary transition-colors underline">
                        Já tem uma conta? Faça login
                      </button>
                    </div>
                  </form>}
              </TabsContent>

              <TabsContent value="reset" className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Recuperar senha</h2>
                  <p className="text-muted-foreground">Enviaremos um link para seu e-mail</p>
                </div>

                <form onSubmit={handleReset} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email" className="text-sm">E-mail</Label>
                    <Input id="reset-email" type="email" placeholder="seu@email.com" value={resetEmail} onChange={e => setResetEmail(e.target.value)} className="h-12" required />
                  </div>
                  <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={loading}>
                    {loading ? <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Enviando...
                      </> : "Enviar e-mail de recuperação"}
                  </Button>
                  
                  <div className="text-center text-sm text-muted-foreground">
                    <button type="button" onClick={() => setActiveTab("login")} className="hover:text-primary transition-colors underline">
                      Voltar para o login
                    </button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Button variant="ghost" asChild className="text-white hover:text-white/80">
            <Link to="/">
              Voltar para home
            </Link>
          </Button>
        </div>
      </div>
    </div>;
}