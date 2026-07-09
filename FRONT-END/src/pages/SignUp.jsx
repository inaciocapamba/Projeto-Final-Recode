import React, {useState} from "react";
import "primeicons/primeicons.css";
import "../styles/SignUp.css";

function InputField({id, label, type, icon, placeholder, value, onChange}){
    return(
        <div className="form-group">
            <label htmlFor={id} className="field-label">
                <span className={`pi ${icon} label-icon`}/>
                {label}
            </label>
            <input 
            id={id}
            type={type}
            placeholder={placeholder} 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required
            className="form-input"
            />
        </div>
    )
}

function SignUp({onNavigate}){
    const [accountType, setAccountType] = useState("student");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [adminKey, setAdminKey] = useState("");
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dadosUsuario = {
            name: name,
            email: email,
            password: password,
            accountType: accountType,
            adminKey: accountType === "admin" ? adminKey : null
        };

        try {
            const response = await fetch("http://localhost:8080/api/usuarios/cadastro", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dadosUsuario)
            });

            if (response.ok) {
                const usuarioSalvo = await response.json();
                console.log("Usuário salvo no banco H2 com sucesso:", usuarioSalvo);
                
                setSuccess(accountType);

                setTimeout(() => {
                    if (accountType === "admin") {
                        onNavigate("admin");
                    } else {
                        onNavigate("student");
                    }
                }, 2500);
            } else {
                alert("Erro ao criar conta. Verifique os dados inseridos.");
            }

        } catch (error) {
            console.error("Erro ao conectar com o backend:", error);
            alert("Não foi possível conectar ao servidor DuoTec. Certifique-se de que o Spring Boot está ligado!");
        }
    }

    return(
        <div className="signUp-screen">
            <div className="signUp-card">
                
                <div className="signUp-header">
                    <div className="signUp-logo">
                        <span className="logo-badge">DT</span>
                        <span className="logo-text">DuoTec</span>
                    </div>
                    <h1 className="signUp-title">Crie sua conta</h1>
                    <p className="signUp-subtitle">Comece a sua jornada de programação</p>
                </div>

                {success ? (
                    <div className="success-conteiner">
                        <span className="pi pi-check-circle success-icon"/>
                        <h2 className="success-title">Conta criada com sucesso!</h2>
                        <p className="success-text">
                            Você criou uma conta como{" "}
                            <span className="success-role">
                                {success === "admin" ? "Administrador": "Estudante"}
                            </span>
                            . Redirecionando...
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="signUp-form">
                        <div className="form-group">
                            <p className="field-label">Tipo de conta</p>
                            <div className="type-selector-grid">
                                <button
                                type="button"
                                onClick={() => setAccountType("student")}
                                className={`type-btn ${accountType === "student"? "active" : ""}`}
                                >
                                    <span className={`pi pi-user type-icon ${accountType === "student" ? "active" : ""}`}/>
                                    <div className="type-texts">
                                        <p className="type-title">Estudante</p>
                                        <p className="type-desc">Aprenda no seu ritmo</p>
                                    </div>
                                </button>

                                <button 
                                type="button"
                                onClick={() => setAccountType("admin")}
                                className={`type-btn ${accountType === "admin" ? "active" : ""}`}
                                >
                                    <span className={`pi pi-sliders-h type-icon ${accountType === "admin" ? "active" : ""}`}/>
                                    <div className="type-texts">
                                        <p className="type-title">Administrador</p>
                                        <p className="type-desc">Gerencie o painel</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <InputField
                        id="name"
                        label="Nome Completo"
                        type="text"
                        icon="pi-user"
                        placeholder="Seu nome Completo"
                        value={name}
                        onChange={setName}
                        />

                        <InputField
                        id="email"
                        label="E-mail"
                        type="email"
                        icon="pi-envelope"
                        placeholder="Seu@email.com"
                        value={email}
                        onChange={setEmail}
                        />

                        <InputField
                        id="password"
                        label="Senha"
                        type="password"
                        icon="pi-lock"
                        placeholder="Crie uma senha forte"
                        value={password}
                        onChange={setPassword}
                        />

                        {accountType === "admin" && (
                            <InputField
                            id="adminKey"
                            label="Chave de Acesso Admin"
                            type="password"
                            icon="pi-key"
                            placeholder="Código de liberação da instituição"
                            value={adminKey}
                            onChange={setAdminKey}
                            />
                        )}

                        <button type="submit" className="btn-submit">
                            Criar
                        </button>

                        <p className="login-redirect-text">
                            Já tem uma conta?{" | "}
                            <button
                            type="button"
                            onClick={() => onNavigate("first")}
                            className="btn-link"
                            >
                                Entrar na conta
                            </button>
                        </p>
                    </form>
                )}
            </div>
        </div>
    )
}

export default SignUp;