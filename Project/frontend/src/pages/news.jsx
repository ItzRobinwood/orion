import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const BASE_URL = "https://orion-dewp.onrender.com";

// Mapeia o nome do RequestType para estilos visuais
const REQUEST_TYPE_STYLES = {
  "ReportIncident":      { color: "#dc2626", bg: "#fff0f0",  border: "#dc2626" }, // vermelho — incidente
  "Pentest":             { color: "#9333ea", bg: "#f3e8ff",  border: "#9333ea" }, // roxo — segurança ofensiva
  "Documentation":       { color: "#3c8dbc", bg: "#eaf4fb",  border: "#3c8dbc" }, // azul — docs
  "Technological assets":{ color: "#d97706", bg: "#fffbeb",  border: "#d97706" }, // âmbar — assets
  "Others":              { color: "#64748b", bg: "#f1f5f9",  border: "#64748b" }, // cinzento — genérico
  "NIS2":                { color: "#16a34a", bg: "#eaf7ee",  border: "#16a34a" }, // verde — legislação
};

const STATUS_STYLES = {
  open:    { color: "#16a34a", bg: "#eaf7ee", label: "Aberto"   },
  closed:  { color: "#64748b", bg: "#f1f5f9", label: "Fechado"  },
  pending: { color: "#d97706", bg: "#fffbeb", label: "Pendente" },
};

// Filtros baseados no status do ticket
const FILTERS = ["Todos", "open", "closed", "pending"];
const FILTER_LABELS = { Todos: "Todos", open: "Abertos", closed: "Fechados", pending: "Pendentes" };

// ─── Skeleton ────────────────────────────────────────────────────────────────
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

// ─── Request Card ─────────────────────────────────────────────────────────────
function RequestCard({ request }) {
  // Compatível com Sequelize: request.RequestType.name ou request.requestType?.name
  const typeName  = request.RequestType?.name ?? request.requestType?.name ?? "Others";
  const typeStyle = REQUEST_TYPE_STYLES[typeName] ?? { color: "#64748b", bg: "#f8fafc", border: "#64748b" };

  const statusKey   = request.status ?? "open";
  const statusStyle = STATUS_STYLES[statusKey] ?? STATUS_STYLES.open;

  // Criador e responsável
  const creatorName    = request.creator?.name    ?? request.creator?.username    ?? "—";
  const assignedName   = request.assignedTo?.name ?? request.assignedTo?.username ?? "Por atribuir";

  // Data formatada
  const openedAt = request.openedAt
    ? new Date(request.openedAt).toLocaleDateString("pt-PT", { day: "2-digit", month: "short", year: "numeric" })
    : "—";

  // Subtype só aparece se existir (pedidos "Others")
  const subtype = request.subtype ? request.subtype : null;

  return (
    <div className="news-card" style={{ borderLeft: `4px solid ${typeStyle.border}` }}>
      {/* Header: tipo + status + data */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
        <span className="news-card-tag" style={{ color: typeStyle.color, background: typeStyle.bg }}>
          {typeName}
        </span>
        {subtype && (
          <span className="news-card-tag" style={{ color: "#64748b", background: "#f1f5f9", fontSize: 11 }}>
            {subtype}
          </span>
        )}
        <span
          className="news-card-tag"
          style={{ color: statusStyle.color, background: statusStyle.bg, marginLeft: "auto" }}
        >
          {statusStyle.label}
        </span>
        <span className="news-card-date">{openedAt}</span>
      </div>

      {/* Título (subject) */}
      <h2 className="news-card-title">{request.subject}</h2>

      {/* Descrição */}
      <p className="news-card-desc">{request.description}</p>

      {/* Footer: criador + responsável */}
      <div className="news-card-footer">
        <span className="news-card-author">✍️ {creatorName}</span>
        <span className="news-card-author" style={{ color: "#64748b" }}>
          👤 {assignedName}
        </span>
      </div>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
function RequestsSection() {
  const [requests, setRequests]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [activeFilter, setFilter]   = useState("Todos");
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/requests`);
      if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`);
      const data = await res.json();
      // A API devolve array directamente (request_list devolve res.json(requests))
      setRequests(Array.isArray(data) ? data : []);
      setLastUpdate(new Date().toLocaleString("pt-PT"));
    } catch (e) {
      setError(`Não foi possível carregar os pedidos: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const filtered =
    activeFilter === "Todos"
      ? requests
      : requests.filter((r) => r.status === activeFilter);

  return (
    <main className="page-main">
      <div className="page-header">
        <span className="page-badge">SUPORTE</span>
        <h1 className="page-title">Pedidos de Suporte</h1>
        <p className="page-subtitle">Consulta e acompanha todos os pedidos registados</p>
      </div>

      <div className="container py-5">
        {/* Filtros + Botão Atualizar */}
        <div
          style={{
            display: "flex", flexWrap: "wrap", alignItems: "center",
            justifyContent: "space-between", gap: 12, marginBottom: 28,
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`filter-btn ${activeFilter === f ? "active" : "inactive"}`}
              >
                {FILTER_LABELS[f]}
              </button>
            ))}
          </div>
          <button onClick={fetchRequests} disabled={loading} className="refresh-btn">
            {loading ? "⏳ A carregar..." : "🔄 Atualizar"}
          </button>
        </div>

        {/* Erro */}
        {error && (
          <div
            style={{
              background: "#fff0f0", border: "1px solid #fca5a5",
              borderRadius: 12, padding: 20, textAlign: "center",
              color: "#dc2626", marginBottom: 24,
            }}
          >
            {error}
          </div>
        )}

        {/* Cards */}
        <div className="row g-4">
          {loading
            ? Array(6).fill(null).map((_, i) => (
                <div className="col-md-6 col-lg-4" key={i}><SkeletonCard /></div>
              ))
            : filtered.length === 0
            ? (
                <div style={{ textAlign: "center", color: "#94a3b8", padding: 48, width: "100%" }}>
                  Nenhum pedido encontrado para este filtro.
                </div>
              )
            : filtered.map((req) => (
                <div className="col-md-6 col-lg-4" key={req.id}>
                  <RequestCard request={req} />
                </div>
              ))
          }
        </div>

        {/* Última atualização */}
        {lastUpdate && !loading && (
          <p style={{ textAlign: "right", fontSize: 12, color: "#94a3b8", marginTop: 24 }}>
            Última atualização: {lastUpdate}
          </p>
        )}
      </div>
    </main>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
function News() {
  return (
    <>
      <Navbar />
      <RequestsSection />
      <Footer />
    </>
  );
}

export default News;