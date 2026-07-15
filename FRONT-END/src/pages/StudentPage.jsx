import React, { useState, useEffect } from 'react';

import 'primeicons/primeicons.css';

import '../styles/StudentPage.css';



function Sidebar({ onNavigate }) {

  const items = [
    { icon: 'pi pi-user', label: 'Perfil', action: 'profile' },
    { icon: 'pi pi-sign-out', label: 'Sair', action: 'first' }
  ];



  return (

    <aside className="sidebar">

      <div className="sidebar-header">

        <span className="logo-badge">DT</span>

        <span className="logo-text">DuoTec</span>

      </div>

      <nav className="sidebar-nav">

        {items.map((item) => (

          <button 
          key={item.label} className="nav-item"
          onClick={() => onNavigate(item.action)}>

            <i className={`${item.icon} nav-icon`}></i>

            {item.label}

          </button>

        ))}

      </nav>

    </aside>

  );

}



function StatusPanel({ vidas, diasOfensiva }) {

  return (

    <div className="status-panel">

      <div className="status-badge lives">

        <i className="pi pi-heart-fill"></i>

        <span>{vidas} {vidas === 1 ? 'Vida' : 'Vidas'}</span>

      </div>

      <div className="status-badge days">

        <i className="pi pi-bolt"></i>

        <span>{diasOfensiva} {diasOfensiva === 1 ||  diasOfensiva === 0 ? 'Dia' : 'Dias'}</span>

      </div>

    </div>

  );

}



function ModuleCircle({ module, index, onNavigate }) {

    const isCompleted = module.status === 'completed';

    const isActive = module.status === 'active' || (!module.status && index === 0);

    const isLocked = module.status === 'locked' || (!module.status && index > 0);



    let iconClass = 'pi pi-star-fill';

    if (isLocked) iconClass = 'pi pi-lock';

    if (isActive) iconClass = 'pi pi-play';



    let buttonStyle = 'module-btn';

    if (isActive) buttonStyle += ' btn-active';

    if (isLocked) buttonStyle += ' btn-locked';

    if (isCompleted) buttonStyle += ' btn-completed';



    const zigzagClass = index % 2 === 0 ? 'left-side' : 'right-side';

    const handlePlayLesson = () => {

      if (!isLocked) {
        localStorage.setItem("conteudo_id_atual", module.id);
        localStorage.setItem("video_url_atual", module.videoUrl);
        onNavigate('lesson');
      }

    };



    return (
      <div className={`module-node ${zigzagClass}`}>
        <button
          type="button"
          disabled={isLocked}
          className={buttonStyle}
          onClick={handlePlayLesson}
        >
          {isActive && <span className="ping-ring" />}

          <i className={iconClass} style={{ fontSize: '1.5rem' }}></i>
        </button>

        <div className="module-info">
          <p className={`module-title ${isLocked ? 'text-locked' : ''}`}>{module.titulo}</p>
          {isActive && <span className="continue-badge">Continuar</span>}
        </div>
      </div>
    );
}

function StudentPage({ onNavigate }) {
    const [listaConteudos, setListaConteudos] = useState([]);
    const [usuario, setUsuario] = useState({});
    const [loading, setLoading] = useState(true);

    const buscarDadosDaTrilha = async () => {

    try {
      setLoading(true);
      const usuarioId = localStorage.getItem("usuario_id") || "1";
      try {
        const resUsuario = await fetch(`http://localhost:8080/api/usuarios`);
        if (resUsuario.ok) {
          const usuarios = await resUsuario.json();
          const usuarioLogado = usuarios.find(u => u.id.toString() === usuarioId.toString());

          if (usuarioLogado) {
            setUsuario(usuarioLogado);
          } else if (usuarios.length > 0) {
            setUsuario(usuarios[0]);
          }
        }
      } catch (errUser) {
        console.error("Erro ao buscar dados do usuário:", errUser);
      }

      const response = await fetch("http://localhost:8080/api/conteudos");
      if (response.ok) {
        const dados = await response.json();
        const conteudosOrdenados = [...dados].sort((a, b) => a.id - b.id);

        let progressos = [];
        try {
          const resProgresso = await fetch(`http://localhost:8080/api/progresso/usuario/${usuarioId}`);
          if (resProgresso.ok) {
            progressos = await resProgresso.json();
          }
        } catch (errProgresso) {
          console.error("Erro ao buscar progresso do usuário:", errProgresso);
        }

        const idsConcluidos = new Set(
          progressos
            .filter((p) => p.concluido && p.conteudo)
            .map((p) => p.conteudo.id)
        );

        let jaDefiniuAtivo = false;
        const conteudosFormatados = conteudosOrdenados.map((conteudo) => {
          let status;
          if (idsConcluidos.has(conteudo.id)) {
            status = 'completed';
          } else if (!jaDefiniuAtivo) {
            status = 'active';
            jaDefiniuAtivo = true;
          } else {
            status = 'locked';
          }
          return { ...conteudo, status };
        });

        setListaConteudos(conteudosFormatados);
      } else {
        console.error("Servidor retornou erro ao buscar conteúdos:", response.status);
      }
    } catch (error) {
      console.error("Erro geral ao conectar ao banco de dados:", error);
    } finally {
      setLoading(false);
    }

};



  useEffect(() => {

    buscarDadosDaTrilha();

  }, []);



  return (

    <div className="student-conteiner">

      <Sidebar onNavigate={onNavigate}/>

      <main className="main-content">

        <div className="top-bar">

          <div>

            <h1 className="main-title"> <i className='pi pi-map'></i> Trilha de Estudo</h1>

            <p className="subtitle">Continue de onde parou</p>

          </div>

          <StatusPanel vidas={usuario.lives ?? 0} diasOfensiva={usuario.days ?? 0} />

        </div>



        {loading ? (

          <div style={{ textAlign: 'center', marginTop: '40px', color: '#afafaf' }}>

            <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem', marginBottom: '10px', color: 'green' }}></i>

            <p>Carregando sua trilha de estudos...</p>

          </div>

        ) : (

          <div className="map-conteiner">

            {listaConteudos.length === 0 ? (

              <div style={{ textAlign: 'center', color: '#afafaf', padding: '20px' }}>

                <p>Nenhum conteúdo cadastrado pelo administrador ainda.</p>

              </div>

            ) : (

              listaConteudos.map((m, i) => (

                <div key={m.id} className="map-step">

                  <ModuleCircle module={m} index={i} onNavigate={onNavigate} />

                  {i < listaConteudos.length - 1 && <div className="map-line" />}

                </div>

              ))

            )}

          </div>

        )}

      </main>

    </div>

  );

}

export default StudentPage; 

