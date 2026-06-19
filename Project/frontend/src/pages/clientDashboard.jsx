import axios from 'axios';
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const API = "https://orion-dewp.onrender.com/api";

export default function ClientDashboard() {
    const [active, setActive] = useState("dashboard");

    const nav = [
        { id: "dashboard", label: "Dashboard" },
        { id: "report", label: "Avaliação de Risco" },
        { id: "docs", label: "Documentação" },
        { id: "tickets", label: "Tickets" },
        { id: "requests", label: "Pedidos" },
        { id: "settings", label: "Configurações" },
        
    ];

    const renderContent = () => {
        switch (active) {
            case "dashboard": return <Dashboard setActive={setActive} />;
            case "report": return <Report />;
            case "docs": return <Docs />;
            case "tickets": return <Tickets />;
            case "requests": return <Requests />;
            case "settings": return <Settings />;
            default: return null;
        }
    };

    return (
        <div className="d-flex vh-100">
            <div className="bg-dark text-white p-3 d-flex flex-column" style={{ width: 250 }}>
                <h4 className="mb-1">CyberBox</h4>
                <small className="text-secondary mb-4">Portal do Cliente</small>
                {nav.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActive(item.id)}
                        className={`btn w-100 mb-2 text-start ${active === item.id ? "btn-primary" : "btn-outline-light"}`}
                    >
                        {item.label}
                    </button>
                ))}
                <div className="mt-auto pt-4">
                    <div className="d-flex align-items-center gap-2 mb-2">
                        <img src="https://i.pravatar.cc/32" className="rounded-circle" alt="cliente" />
                        <div>
                            <div className="small text-white fw-semibold">João Pereira</div>
                            <div className="small text-secondary">TechCorp</div>
                        </div>
                    </div>
                    <small className="text-secondary">© 2026 CyberBox</small>
                </div>
            </div>

            <div className="flex-grow-1 bg-light p-4 overflow-auto">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="m-0">{nav.find(n => n.id === active)?.label}</h4>
                    <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-primary">Cliente</span>
                        <img src="https://i.pravatar.cc/40" className="rounded-circle" alt="cliente" />
                    </div>
                </div>
                {renderContent()}
            </div>
        </div>
    );
}

/* ───────────────────────── DASHBOARD ───────────────────────── */
function Dashboard({ setActive }) {
    return (
        <>
            <div className="row g-3 mb-4">
                <StatCard title="Nível de Risco" value="Médio" color="warning" />
                <StatCard title="Documentos" value="12" color="primary" />
                <StatCard title="Pedidos Ativos" value="3" color="info" />
                <StatCard title="Tickets Abertos" value="1" color="danger" />
            </div>

            <div className="row g-3">
                <div className="col-md-6">
                    <div className="card p-3">
                        <h6 className="mb-3">Atividade Recente</h6>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item d-flex justify-content-between">
                                <span>Relatório Q1 disponível</span>
                                <small className="text-muted">Hoje</small>
                            </li>
                            <li className="list-group-item d-flex justify-content-between">
                                <span>Pedido #P002 em análise</span>
                                <small className="text-muted">Ontem</small>
                            </li>
                            <li className="list-group-item d-flex justify-content-between">
                                <span>Ticket #T001 respondido</span>
                                <small className="text-muted">12/05/2026</small>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card p-3">
                        <h6 className="mb-3">Acesso Rápido</h6>
                        <div className="d-flex flex-column gap-2">
                            {[
                                { label: "Ver Avaliação de Risco", tab: "report" },
                                { label: "Ver Documentos Partilhados", tab: "docs" },
                                { label: "Abrir Ticket de Suporte", tab: "tickets" },
                                { label: "Submeter Novo Pedido", tab: "requests" },
                            ].map(({ label, tab }) => (
                                <button key={tab} className="btn btn-outline-dark btn-sm text-start"
                                    onClick={() => setActive(tab)}>
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

/* ───────────────────────── REPORT ───────────────────────── */
function Report() {
    const reports = [
        { id: 1, title: "Relatório de Risco Q1 2026", date: "01/04/2026", risk: "Médio", score: 62 },
        { id: 2, title: "Relatório de Risco Q4 2025", date: "01/01/2026", risk: "Alto", score: 78 },
        { id: 3, title: "Relatório de Risco Q3 2025", date: "01/10/2025", risk: "Baixo", score: 35 },
    ];

    const riskColor = { Alto: "danger", Médio: "warning", Baixo: "success" };

    return (
        <>
            <div className="card p-4 mb-4">
                <div className="row align-items-center">
                    <div className="col-md-4 text-center">
                        <div style={{ fontSize: 64, fontWeight: 700, color: "#ffc107" }}>62</div>
                        <div className="text-muted" style={{ fontSize: 13 }}>Score de Risco Atual</div>
                        <span className="badge bg-warning text-dark mt-1">Risco Médio</span>
                    </div>
                    <div className="col-md-8">
                        <h6 className="mb-3">Áreas de Risco</h6>
                        {[
                            { label: "Segurança de Rede", value: 70 },
                            { label: "Gestão de Acessos", value: 55 },
                            { label: "Proteção de Dados", value: 80 },
                            { label: "Continuidade de Negócio", value: 45 },
                        ].map(({ label, value }) => (
                            <div className="mb-2" key={label}>
                                <div className="d-flex justify-content-between mb-1" style={{ fontSize: 13 }}>
                                    <span>{label}</span><span>{value}%</span>
                                </div>
                                <div className="progress" style={{ height: 6 }}>
                                    <div className="progress-bar"
                                        style={{ width: `${value}%`, background: value > 65 ? "#dc3545" : value > 45 ? "#ffc107" : "#198754" }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="card p-3">
                <h6 className="mb-3">Histórico de Relatórios</h6>
                <table className="table">
                    <thead>
                        <tr><th>Relatório</th><th>Data</th><th>Risco</th><th>Score</th><th>Ação</th></tr>
                    </thead>
                    <tbody>
                        {reports.map(r => (
                            <tr key={r.id}>
                                <td style={{ fontWeight: 600 }}>{r.title}</td>
                                <td style={{ fontSize: 13, color: "#6b7280" }}>{r.date}</td>
                                <td><span className={`badge bg-${riskColor[r.risk]}`}>{r.risk}</span></td>
                                <td>{r.score}</td>
                                <td><button className="btn btn-sm btn-outline-dark">Download</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

/* ───────────────────────── DOCUMENTAÇÃO ───────────────────────── */
// Lista de ficheiros partilhados pela CyberBox com o cliente.
// O cliente só faz download — os ficheiros são carregados pelo admin/gestor.
function Docs() {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("Todos");

    const DOC_TYPES = ["Todos", "Relatório", "Pentest", "Política", "Procedimento", "Outro"];

    useEffect(() => {
        fetchDocs();
    }, []);

    const fetchDocs = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API}/requests/files`);
            const data = res.data?.files || res.data;
            if (Array.isArray(data)) setDocs(data);
        } catch (err) {
            console.error("Erro ao carregar documentos:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (fileId, fileName) => {
        try {
            const response = await axios({
                url: `${API}/requests/files/download/${fileId}`,
                method: "GET",
                responseType: "blob",
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName || "documento");
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error("Erro ao descarregar:", err);
            alert("Não foi possível descarregar o ficheiro.");
        }
    };

    // Inferir o tipo de documento pelo nome do ficheiro
    const inferType = (fileName) => {
        if (!fileName) return "Outro";
        const name = fileName.toLowerCase();
        if (name.includes("relat")) return "Relatório";
        if (name.includes("pentest")) return "Pentest";
        if (name.includes("politic")) return "Política";
        if (name.includes("proced")) return "Procedimento";
        return "Outro";
    };

    const typeColor = {
        "Relatório": "primary",
        "Pentest": "danger",
        "Política": "warning",
        "Procedimento": "info",
        "Outro": "secondary",
    };

    const filtered = filter === "Todos"
        ? docs
        : docs.filter(f => inferType(f.fileName) === filter);

    return (
        <div className="card p-3">
            <div className="mb-3">
                <h6 className="mb-1 fw-bold">Documentos Partilhados</h6>
                <p className="text-muted small mb-3">
                    Ficheiros e relatórios disponibilizados pela CyberBox para a tua empresa.
                </p>

                {/* Filtros por tipo */}
                <div className="d-flex gap-2 flex-wrap">
                    {DOC_TYPES.map(t => (
                        <button key={t}
                            onClick={() => setFilter(t)}
                            className={`btn btn-sm ${filter === t ? "btn-dark" : "btn-outline-secondary"}`}>
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <p className="text-muted">A carregar documentos...</p>
            ) : filtered.length === 0 ? (
                <div className="text-center text-muted py-5 border rounded">
                    <div style={{ fontSize: 32 }}>📂</div>
                    <p className="mt-2 mb-0">Nenhum documento disponível.</p>
                    <small>A CyberBox ainda não partilhou ficheiros contigo.</small>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-dark">
                            <tr>
                                <th>Documento</th>
                                <th>Tipo</th>
                                <th>Pedido</th>
                                <th>Data</th>
                                <th>Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(f => (
                                <tr key={f.id}>
                                    <td className="fw-semibold">
                                        📄 {f.fileName || "Sem nome"}
                                    </td>
                                    <td>
                                        <span className={`badge bg-${typeColor[inferType(f.fileName)]}`}>
                                            {inferType(f.fileName)}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="badge bg-light text-dark border">
                                            Pedido #{f.requestId || "—"}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: 13, color: "#6b7280" }}>
                                        {f.uploadedAt
                                            ? new Date(f.uploadedAt).toLocaleDateString("pt-PT")
                                            : "—"}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-dark"
                                            onClick={() => handleDownload(f.id, f.fileName)}>
                                            📥 Download
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

/* ───────────────────────── TICKETS ───────────────────────── */
// Comunicação direta com o suporte CyberBox.
// Usado para dúvidas, problemas técnicos e reporte de incidentes.
// Substitui a função Tickets() no clientDashboard.jsx por esta

function Tickets() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [expanded, setExpanded] = useState(null);
    const [form, setForm] = useState({ subject: "" });
    const [replyText, setReplyText] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [messages, setMessages] = useState({});

    const activeUserId = parseInt(localStorage.getItem("userId")) || 1;

    const statusColor = { Respondido: "success", Pendente: "warning" };

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API}/questions`);
            setTickets(res.data.questions || []);
        } catch (err) {
            console.error("Erro ao carregar tickets:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleExpand = async (ticketId) => {
        if (expanded === ticketId) {
            setExpanded(null);
            return;
        }
        setExpanded(ticketId);
        if (!messages[ticketId]) {
            try {
                const res = await axios.get(`${API}/questions/${ticketId}/messages`);
                setMessages(prev => ({ ...prev, [ticketId]: res.data.messages || [] }));
            } catch (err) {
                console.error("Erro ao carregar mensagens:", err);
            }
        }
    };

    const handleCreate = async () => {
        if (!form.subject.trim()) {
            alert("O assunto é obrigatório.");
            return;
        }
        setSubmitting(true);
        try {
            await axios.post(`${API}/questions`, {
                subject: form.subject,
                creatorId: Number(activeUserId)
            });
            setForm({ subject: "" });
            setShowForm(false);
            await fetchTickets();
        } catch (err) {
            alert("Erro ao criar ticket.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleReply = async (ticketId) => {
        if (!replyText.trim()) return;
        try {
            await axios.post(`${API}/questions/${ticketId}/reply`, {
                message: replyText,
                userId: Number(activeUserId)
            });
            setReplyText("");
            await fetchTickets();
        } catch (err) {
            alert("Erro ao enviar mensagem.");
        }
    };

    if (loading) return <div className="card p-3"><p className="text-muted">A carregar tickets...</p></div>;

    return (
        <div className="d-flex flex-column gap-3">

            {/* Header */}
            <div className="card p-3">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 className="mb-0 fw-bold">Tickets de Suporte</h6>
                        <p className="text-muted small mb-0">
                            Dúvidas, problemas técnicos ou reporte de incidentes.
                        </p>
                    </div>
                    <button className="btn btn-sm btn-dark"
                        onClick={() => setShowForm(!showForm)}>
                        {showForm ? "Cancelar" : "+ Novo Ticket"}
                    </button>
                </div>

                {/* Formulário de criação */}
                {showForm && (
                    <div className="border rounded p-3 mt-3 bg-light">
                        <label className="form-label fw-semibold" style={{ fontSize: 12 }}>
                            Assunto *
                        </label>
                        <input
                            className="form-control form-control-sm mb-3"
                            placeholder="Descreve brevemente o problema ou dúvida"
                            value={form.subject}
                            onChange={e => setForm({ subject: e.target.value })}
                        />
                        <button className="btn btn-sm btn-success"
                            onClick={handleCreate} disabled={submitting}>
                            {submitting ? "A criar..." : "Criar Ticket"}
                        </button>
                    </div>
                )}
            </div>

            {/* Lista de tickets */}
            {tickets.length === 0 ? (
                <div className="text-center text-muted py-5 border rounded bg-white">
                    <div style={{ fontSize: 32 }}>🎫</div>
                    <p className="mt-2 mb-0">Nenhum ticket aberto.</p>
                    <small>Clica em "+ Novo Ticket" para submeter uma questão.</small>
                </div>
            ) : (
                tickets.map(t => (
                    <div key={t.id} className="card p-3 border-start border-4"
                        style={{ borderLeftColor: t.status === "Respondido" ? "#198754" : "#ffc107" }}>

                        {/* Cabeçalho do ticket */}
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <div className="d-flex align-items-center gap-2 mb-1">
                                    <span className="fw-semibold">#{t.id} — {t.subject}</span>
                                    <span className={`badge bg-${statusColor[t.status] || "secondary"}`}>
                                        {t.status}
                                    </span>
                                </div>
                                <small className="text-muted">
                                    Submetido em {t.date}
                                    {t.assignedTo !== "Sem atribuição" && (
                                        <> · Atribuído a <strong>{t.assignedTo}</strong></>
                                    )}
                                </small>
                            </div>
                            <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => handleExpand(t.id)}>
                                {expanded === t.id ? "Fechar" : "Ver conversa"}
                            </button>
                        </div>

                        {/* Preview da última resposta */}
                        {t.status === "Respondido" && expanded !== t.id && (
                            <div className="mt-2 p-2 bg-light rounded border small text-muted">
                                💬 {t.lastReply}
                            </div>
                        )}

                        {/* Conversa expandida */}
                        {expanded === t.id && (
                            <div className="mt-3 border-top pt-3">

                                {/* Mensagens */}
                                <div className="d-flex flex-column gap-2 mb-3" style={{ maxHeight: 300, overflowY: "auto" }}>
                                    {(messages[t.id] || []).length === 0 ? (
                                        <p className="text-muted small">Ainda sem mensagens. Aguarda resposta da CyberBox.</p>
                                    ) : (
                                        (messages[t.id] || []).map(m => (
                                            <div key={m.id}
                                                className={`p-2 rounded small ${m.userId === Number(activeUserId) ? "bg-primary text-white ms-5" : "bg-light border me-5"}`}>
                                                <div className="fw-semibold mb-1" style={{ fontSize: 11 }}>
                                                    {m.sender?.name || "Utilizador"}
                                                </div>
                                                {m.message}
                                                <div className="mt-1 opacity-75" style={{ fontSize: 10 }}>
                                                    {m.sentAt ? new Date(m.sentAt).toLocaleString("pt-PT") : ""}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Campo de resposta */}
                                {t.status !== "closed" && (
                                    <div className="d-flex gap-2">
                                        <input
                                            className="form-control form-control-sm"
                                            placeholder="Escreve uma mensagem..."
                                            value={replyText}
                                            onChange={e => setReplyText(e.target.value)}
                                            onKeyDown={e => e.key === "Enter" && handleReply(t.id)}
                                        />
                                        <button className="btn btn-sm btn-primary"
                                            onClick={async () => {
                                                await handleReply(t.id);
                                                const res = await axios.get(`${API}/questions/${t.id}/messages`);
                                                setMessages(prev => ({ ...prev, [t.id]: res.data.messages || [] }));
                                            }}>
                                            Enviar
                                        </button>
                                    </div>
                                )}

                                {t.status === "closed" && (
                                    <div className="alert alert-secondary py-2 small">
                                        🔒 Este ticket está fechado.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}


/* ───────────────────────── PEDIDOS ───────────────────────── */
// O cliente solicita um serviço à CyberBox (pentest, auditoria, NIS2, etc.)
// Tem formulário de submissão e histórico com estado.
function Requests() {
    const TYPE_FIELDS = {
        1: {
            label: "Report de Incidente",
            fields: [
                { key: "incidentDate", label: "Data do Incidente *", type: "date" },
                {
                    key: "incidentType", label: "Tipo de Incidente *", type: "select",
                    options: ["Acesso não autorizado", "Malware / Ransomware", "Phishing", "DoS/DDoS", "Fuga de informação", "Outro"]
                },
                { key: "details", label: "Descrição detalhada *", type: "textarea" },
                {
                    key: "impact", label: "Impacto estimado", type: "select",
                    options: ["Baixo", "Médio", "Alto", "Crítico"]
                },
                { key: "systems", label: "Sistemas Afetados", type: "text", placeholder: "Ex: Servidor Web, Email..." },
                { key: "actions", label: "Ações Imediatas Tomadas", type: "textarea" },
            ]
        },
        2: {
            label: "Pentest",
            fields: [
                {
                    key: "scope", label: "Âmbito do Teste *", type: "select",
                    options: ["Rede interna", "Aplicação Web", "Engenharia social", "Físico", "Outro"]
                },
                { key: "targets", label: "Sistemas Alvo (IPs/URLs) *", type: "text", placeholder: "Ex: 192.168.1.0/24" },
                { key: "objectives", label: "Objetivos Principais *", type: "textarea" },
                { key: "startDate", label: "Data Pretendida", type: "date" },
            ]
        },
        3: {
            label: "Documentação",
            fields: [
                {
                    key: "docType", label: "Tipo de Documento *", type: "select",
                    options: ["Política de Segurança", "Plano de Continuidade", "Procedimento", "Manual", "Outro"]
                },
                { key: "context", label: "Contexto / Requisitos *", type: "textarea" },
            ]
        },
        4: {
            label: "Ativos Tecnológicos",
            fields: [
                { key: "assetName", label: "Nome do Ativo *", type: "text", placeholder: "Ex: Servidor Web Principal" },
                {
                    key: "assetType", label: "Tipo de Ativo *", type: "select",
                    options: ["Servidor", "Workstation", "Rede", "Aplicação", "Cloud", "Outro"]
                },
                { key: "ip", label: "Endereço IP / Subrede", type: "text", placeholder: "Ex: 192.168.1.10" },
                { key: "location", label: "Localização", type: "text", placeholder: "Ex: Datacenter A, AWS" },
                { key: "notes", label: "Notas Adicionais", type: "textarea" },
            ]
        },
        5: {
            label: "Outros",
            fields: [
                { key: "subtype", label: "Especifique o Assunto *", type: "text", placeholder: "Descreve brevemente o tipo de pedido" },
                { key: "details", label: "Descrição do Pedido *", type: "textarea" },
            ]
        },
        6: {
            label: "NIS2",
            fields: [
                {
                    key: "nis2Area", label: "Área NIS2 Relacionada *", type: "select",
                    options: ["Gestão de Risco", "Resposta a Incidentes", "Segurança da Cadeia de Fornecimento", "Criptografia", "Continuidade de Negócio", "Outro"]
                },
                { key: "deadline", label: "Prazo Limite de Conformidade", type: "date" },
                { key: "context", label: "Descrição / Contexto Atual *", type: "textarea" },
                {
                    key: "compliance", label: "Estado Atual de Conformidade", type: "select",
                    options: ["Conforme", "Parcialmente conforme", "Não conforme", "Em avaliação"]
                },
            ]
        },
    };

    const REQUEST_TYPES = [
        { id: 1, name: "Report de Incidente" },
        { id: 2, name: "Pentest" },
        { id: 3, name: "Documentação" },
        { id: 4, name: "Ativos Tecnológicos" },
        { id: 5, name: "Outros" },
        { id: 6, name: "NIS2" },
    ];

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [typeId, setTypeId] = useState("");
    const [formData, setFormData] = useState({});
    const [file, setFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [search, setSearch] = useState("");

    const filtered = requests.filter(r =>
        !search || (r.subject || "").toLowerCase().includes(search.toLowerCase())
    );

    const statusColor = {
        "Pendente": "warning",
        "Em Execução": "info",
        "Concluído": "success",
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API}/requests`);
            setRequests(res.data.requests || []);
        } catch (err) {
            console.error("Erro ao carregar pedidos:", err);
        } finally {
            setLoading(false);
        }
    };

    const currentConfig = typeId ? TYPE_FIELDS[typeId] : null;

    const handleField = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

    const handleTypeChange = (val) => {
        setTypeId(val);
        setFormData({});
        setFile(null);
        setSubmitted(false);
    };

    const handleSubmit = async () => {
        if (!typeId) { alert("Seleciona o tipo de pedido."); return; }

        const requiredFields = currentConfig.fields.filter(f => f.label.includes("*")).map(f => f.key);
        const missing = requiredFields.find(k => !formData[k] || formData[k].trim() === "");
        if (missing) { alert("Preenche todos os campos obrigatórios (*)."); return; }

        setSubmitting(true);
        try {
            const formattedDescription = Object.entries(formData)
                .map(([key, val]) => {
                    const fieldLabel = currentConfig.fields.find(f => f.key === key)?.label.replace(" *", "") || key;
                    return `${fieldLabel}: ${val}`;
                })
                .join("\n");

            const activeUserId = parseInt(localStorage.getItem("userId")) || 1;

            let res;
            if (file) {
                const multiPartForm = new FormData();
                multiPartForm.append("requestTypeId", Number(typeId));
                multiPartForm.append("subject", currentConfig.label.substring(0, 200));
                multiPartForm.append("description", formattedDescription);
                multiPartForm.append("creatorId", Number(activeUserId));
                multiPartForm.append("file", file);
                res = await axios.post(`${API}/requests`, multiPartForm, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            } else {
                res = await axios.post(`${API}/requests`, {
                    requestTypeId: Number(typeId),
                    subject: currentConfig.label.substring(0, 200),
                    description: formattedDescription,
                    creatorId: Number(activeUserId),
                });
            }

            if (res.status === 200 || res.status === 201 || res.data?.success) {
                setSubmitted(true);
                setFormData({});
                setTypeId("");
                setFile(null);
                setShowForm(false);
                await fetchRequests();
            }
        } catch (err) {
            alert(err.response?.data?.message || "Erro ao submeter pedido.");
        } finally {
            setSubmitting(false);
        }
    };

    const renderField = (field) => {
        const val = formData[field.key] || "";
        if (field.type === "select") return (
            <select className="form-select form-select-sm" value={val}
                onChange={e => handleField(field.key, e.target.value)}>
                <option value="">Selecionar...</option>
                {field.options.map(o => <option key={o}>{o}</option>)}
            </select>
        );
        if (field.type === "textarea") return (
            <textarea className="form-control form-control-sm" rows={3}
                placeholder={field.placeholder || ""}
                value={val} onChange={e => handleField(field.key, e.target.value)} />
        );
        return (
            <input type={field.type} className="form-control form-control-sm"
                placeholder={field.placeholder || ""}
                value={val} onChange={e => handleField(field.key, e.target.value)} />
        );
    };

    return (
        <div className="d-flex flex-column gap-3">

            {/* Botão para abrir formulário */}
            <div className="card p-3">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 className="mb-0 fw-bold">Pedidos de Serviço</h6>
                        <p className="text-muted small mb-0">Solicita um serviço à CyberBox — pentest, auditoria, consultoria NIS2, entre outros.</p>
                    </div>
                    <button className="btn btn-sm btn-dark" onClick={() => { setShowForm(!showForm); setSubmitted(false); }}>
                        {showForm ? "Cancelar" : "+ Novo Pedido"}
                    </button>
                </div>

                {/* Formulário de submissão */}
                {showForm && (
                    <div className="mt-3 border-top pt-3">
                        {submitted && (
                            <div className="alert alert-success mb-3">✅ Pedido submetido com sucesso!</div>
                        )}

                        <label className="form-label fw-semibold mb-2">Que tipo de serviço pretendes solicitar? *</label>
                        <div className="d-flex flex-wrap gap-2 mb-3">
                            {REQUEST_TYPES.map(t => (
                                <button key={t.id} type="button"
                                    onClick={() => handleTypeChange(String(t.id))}
                                    className={`btn btn-sm ${typeId === String(t.id) ? "btn-dark" : "btn-outline-secondary"}`}>
                                    {t.name}
                                </button>
                            ))}
                        </div>

                        {currentConfig && (
                            <>
                                <div className="row g-3 mb-3">
                                    {currentConfig.fields.map(field => (
                                        <div key={field.key} className={field.type === "textarea" ? "col-12" : "col-md-6"}>
                                            <label className="form-label fw-semibold" style={{ fontSize: 12 }}>{field.label}</label>
                                            {renderField(field)}
                                        </div>
                                    ))}
                                    <div className="col-12">
                                        <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Anexar Documento de Suporte (opcional)</label>
                                        <input type="file" className="form-control form-control-sm" style={{ maxWidth: 400 }}
                                            onChange={e => setFile(e.target.files[0])} />
                                        {file && <small className="text-success mt-1 d-block">📎 {file.name}</small>}
                                    </div>
                                </div>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-sm btn-success" onClick={handleSubmit} disabled={submitting}>
                                        {submitting ? "A submeter..." : "Submeter Pedido"}
                                    </button>
                                    <button className="btn btn-sm btn-outline-secondary"
                                        onClick={() => { setTypeId(""); setFormData({}); setFile(null); }}>
                                        Limpar
                                    </button>
                                </div>
                            </>
                        )}

                        {!typeId && (
                            <p className="text-muted small">Clica num dos botões acima para abrir o formulário.</p>
                        )}
                    </div>
                )}
            </div>

            {/* Histórico de pedidos */}
            <div className="card p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="fw-bold mb-0">Histórico de Pedidos</h6>
                    <input
                        className="form-control form-control-sm"
                        style={{ maxWidth: 260 }}
                        placeholder="🔍 Pesquisar por nome..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                {loading ? (
                    <p className="text-muted">A carregar...</p>
                ) : filtered.length === 0 ? (
                    <div className="text-center text-muted py-4 border rounded">
                        <div style={{ fontSize: 32 }}>📋</div>
                        <p className="mt-2 mb-0">Nenhum pedido encontrado.</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Tipo</th>
                                    <th>Data</th>
                                    <th>Estado</th>
                                    <th>Atribuído a</th>
                                    <th>Descrição</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(r => (
                                    <tr key={r.id}>
                                        <td className="fw-semibold text-primary">#{r.id}</td>
                                        <td className="fw-semibold">{r.subject || "—"}</td>
                                        <td>{r.type_name || r.type || "—"}</td>
                                        <td style={{ fontSize: 13, color: "#6b7280" }}>{r.date}</td>
                                        <td>
                                            <span className={`badge bg-${statusColor[r.status] || "secondary"}`}>
                                                {r.status || "Pendente"}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: 13 }}>
                                            {r.assignedToName || <span className="text-muted fst-italic">Por atribuir</span>}
                                        </td>
                                        <td style={{ fontSize: 13, color: "#6b7280", maxWidth: 200 }}>
                                            {r.description ? r.description.length > 250 ? r.description.slice(0, 250) + "..." : r.description : "—"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

//CONFIGURAÇÕES DE CONTA

function Settings() {
    const [form, setForm] = useState({ current: "", newPw: "", confirm: "" });
    const [strength, setStrength] = useState(0);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const activeUserId = parseInt(localStorage.getItem("userId")) || 1;

    const checkStrength = (pw) => {
        let score = 0;
        if (pw.length >= 8) score++;
        if (/[A-Z]/.test(pw)) score++;
        if (/[0-9]/.test(pw)) score++;
        if (/[^A-Za-z0-9]/.test(pw)) score++;
        return score;
    };

    const handleChange = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
        if (key === "newPw") setStrength(checkStrength(value));
        setSuccess(false);
        setError("");
    };

    const strengthLabel = ["", "Fraca", "Fraca", "Média", "Forte"][strength];
    const strengthColor = strength >= 3 ? "#198754" : strength >= 2 ? "#856404" : "#842029";
    const barColor = strength <= 1 ? "#dc3545" : strength <= 2 ? "#ffc107" : "#198754";

    const handleSubmit = async () => {
        setError("");
        setSuccess(false);
        if (!form.current || !form.newPw || !form.confirm) {
            setError("Preenche todos os campos obrigatórios.");
            return;
        }
        if (form.newPw !== form.confirm) {
            setError("As novas palavras-passe não coincidem.");
            return;
        }
        if (form.newPw.length < 8) {
            setError("A nova palavra-passe deve ter pelo menos 8 caracteres.");
            return;
        }
        setSubmitting(true);
        try {
            await axios.put(`${API}/users/${activeUserId}/password`, {
                currentPassword: form.current,
                newPassword: form.newPw,
            });
            setSuccess(true);
            setForm({ current: "", newPw: "", confirm: "" });
            setStrength(0);
        } catch (err) {
            setError(err.response?.data?.message || "Erro ao alterar a palavra-passe.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="d-flex flex-column gap-3" style={{ maxWidth: 680 }}>

            {/* Perfil */}
            <div className="card p-4">
                <h6 className="fw-bold mb-1">Informação da Conta</h6>
                <p className="text-muted small mb-3">Detalhes do teu perfil.</p>
                <div className="d-flex align-items-center gap-3">
                    <img src="https://i.pravatar.cc/56" className="rounded-circle" style={{ width: 56, height: 56 }} alt="avatar" />
                    <div>
                        <div className="fw-semibold">João Pereira</div>
                        <div className="text-muted small">TechCorp · joao@techcorp.pt</div>
                    </div>
                </div>
            </div>

            {/* Alterar palavra-passe */}
            <div className="card p-4">
                <h6 className="fw-bold mb-1">Alterar palavra-passe</h6>
                <p className="text-muted small mb-3">Escolhe uma nova palavra-passe segura para a tua conta.</p>

                {success && (
                    <div className="alert alert-success py-2 small mb-3">
                        ✅ Palavra-passe alterada com sucesso.
                    </div>
                )}
                {error && (
                    <div className="alert alert-danger py-2 small mb-3">
                        ⚠️ {error}
                    </div>
                )}

                <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Palavra-passe atual *</label>
                <input
                    type="password"
                    className="form-control form-control-sm mb-3"
                    placeholder="••••••••"
                    value={form.current}
                    onChange={e => handleChange("current", e.target.value)}
                />

                <div className="row g-3 mb-3">
                    <div className="col-md-6">
                        <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Nova palavra-passe *</label>
                        <input
                            type="password"
                            className="form-control form-control-sm"
                            placeholder="••••••••"
                            value={form.newPw}
                            onChange={e => handleChange("newPw", e.target.value)}
                        />
                        {/* Barra de força */}
                        <div className="d-flex gap-1 mt-2 mb-1">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} style={{
                                    flex: 1, height: 4, borderRadius: 2,
                                    background: i <= strength ? barColor : "#e9ecef",
                                    transition: "background 0.2s"
                                }} />
                            ))}
                        </div>
                        {form.newPw && (
                            <small style={{ color: strengthColor, fontSize: 11 }}>{strengthLabel}</small>
                        )}
                        {!form.newPw && (
                            <small className="text-muted" style={{ fontSize: 11 }}>Mínimo 8 caracteres</small>
                        )}
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Confirmar nova palavra-passe *</label>
                        <input
                            type="password"
                            className="form-control form-control-sm"
                            placeholder="••••••••"
                            value={form.confirm}
                            onChange={e => handleChange("confirm", e.target.value)}
                        />
                    </div>
                </div>

                <div className="d-flex gap-2">
                    <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => { setForm({ current: "", newPw: "", confirm: "" }); setStrength(0); setError(""); setSuccess(false); }}>
                        Cancelar
                    </button>
                    <button className="btn btn-sm btn-dark" onClick={handleSubmit} disabled={submitting}>
                        {submitting ? "A guardar..." : "Guardar alterações"}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ───────────────────────── STAT CARD ───────────────────────── */
function StatCard({ title, value, color }) {
    return (
        <div className="col-md-3">
            <div className={`card text-bg-${color} p-3`}>
                <h6>{title}</h6>
                <h3>{value}</h3>
            </div>
        </div>
    );
}
