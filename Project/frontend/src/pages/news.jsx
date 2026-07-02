import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import axios from 'axios';
import { getContent } from "../services/contentService";

const CATEGORY_STYLES = {
  Ameaças: { color: "#dc2626", bg: "#fff0f0", border: "#dc2626" },
  Vulnerabilidades: { color: "#d97706", bg: "#fffbeb", border: "#d97706" },
  "Boas práticas": { color: "#16a34a", bg: "#eaf7ee", border: "#16a34a" },
  Legislação: { color: "#3c8dbc", bg: "#eaf4fb", border: "#3c8dbc" },
  Ransomware: { color: "#dc2626", bg: "#fff0f0", border: "#dc2626" },
  Malware: { color: "#dc2626", bg: "#fff0f0", border: "#dc2626" },
  Phishing: { color: "#ea580c", bg: "#fff3e8", border: "#ea580c" },
  Incidentes: { color: "#dc2626", bg: "#fff0f0", border: "#dc2626" },
  Privacidade: { color: "#9333ea", bg: "#f3e8ff", border: "#9333ea" },
  "IA & Segurança": { color: "#9333ea", bg: "#f3e8ff", border: "#9333ea" },
  Ferramentas: { color: "#16a34a", bg: "#eaf7ee", border: "#16a34a" },
};

// Nota: os valores de FILTERS são usados para comparar com post.categoria vindo da API,
// por isso mantêm-se fixos. Se precisares de traduzir os labels dos botões sem tocar
// na lógica de filtragem, isso teria de ser feito com um mapa label/valor separado.
const FILTERS = ["Todas", "Ameaças", "Vulnerabilidades", "Boas práticas", "Legislação", "Ransomware", "Incidentes"];

function SkeletonCard() {
  return (
    <div className="news-card">
      <div style={{ height: 8 }} className="skeleton-bar" />
      <div style={{ padding: "20px 0" }}>
        <div className="skeleton-bar" style={{ height: 12, width: "40%", marginBottom: 12 }} />
        <div className="skeleton-bar" style={{ height: 16, marginBottom: 8 }} />
        <div className="skeleton-bar" style={{ height: 16, width: "80%", marginBottom: 8 }} />
        <div className="skeleton-bar" style={{ height: 13, width: "60%" }} />
      </div>
    </div>
  );
}

function NewsCard({ post }) {
  const style = CATEGORY_STYLES[post.categoria] || { color: "#64748b", bg: "#f8fafc", border: "#64748b" };
  return (
    <div className="news-card" style={{ borderLeft: `4px solid ${style.border}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <span className="news-card-tag" style={{ color: style.color, background: style.bg }}>{post.categoria}</span>
        <span className="news-card-date">{post.data}</span>
      </div>
      <h2 className="news-card-title">{post.titulo}</h2>
      <p className="news-card-desc">{post.descricao}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {(post.tags || []).map((tag, i) => <span key={i} className="news-card-tag-pill">{tag}</span>)}
      </div>
      <div className="news-card-footer">
        <span className="news-card-author">✍️ {post.autor}</span>
        {post.url && (
          <a href={post.url} target="_blank" rel="noopener noreferrer" className="news-card-link">
            {getContent("Notícias", "Card Link Texto", "Ler mais →")}
          </a>
        )}
      </div>
    </div>
  );
}

function NewsSection() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("Todas");
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // ✅ URL do Render em vez de localhost
      const { data } = await axios.get("https://orion-dewp.onrender.com/api/news");

      // ✅ data.news em vez de data
      if (data.success) {
        setPosts(data.news);
      }
      setLastUpdate(new Date().toLocaleString("pt-PT"));
    } catch (error) {
      setError(getContent("Notícias", "Erro Texto", "Não foi possível carregar as notícias. Tenta novamente."));
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNews(); }, [fetchNews]);

  const filtered = activeFilter === "Todas" ? posts : posts.filter((p) => p.categoria === activeFilter);

  return (
    <main className="page-main">
      <div className="page-header">
        <span className="page-badge">
          {getContent("Notícias", "Hero Badge", "CIBERSEGURANÇA")}
        </span>
        <h1 className="page-title">
          {getContent("Notícias", "Hero Título", "Últimas Notícias")}
        </h1>
        <p className="page-subtitle">
          {getContent("Notícias", "Hero Subtítulo", "Mantenha-se atualizado com as últimas notícias em cibersegurança")}
        </p>
      </div>

      <div className="container py-5">
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 28 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {FILTERS.map((f) => (
              <button key={f} onClick={() => setActiveFilter(f)} className={`filter-btn ${activeFilter === f ? "active" : "inactive"}`}>{f}</button>
            ))}
          </div>
          <button onClick={fetchNews} disabled={loading} className="refresh-btn">
            {loading
              ? getContent("Notícias", "Botão A Carregar", "⏳ A carregar...")
              : getContent("Notícias", "Botão Atualizar", "🔄 Atualizar")}
          </button>
        </div>

        {error && (
          <div style={{ background: "#fff0f0", border: "1px solid #fca5a5", borderRadius: 12, padding: 20, textAlign: "center", color: "#dc2626", marginBottom: 24 }}>
            {error}
          </div>
        )}

        <div className="row g-4">
          {loading
            ? Array(6).fill(null).map((_, i) => <div className="col-md-6 col-lg-4" key={i}><SkeletonCard /></div>)
            : filtered.map((post, i) => <div className="col-md-6 col-lg-4" key={i}><NewsCard post={post} /></div>)
          }
        </div>

        {lastUpdate && !loading && (
          <p style={{ textAlign: "right", fontSize: 12, color: "#94a3b8", marginTop: 24 }}>
            {getContent("Notícias", "Última Atualização Label", "Última atualização:")} {lastUpdate}
          </p>
        )}
      </div>
    </main>
  );
}

function News() {
  return (
    <>
      <Navbar />
      <NewsSection />
      <Footer />
    </>
  );
}

export default News;
