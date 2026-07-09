import React, { useState, useEffect } from "react";
import "../styles/AdminPage.css";

function SideBar({ onNavigate }) {
    return (
        <aside className="admin-sidebar">
            <div className="sidebar-logo">
                <span className="logo-badge">DT</span>
                <span className="logo-text">DuoTec</span>
            </div>
            <nav className="sidebar-nav">
                <button 
                    className="nav-link"
                    onClick={() => onNavigate('first')}
                >
                    <i className="pi pi-sign-out" style={{ marginRight: "8px" }}></i>
                    Sair
                </button>
            </nav>
        </aside>
    );
}

function MetricCard({ icon, label, value, iconColor }) {
    return (
        <div className="metric-card">
            <div className="metric-header">
                <span className="metric-label">{label}</span>
                <i className={icon} style={{ color: iconColor, fontSize: "1.2rem" }}></i>
            </div>
            <p className="metric-value">{value}</p>
        </div>
    );
}

function QuestionForm({ onQuestionCreated, listaConteudos }) {
    const [selectedConteudoId, setSelectedConteudoId] = useState("");
    const [statement, setStatement] = useState("");
    const [answer, setAnswer] = useState("");
    const [wrongAnswers, setWrongAnswers] = useState("");
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedConteudoId) {
            alert("Por favor, selecione um módulo/conteúdo.");
            return;
        }

        const arrayIncorretas = wrongAnswers.split(',').map(opt => opt.trim()).filter(Boolean);
        if (arrayIncorretas.length !== 3) {
            alert(`Por favor, insira exatamente 3 respostas incorretas separadas por vírgula.\nVocê digitou atualmente: ${arrayIncorretas.length}`);
            return;
        }

        const novaQuestao = {
            enunciado: statement,
            respostaCorreta: answer,
            respostaIncorreta: wrongAnswers, 
            conteudoId: parseInt(selectedConteudoId)
        };

        try {
            setLoading(true);
            const response = await fetch("http://localhost:8080/api/questoes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(novaQuestao)
            });

            if (response.ok) {
                setSaved(true);
                setSelectedConteudoId("");
                setStatement("");
                setAnswer("");
                setWrongAnswers("");

                if (onQuestionCreated) onQuestionCreated();

                setTimeout(() => setSaved(false), 3000);
            } else {
                alert("Erro ao salvar a questão no servidor. Verifique se o conteúdo selecionado existe.");
            }
        } catch (error) {
            console.error("Erro de conexão com o backend:", error);
            alert("Não foi possível conectar ao backend.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-card">
            <h2 className="form-title">Cadastrar Nova Questão</h2>
            <form className="admin-form" onSubmit={handleSubmit}>
                
                <div className="form-group">
                    <label htmlFor="module">Módulo/Conteúdo</label>
                    <select
                        id="module"
                        value={selectedConteudoId}
                        onChange={(e) => setSelectedConteudoId(e.target.value)}
                        required
                        className="form-select"
                    >
                        <option value="" disabled>-- Selecione um Conteúdo --</option>
                        {listaConteudos.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.modulo.toUpperCase()} - {c.titulo}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="statement">Enunciado da Questão</label>
                    <textarea 
                        id="statement"
                        value={statement}
                        onChange={(e) => setStatement(e.target.value)}
                        placeholder="Ex: Digite aqui o enunciado da questão..."
                        required
                        className="form-textarea"
                        rows="4"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="answer">Resposta Correta</label>
                    <input 
                        id="answer"
                        type="text"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Ex: 4"
                        required
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="wrongAnswers">Respostas Incorretas (Insira exatamente 3 separadas por vírgula)</label>
                    <input 
                        id="wrongAnswers"
                        type="text"
                        value={wrongAnswers}
                        onChange={(e) => setWrongAnswers(e.target.value)}
                        placeholder="Ex: 3, 5, 2"
                        required
                        className="form-input"
                    />
                </div>

                <div className="form-action" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                    <button type="submit" className="btn-submit" disabled={loading || saved}>
                        {saved ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <i className="pi pi-check-circle" style={{ marginRight: "8px", fontSize: "1.1rem" }}></i>
                                Questão salva
                            </div>
                        ) : loading ? (
                            "Cadastrando..."
                        ) : (
                            "Salvar Questão"
                        )}
                    </button>
                    {saved && (
                        <p className="success-msg" style={{ color: "var(--color5)", fontSize: "0.9rem", margin: "5px 0 0 0", fontWeight: "600", textAlign: "center" }}>
                            Questão cadastrada com sucesso!
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
}

function AdminPage({ onNavigate }) {
    const [totalUsuarios, setTotalUsuarios] = useState(0);
    const [totalQuestoes, setTotalQuestoes] = useState(0);
    const [listaConteudos, setListaConteudos] = useState([]);

    const carregarDadosDoPainel = async () => {
        try {
            const resUsuarios = await fetch("http://localhost:8080/api/usuarios");
            if (resUsuarios.ok) {
                const dadosUsuarios = await resUsuarios.json();
                setTotalUsuarios(dadosUsuarios.length);
            }

            const resConteudos = await fetch("http://localhost:8080/api/conteudos");
            if (resConteudos.ok) {
                const dadosConteudos = await resConteudos.json();
                setListaConteudos(dadosConteudos);
            }

            const resQuestoes = await fetch("http://localhost:8080/api/questoes/conteudo"); 
            if (resQuestoes.ok) {
                const dadosQuestoes = await resQuestoes.json();
                setTotalQuestoes(dadosQuestoes.length);
            }
        } catch (error) {
            console.error("Erro ao carregar métricas do banco:", error);
        }
    };

    useEffect(() => {
        carregarDadosDoPainel();
    }, []);

    return (
        <div className="admin-container">
            <SideBar onNavigate={onNavigate} />
            <main className="admin-main">
                <header className="admin-header">
                    <div>
                        <h1>Painel do Administrador</h1>
                        <p>Gerenciamento de dados da plataforma</p>
                    </div>
                </header>

                <div className="admin-content">
                    <div className="metrics-grid">
                        <MetricCard
                            icon="pi pi-users"
                            label="Total de Usuários"
                            value={totalUsuarios.toString()}
                            iconColor="#0f9b6b"
                        />
                        <MetricCard
                            icon="pi pi-book"
                            label="Total de Questões"
                            value={totalQuestoes.toString()}
                            iconColor="#0f9b6b"
                        />
                    </div>
                </div>

                <div className="form-wrapper">
                    <QuestionForm 
                        onQuestionCreated={carregarDadosDoPainel} 
                        listaConteudos={listaConteudos} 
                    />
                </div>
            </main>
        </div>
    );
}

export default AdminPage;