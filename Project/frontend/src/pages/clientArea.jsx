import { useNavigate } from "react-router-dom";

const roles = [
  { icon: "🔒", color: "#3c8dbc", bg: "#eaf4fb", borderColor: "#3c8dbc", title: "ADMINISTRADOR", subtitle: "Acesso total ao sistema", items: ["Gestão de empresas e contas", "Todos os clientes", "Configurações do sistema", "Logs de atividade"], path: "/login" },
  { icon: "👥", color: "#16a34a", bg: "#eaf7ee", borderColor: "#16a34a", title: "GESTOR", subtitle: "Gestão de clientes", items: ["Dashboard de gestão", "Clientes atribuídos", "Gestão de incidências", "Relatórios e analytics"], path: "/login" },
  { icon: "👤", color: "#ea580c", bg: "#fff3e8", borderColor: "#ea580c", title: "CLIENTE", subtitle: "Portal do cliente", items: ["Dashboard personalizado", "Gestão de ativos", "Incidências e alertas", "Documentos e relatórios"], path: "/login" },
];

function ClientArea() {
  const navigate = useNavigate();
  return (
    <div className="client-area-bg">
      <button className="client-area-back" onClick={() => navigate("/")}>← Voltar ao Website</button>

      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
        <div className="client-area-logo">🛡️</div>
        <h1 className="client-area-title">CyberBox Security</h1>
      </div>
      <p className="client-area-subtitle">Selecione o tipo de acesso</p>

      <div className="client-area-grid">
        {roles.map((role, i) => (
          <div key={i} className="role-card" style={{ borderTop: `4px solid ${role.borderColor}` }} onClick={() => navigate(role.path)}>
            <div className="role-icon" style={{ background: role.bg }}>{role.icon}</div>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <h3 className="role-title">{role.title}</h3>
              <p className="role-subtitle">{role.subtitle}</p>
            </div>
            <ul className="role-items">
              {role.items.map((item, j) => (
                <li key={j}>
                  <span className="role-dot" style={{ background: role.color }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="client-area-footer">© 2026 CyberBox Security — Sistema de Gestão de Cibersegurança</p>
    </div>
  );
}

export default ClientArea;