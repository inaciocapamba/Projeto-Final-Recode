import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import DuoImage from '../assets/Duo_logo.png';
import 'primeicons/primeicons.css';
import '../styles/FirstPage.css';

const features = [
  {
    icon: 'pi pi-clock',
    title: 'Lições de 10 minutos',
    description: 'Conteúdo direto ao ponto. Aprenda um conceito novo todo dia sem comprometer sua agenda.',
  },
  {
    icon: 'pi pi-sparkles',
    title: 'Projetos práticos',
    description: 'Construa aplicações reais desde o primeiro dia. Aprenda fazendo, não apenas assistindo.',
  },
  {
    icon: 'pi pi-users',
    title: 'Comunidade ativa',
    description: 'Tire dúvidas, compartilhe progresso e conecte-se com outros alunos em nossa comunidade.',
  },
];

function Header({ onLoginClick }) {
  return (
    <header className="firstpage-header">
      <div className="duoLogo">
        <span className="duoLogo-icon">DT</span>
        <span className="duoLogo-text">DuoTec</span>
      </div>
      <button className="firstpage-btn-header" onClick={onLoginClick}>
        Entrar
      </button>
    </header>
  );
}

function Cards({ icon, title, description }) {
  return (
    <div className="card-container">
      <div className="card-icon">
        <i className={icon}></i>
      </div>
      <h2 className="card-title">{title}</h2>
      <p className="card-desc">{description}</p>
    </div>
  );
}

function Body({ onLoginClick }) {
  return (
    <main className="body-content">
      <section className="first-section">
        <span>
          <div>
            <img className="duo-img" src={DuoImage} alt="" />
          </div>
        </span>
        <div>
          <h1 className="main-body-title">
            Domine programação <span id="sem-traumas">sem traumas</span>, uma lição por dia.
          </h1>
          <p className="main-body-desc">
            Aulas curtas, práticas e em português. Aprenda no seu ritmo com uma plataforma pensada para quem quer resultados reais.
          </p>
          <button className="firstpage-btn-body" onClick={onLoginClick}>
            Começar a Aprender Agora (Grátis)
          </button>
        </div>
      </section>

      <section className="second-section">
        <h2 className="second-section-title">Por que escolher a DuoTec?</h2>
        <div className="main-card-container">
          {features.map((item) => (
            <Cards key={item.title} {...item} />
          ))}
        </div>
      </section>
    </main>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <p className="footer-desc">&copy; {new Date().getFullYear()} DuoTec. Todos os direitos reservados.</p>
    </footer>
  );
}

function LoginModal({ visible, onHide, onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          email: email, 
          password: password
        })
      });
      
      if (response.ok) {
        const usuarioLogado = await response.json();
        localStorage.setItem("usuario_id", usuarioLogado.id.toString());
        
        const tipoConta = usuarioLogado.accountType || "Student";
        localStorage.setItem("user_role", tipoConta);
        onHide();

        if (tipoConta.toLowerCase() === "admin") {
          onNavigate('admin');
        } else {
          onNavigate('student');
        }
      } else if (response.status === 401) {
        setErro("Email ou senha incorretos.");
      } else {
        setErro("Erro interno no servidor do sistema.");
      }
    } catch (error) {
      console.error("Erro na autenticação:", error);
      setErro("Não foi possível conectar ao banco de dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      className="dialog"
      visible={visible}
      onHide={onHide}
      modal
    >
      <div className="dialog-info text-center mb-4">
        <div className="duoLogo" style={{ justifyContent: 'center' }}>
          <span className="duoLogo-icon">DT</span>
        </div>
        <h2 className="dialog-title">Bem-vindo de volta</h2>
        <p className="dialog-desc">Entre na sua conta para continuar aprendendo</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-column gap-3">
        {erro && <p style={{ color: '#ff6b6b', textAlign: 'center', margin: '0 0 10px 0', fontSize: '0.9rem' }}>{erro}</p>}
        
        <div className="email">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-inputtext p-component w-full"
          />
        </div>
        <div className="password">
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-inputtext p-component w-full"
          />
        </div>

        <button className="dialog-btn" type="submit" disabled={loading}>
          {loading ? 'Verificando...' : 'Acessar App'}
        </button>
        
        <div className='dialog-text'>
          <a href="#" className="dialog-text-password">
            Esqueceu a senha?
          </a>
          <p>
            Não tem conta? |{' '}
            <button
              type='button'
              onClick={() => onNavigate('login')}
              className="btn-link"
            >
              Criar conta grátis
            </button>
          </p>
        </div>
      </form>
    </Dialog>
  );
}

function FirstPage({ onNavigate }) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <div>
      <Header onLoginClick={() => setModalVisible(true)} />
      <Body onLoginClick={() => setModalVisible(true)} />
      <Footer />
      <LoginModal
        visible={modalVisible}
        onHide={() => setModalVisible(false)}
        onNavigate={onNavigate}
      />
    </div>
  );
}

export default FirstPage;