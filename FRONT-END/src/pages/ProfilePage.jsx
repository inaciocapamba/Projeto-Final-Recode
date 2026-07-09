import React, { useState, useEffect } from "react";
import 'primeicons/primeicons.css';
import '../styles/ProfilePage.css';

function ProfilePage({ onNavegate }) {
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [message, setMessage] = useState({ text: '', type: '' });

    const buscarDadosDoPerfil = async () => {
        try {
            setLoading(true);
            const usuarioId = localStorage.getItem("usuario_id") || "1";

            const response = await fetch("http://localhost:8080/api/usuarios");

            if (response.ok) {
                const usuarios = await response.json(); 
                
                const usuarioLogado = usuarios.find((u) => u.id.toString() === usuarioId.toString());

                if (usuarioLogado) {
                    setUsuario(usuarioLogado);
                    setName(usuarioLogado.nome || usuarioLogado.name || '');
                    setEmail(usuarioLogado.email || '');
                }
            }
        } catch (error) {
            console.error("Erro ao carregar os dados do perfil: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        buscarDadosDoPerfil();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        try {
            const usuarioId = localStorage.getItem("usuario_id") || "1";

            const updatedDatas = {
                ...usuario,
                nome: name,
                name: name,
                email: email
            };

            if (newPassword.trim() !== '') {
                updatedDatas.password = newPassword;
            }

            const response = await fetch(`http://localhost:8080/api/usuarios/${usuarioId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedDatas)
            });

            if (response.ok) {
                const usuarioSalvo = await response.json(); 
                setUsuario(usuarioSalvo);
                setNewPassword('');
                setIsEditing(false);
                setMessage({ text: 'Perfil atualizado com sucesso!', type: 'success' });
            } else {
                const erroTexto = await response.text();
                setMessage({ text: erroTexto || 'Erro ao atualizar os dados no servidor.', type: 'error' });
            }

        } catch (error) {
            console.error("Erro ao salvar perfil: ", error);
            setMessage({ text: 'Não foi possível conectar ao servidor.', type: 'error' });
        }
    };

    if (loading) {
        return (
            <div className="profile-loading">
                <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem', color: '#0bb281' }}></i>
                <p>Carregando perfil...</p>
            </div>
        );
    }

    const dadosUsuario = usuario || { nome: '', name: 'Usuário', email: 'não encontrado', accountType: 'Student', lives: 0, days: 0 };
    const nomeExibicao = dadosUsuario.nome || dadosUsuario.name || 'Usuário';

    return (
        <div className="profile-container">
            <header className="profile-header">
                <button 
                    className="back-btn"
                    onClick={() => onNavegate('student')}
                >
                    <i className="pi pi-arrow-left"></i> Voltar para a Trilha
                </button>
            </header>

            <main className="profile-card">
                <div className="profile-avatar-section">
                    <div className="profile-avatar-circle">
                        {nomeExibicao ? nomeExibicao.substring(0, 2).toUpperCase() : 'DT'}
                    </div>
                    {!isEditing ? (
                        <>
                            <h2 className="profile-name">{nomeExibicao}</h2>
                            <p className="profile-email-text">{dadosUsuario.email}</p>
                        </>
                    ) : (
                        <span className="editing-badge">
                            <i className="pi pi-pencil"></i> Editando Perfil
                        </span>
                    )}
                    <span className="profile-badge-role">{dadosUsuario.accountType || 'Student'}</span>
                </div>

                <hr className="profile-divider"/>

                {message.text && (
                    <div className={`profile-alert ${message.type}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSave} className="profile-form">
                    <div className="form-group">
                        <label><i className="pi pi-user"></i> Nome</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={!isEditing} 
                            className={!isEditing ? "input-disabled" : "input-enabled"}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label><i className="pi pi-envelope"></i> E-mail</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={!isEditing}
                            className={!isEditing ? "input-disabled" : "input-enabled"}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label><i className="pi pi-lock"></i> Senha</label>
                        <input 
                            type="password" 
                            placeholder={isEditing ? "Digite uma nova senha se quiser alterar" : "••••••••••••"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            disabled={!isEditing}
                            className={!isEditing ? "input-disabled" : "input-enabled"}
                        />
                    </div>

                    <div className="profile-actions">
                        {!isEditing ? (
                            <button
                                type="button"
                                className="edit-profile-btn"
                                onClick={() => setIsEditing(true)}
                            >
                                <i className="pi pi-user-edit"></i> Editar Dados
                            </button>
                        ) : (
                            <div className="edit-buttons-group">
                                <button type="submit" className="save-profile-btn">
                                    <i className="pi pi-check"></i> Salvar
                                </button>

                                <button
                                    type="button"
                                    className="cancel-profile-btn"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setName(dadosUsuario.nome || dadosUsuario.name || '');
                                        setEmail(dadosUsuario.email || '');
                                        setNewPassword('');
                                    }}
                                >
                                    Cancelar
                                </button>
                            </div>
                        )}
                    </div>
                </form>

                {!isEditing && (
                    <button
                        className="logout-profile-btn"
                        onClick={() => {
                            localStorage.clear();
                            onNavegate('first');
                        }}
                    >
                        <i className="pi pi-sign-out"></i> Encerrar Sessão
                    </button>
                )}
            </main>
        </div>
    );
}

export default ProfilePage;