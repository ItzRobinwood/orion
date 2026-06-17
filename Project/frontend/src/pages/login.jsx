import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../index.css';

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
    e.preventDefault();

    try {
        const response = await fetch('URL_DA_API/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json(); // Data from backend containing user info and token
            
            // 2. Extract the user's role sent by your Neon backend
            const userType = data.idtipo; 

            if (userType === 1) {
                navigate('/adminDashboard');
            } else if (userType === 2) {
                navigate('/managerDashboard');
            } else if (userType === 3) {
                navigate('/clientDashboard');
            } else {
                alert('Acesso não autorizado: Tipo de utilizador inválido.');
            }
        } else {
            alert('Credenciais inválidas.');
        }
    } catch (error) {
        console.error("Login connection error:", error);
        alert('Server connection failed.');
    }
};

    return (
        <div className="vh-100 d-flex">
            <div className="row g-0 w-100 h-100">

                {/* Painel lateral */}
                <div className="col-md-4 d-flex flex-column justify-content-between p-4 sidebar-panel">
                    <div>
                        <i className="bi bi-shield-lock fs-1 shield-icon"></i>

                        <h2 className="fw-bold mt-3 cyberbox-title">
                            CyberBox
                        </h2>

                        <p className="sidebar-description">
                            Segurança cibernética para empresas modernas.
                        </p>

                        <ul className="list-unstyled mt-3 sidebar-list">
                            <li>✓ Conformidade e segurança digital</li>
                            <li>✓ Controlo e prevenção de ameaças</li>
                            <li>✓ Infraestrutura tecnológica segura</li>
                        </ul>
                    </div>

                    <small className="sidebar-footer">© 2026 CyberBox</small>
                </div>

                {/* Formulário */}
                <div className="col-md-8 d-flex flex-column justify-content-center p-5 form-section">

                    <div className="login-container">

                        <h3 className="fw-bold mb-1">Login</h3>

                        <p className="text-muted mb-4 login-subtitle">
                            Aceda à sua conta de forma segura.
                        </p>

                        <form onSubmit={handleLogin}>

                            <div className="mb-3">
                                <label className="form-label fw-semibold form-label-custom">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="nome@empresa.pt"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="mb-2">
                                <label className="form-label fw-semibold form-label-custom">
                                    Palavra-passe
                                </label>

                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <div className="text-end mb-3">
                                <a href="#" className="text-decoration-none forgot-password">
                                    Esqueceu a palavra-passe?
                                </a>
                            </div>

                            <button
                                type="submit"
                                className="login-button w-100 text-white mb-3"
                            >
                                Entrar
                            </button>

                        </form>

                        <p className="text-center mt-3 text-muted register-text">
                            Não tem conta?
                            <a href="#" className="text-decoration-none">
                                {' '}Fale connosco
                            </a>
                        </p>

                    </div>
                </div>

            </div>
        </div>
    );
}

export default Login;