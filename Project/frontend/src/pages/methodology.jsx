import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";

const methodology = [
  { title: "ISO/IEC 27001", description: "Norma internacional para gestão de segurança da informação", color: "#3b82f6", bg: "#eaf2ff", icon: "🛡️" },
  { title: "NIST FRAMEWORK", description: "Framework de cibersegurança do National Institute of Standards and Technology", color: "#16a34a", bg: "#eaf7ee", icon: "📊" },
  { title: "CIS CONTROLS", description: "Conjunto prioritário de ações para defesa contra ameaças cibernéticas", color: "#9333ea", bg: "#f3e8ff", icon: "🎯" },
  { title: "ENISA GUIDELINES", description: "Recomendações da Agência Europeia para Segurança Cibernética", color: "#ea580c", bg: "#fff3e8", icon: "🏅" },
];

function Methodology() {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <main className="page-main">
        <div className="page-header">
          <span className="page-badge">ABORDAGEM TÉCNICA</span>
          <h1 className="page-title">A Nossa Metodologia</h1>
          <p className="page-subtitle">Frameworks e normas internacionais que guiam o nosso trabalho</p>
        </div>

        <div className="container py-5">
          <div className="row g-4">
            {methodology.map((m, i) => (
              <div className="col-md-6" key={i}>
                <div className="sector-card" style={{ borderLeft: `4px solid ${m.color}` }}>
                  <div className="sector-card-icon" style={{ background: m.bg }}>{m.icon}</div>
                  <div className="sector-card-title">{m.title}</div>
                  <div className="sector-card-desc">{m.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="container pb-5">
          <div className="cta-box">
            <h2 className="cta-title">QUER SABER MAIS SOBRE A NOSSA ABORDAGEM?</h2>
            <p className="cta-desc">Entre em contacto e explicamos como aplicamos estas frameworks ao seu caso.</p>
            <button className="btn-primary-custom" onClick={() => navigate("/contact")}>FALAR COM UM ESPECIALISTA →</button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Methodology;