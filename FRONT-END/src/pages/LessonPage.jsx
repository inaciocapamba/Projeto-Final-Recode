import { useState, useEffect } from 'react';
import 'primeicons/primeicons.css';
import '../styles/LessonPage.css';

function Header({ progress, onNavigate, vidas }) {
  return (
    <header className="lesson-header">
      <button className="btn-exit" onClick={() => onNavigate('student')}>
        <i className="pi pi-times" style={{ fontSize: '1.2rem' }}></i>
      </button>
      <div className="progress-bg">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="lives-counter">
        <i className="pi pi-heart-fill"></i>
        <span>{vidas}</span>
      </div>
    </header>
  );
}

function Main({ currentStep, totalQuestions, selected, setSelected, state, videoUrl, questaoAtual }) {
  const [opcoesMisturadas, setOpcoesMisturadas] = useState([]);

  useEffect(() => {
    if (questaoAtual) {
      const incorretas = questaoAtual.respostaIncorreta ? questaoAtual.respostaIncorreta.split(',') : [];
      const todasOpcoes = [...incorretas, questaoAtual.respostaCorreta].map(opt => opt.trim());

      // 2. Embaralha de maneira simples usando ordenação aleatória (.sort)
      const misturadas = todasOpcoes.sort(() => Math.random() - 0.5);

      // 3. Vincula as letras fixas (a, b, c, d) para o mapeamento visual no grid
      const letras = ['a', 'b', 'c', 'd'];
      const opcoesFinais = misturadas.slice(0, 4).map((texto, index) => ({
        id: letras[index],
        label: texto
      }));

      setOpcoesMisturadas(opcoesFinais);
    }
  }, [questaoAtual]);

  const obterEmbedUrl = (url) => {
    if (!url) return "";
    if (url.includes("embed/")) return url;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : url;
  };

  if (!questaoAtual) return <div className="loading-inside">Carregando questão...</div>;

  return (
    <main className="lesson-main">
      <div className="lesson-grid">
        <section className="panel-theory">
          <div className="video-place">
            {videoUrl ? (
              <iframe
                width="100%"
                height="100%"
                src={obterEmbedUrl(videoUrl)}
                title="Explicação do Conteúdo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ borderRadius: "12px" }}
              ></iframe>
            ) : (
              <div className="no-video">Sem vídeo disponível</div>
            )}
          </div>
          <h2>Material de Estudo</h2>
          <p>
            Assista ao vídeo explicativo acima com atenção e responda ao quiz ao lado para consolidar seu aprendizado na plataforma.
          </p>
        </section>

        <section className="panel-question">
          <span className="question-step">
            Questão {currentStep} de {totalQuestions}
          </span>
          <p className="question-prompt">{questaoAtual.enunciado}</p>
          
          <div className="option-list">
            {opcoesMisturadas.map((opt) => {
              const isSelected = selected === opt.label;
              const isCorrectAnswer = opt.label === questaoAtual.respostaCorreta;
              const showCorrect = state === 'incorrect' && isCorrectAnswer;

              let optionClass = 'option-item';
              if (isSelected && state === 'neutral') optionClass += ' selected-neutral';
              if (!isSelected && state === 'neutral') optionClass += ' unselected-neutral';
              if (state === 'correct' && isSelected) optionClass += ' option-correct';
              if (state === 'incorrect' && isSelected) optionClass += ' option-incorrect';
              if (showCorrect) optionClass += ' option-correct';
              if (state !== 'neutral' && !isSelected && !showCorrect) optionClass += ' option-disabled';

              return (
                <button
                  key={opt.id}
                  disabled={state !== 'neutral'}
                  onClick={() => setSelected(opt.label)}
                  className={optionClass}
                >
                  <span className={`option-badge ${(isSelected || showCorrect) ? 'badge-active' : ''}`}>
                    {opt.id}
                  </span>
                  <span>
                    <code>{opt.label}</code>
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

function Footer({ selected, state, handleVerify, handleContinue, questaoAtual }) {
  return (
    <footer className={`lesson-footer footer-${state}`}>
      <div className="footer-content">
        <div className="feedback-area">
          {state === 'correct' && (
            <div className="sucess-msg">
              <i className="pi pi-check-circle" style={{ fontSize: '1.8rem' }}></i>
              <div>
                <p className="title">Muito bem!</p>
                <p className="desc">Resposta correta.</p>
              </div>
            </div>
          )}
          {state === 'incorrect' && (
            <div className="error-msg">
              <i className="pi pi-heart" style={{ fontSize: '1.8rem' }}></i>
              <div>
                <p className="title">
                  Resposta correta: <code>{questaoAtual?.respostaCorreta}</code>
                </p>
                <p className="desc">Você errou e perdeu estabilidade.</p>
              </div>
            </div>
          )}
          {state === 'neutral' && (
            <p className="neutral-msg">{selected ? 'Pronto para verificar?' : 'Selecione uma resposta'}</p>
          )}
        </div>

        {state === 'neutral' ? (
          <button onClick={handleVerify} disabled={!selected} className="action-btn verify-btn">
            <i className="pi pi-search"></i> Verificar
          </button>
        ) : (
          <button
            onClick={handleContinue}
            className={`action-btn continue-btn ${state === 'incorrect' ? 'continue-btn-error' : ''}`}
          >
            Continuar <i className="pi pi-arrow-right"></i>
          </button>
        )}
      </div>
    </footer>
  );
}

function LessonPage({ onNavigate }) {
  const [questoes, setQuestoes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [state, setState] = useState('neutral');
  const [currentStep, setCurrentStep] = useState(1);
  const [lives, setLives] = useState(5);
  const [loading, setLoading] = useState(true);

  const conteudoId = localStorage.getItem("conteudo_id_atual") || "1";
  const videoUrl = localStorage.getItem("video_url_atual") || "";
  const usuarioId = localStorage.getItem("usuario_id") || "1";

  useEffect(() => {
    const inicializarLicao = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/questoes/conteudo/${conteudoId}`);
        if (response.ok) {
          const dados = await response.json();
          setQuestoes(dados);
        }

        const resUser = await fetch("http://localhost:8080/api/usuarios");
        if (resUser.ok) {
          const users = await resUser.json();
          const logado = users.find(u => u.id.toString() === usuarioId.toString());
          if (logado) setLives(logado.lives ?? logado.vidas ?? 5);
        }
      } catch (error) {
        console.error("Erro ao carregar dados da lição:", error);
      } finally {
        setLoading(false);
      }
    };

    inicializarLicao();
  }, [conteudoId, usuarioId]);

  const totalQuestions = questoes.length || 1;
  const progress = (currentStep / totalQuestions) * 100;
  const questaoAtual = questoes[currentStep - 1];

  const removerVidaDoBanco = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/usuarios/${usuarioId}/decrementar-vida`, {
        method: "PATCH"
      });
      if (response.ok) {
        const usuarioAtualizado = await response.json();
        setLives(usuarioAtualizado.lives ?? 0);
      }
    } catch (error) {
      console.error("Erro ao salvar decremento de vida no banco:", error);
    }
  };

  const salvarOfensivaNoBanco = async () => {
    try {
      const usuarioId = localStorage.getItem("usuario_id") || "1";
      const response = await fetch(`http://localhost:8080/api/usuarios/${usuarioId}/atualizar-ofensiva?quantidade=1`, {
        method: "PATCH"
      });

      if (!response.ok) {
        console.error("Erro ao atualizar ofensiva no servidor.");
      }
    } catch (error) {
      console.error("Erro na requisição de atualizar ofensiva:", error);
    }
  };

  async function handleVerify() {
    if (!selected || !questaoAtual) return;
    
    if (selected === questaoAtual.respostaCorreta) {
      setState('correct');
    } else {
      setState('incorrect');
      setLives((v) => Math.max(0, v - 1));
      await removerVidaDoBanco();
    }
  }

  const salvarProgressoNoBanco = async () => {
    try {
      const usuarioId = localStorage.getItem("usuario_id") || "1";
      const response = await fetch("http://localhost:8080/api/progresso/concluir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuarioId: parseInt(usuarioId),
          conteudoId: parseInt(conteudoId)
        })
      });
      
      if (!response.ok) {
        console.error("Erro ao salvar progresso no servidor.");
      }
    } catch (error) {
      console.error("Erro na requisição de salvar progresso:", error);
    }
  };

  async function handleContinue() {
    if (lives <= 0 && state === 'incorrect') {
      alert('Você ficou sem vidas! Descanse um pouco ou revise o conteúdo antes de tentar novamente.');
      onNavigate('student');
      return;
    }

    if (currentStep >= totalQuestions) {
      setLoading(true);
      await salvarProgressoNoBanco();
      await salvarOfensivaNoBanco();
      alert('Lição Finalizada com sucesso! Seu progresso e ofensiva foram updated.');
      onNavigate('student');
      return;
    }
    
    setCurrentStep((s) => s + 1);
    setSelected(null);
    setState('neutral');
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', color: '#afafaf', fontFamily: 'sans-serif' }}>
        <i className="pi pi-spin pi-spinner" style={{ fontSize: '3rem', marginBottom: '15px', color: '#0f9b6b' }}></i>
        <p>Sincronizando dados e montando ambiente...</p>
      </div>
    );
  }

  return (
    <div className="lesson-container">
      <Header progress={progress} onNavigate={onNavigate} vidas={lives} />
      <Main
        currentStep={currentStep}
        totalQuestions={totalQuestions}
        selected={selected}
        setSelected={setSelected}
        state={state}
        videoUrl={videoUrl}
        questaoAtual={questaoAtual}
      />
      <Footer
        selected={selected}
        state={state}
        handleVerify={handleVerify}
        handleContinue={handleContinue}
        questaoAtual={questaoAtual}
      />
    </div>
  );
}

export default LessonPage;