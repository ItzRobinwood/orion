import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API = "https://orion-dewp.onrender.com/api";

export default function ManagerDashboard() {
    const [active, setActive] = useState("dashboard");

    const nav = [
        { id: "dashboard", label: "Dashboard" },
        { id: "clients", label: "Clientes" },
        { id: "requests", label: "Pedidos" },
        { id: "tickets", label: "Tickets" },
        { id: "docs", label: "Documentos" },
        { id: "settings", label: "Configurações" },
    ];

    const renderContent = () => {
        switch (active) {
            case "dashboard": return <Dashboard setActive={setActive} />;
            case "clients": return <Clients />;
            case "requests": return <Requests />;
            case "tickets": return <Tickets />;
            case "docs": return <Docs />;
            case "settings": return <Settings />;
            default: return null;
        }
    };

    return (
        <div className="d-flex vh-100">
            <div className="bg-dark text-white p-3 d-flex flex-column" style={{ width: 250 }}>
                <h4 className="mb-1">CyberBox</h4>
                <small className="text-secondary mb-4">Portal do Gestor</small>
                {nav.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActive(item.id)}
                        className={`btn w-100 mb-2 text-start ${active === item.id ? "btn-primary" : "btn-outline-light"}`}
                    >
                        {item.label}
                    </button>
                ))}
                
                    <div>
                    <button
                        className="btn btn-danger w-100 mb-3"
                        onClick={() => window.location.href = "/"}
                    >
                        Sair
                    </button>
                    <small className="text-secondary">© 2026 CyberBox</small>
                </div>
            </div>

            <div className="flex-grow-1 bg-light p-4 overflow-auto">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="m-0">{nav.find(n => n.id === active)?.label}</h4>
                    <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-dark">Gestor</span>
                        <img src="https://i.pravatar.cc/40?img=12" className="rounded-circle" alt="gestor" />
                    </div>
                </div>
                {renderContent()}
            </div>
        </div>
    );
}

/* ───────────────────────── DASHBOARD ───────────────────────── */
function Dashboard({ setActive }) {
    const [stats, setStats] = useState({ clients: 0, pendingRequests: 0, openTickets: 0, docs: 0 });
    const [recentRequests, setRecentRequests] = useState([]);
    const [recentTickets, setRecentTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [reqRes, tickRes, usersRes] = await Promise.all([
                    axios.get(`${API}/requests`),
                    axios.get(`${API}/questions`),
                    axios.get(`${API}/users`),
                ]);

                const requests = reqRes.data.requests || [];
                const tickets = tickRes.data.questions || [];
                const users = usersRes.data.users || [];
                const clients = users.filter(u => u.id_tipo === 3);

                setStats({
                    clients: clients.length,
                    pendingRequests: requests.filter(r => r.status === "Pendente" || r.status === "open").length,
                    openTickets: tickets.filter(t => t.status === "Pendente").length,
                    docs: 0,
                });
                setRecentRequests(requests.slice(0, 4));
                setRecentTickets(tickets.slice(0, 4));
            } catch (err) {
                console.error("Erro ao carregar dashboard:", err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) return <div className="text-center my-5"><p className="text-muted">A carregar...</p></div>;

    const statusColor = { "Pendente": "warning", "Em Execução": "info", "Concluído": "success", "open": "warning", "in_progress": "info", "closed": "secondary" };
    const ticketColor = { "Pendente": "warning", "Respondido": "success" };

    return (
        <>
            <div className="row g-3 mb-4">
                <StatCard title="Clientes" value={stats.clients} color="primary" />
                <StatCard title="Pedidos Pendentes" value={stats.pendingRequests} color="warning" />
                <StatCard title="Tickets Abertos" value={stats.openTickets} color="danger" />
                <StatCard title="Documentos" value={stats.docs} color="secondary" />
            </div>

            <div className="row g-3">
                <div className="col-md-6">
                    <div className="card p-3 h-100">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="fw-bold mb-0">Pedidos Recentes</h6>
                            <button className="btn btn-sm btn-outline-dark" onClick={() => setActive("requests")}>Ver todos</button>
                        </div>
                        {recentRequests.length === 0 ? (
                            <p className="text-muted small">Nenhum pedido encontrado.</p>
                        ) : (
                            <ul className="list-group list-group-flush">
                                {recentRequests.map(r => (
                                    <li key={r.id} className="list-group-item d-flex justify-content-between align-items-center px-0">
                                        <div>
                                            <div className="fw-semibold" style={{ fontSize: 13 }}>{r.subject || r.title || "—"}</div>
                                            <small className="text-muted">{r.company || "—"} · {r.date}</small>
                                        </div>
                                        <span className={`badge bg-${statusColor[r.status] || "secondary"}`} style={{ fontSize: 10 }}>
                                            {r.status}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card p-3 h-100">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="fw-bold mb-0">Tickets Recentes</h6>
                            <button className="btn btn-sm btn-outline-dark" onClick={() => setActive("tickets")}>Ver todos</button>
                        </div>
                        {recentTickets.length === 0 ? (
                            <p className="text-muted small">Nenhum ticket encontrado.</p>
                        ) : (
                            <ul className="list-group list-group-flush">
                                {recentTickets.map(t => (
                                    <li key={t.id} className="list-group-item d-flex justify-content-between align-items-center px-0">
                                        <div>
                                            <div className="fw-semibold" style={{ fontSize: 13 }}>#{t.id} — {t.subject}</div>
                                            <small className="text-muted">{t.createdBy || "—"} · {t.date}</small>
                                        </div>
                                        <span className={`badge bg-${ticketColor[t.status] || "secondary"}`} style={{ fontSize: 10 }}>
                                            {t.status}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

/* ───────────────────────── CLIENTES ───────────────────────── */
function Clients() {
    const [clients, setClients] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                const [usersRes, companiesRes] = await Promise.all([
                    axios.get(`${API}/users`),
                    axios.get(`${API}/companies`),
                ]);
                const allUsers = usersRes.data.users || [];
                const allCompanies = companiesRes.data.companies || [];
                setCompanies(allCompanies);
                const mapped = allUsers
                    .filter(u => u.id_tipo === 3)
                    .map(u => {
                        const company = allCompanies.find(c => c.id === u.id_empresa);
                        return {
                            ...u,
                            id: u.id_Utilizador,
                            phone: u.telephone,
                            status: u.active ? "Ativo" : "Inativo",
                            companyName: company?.nome || "Sem empresa",
                            companyData: company || null,
                        };
                    });
                setClients(mapped);
            } catch (err) {
                console.error("Erro ao carregar clientes:", err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const filtered = clients.filter(c =>
        !search ||
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.companyName?.toLowerCase().includes(search.toLowerCase())
    );

    if (selected) {
        return <ClientDetail client={selected} onBack={() => setSelected(null)} />;
    }

    return (
        <div className="card p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h6 className="fw-bold mb-0">Clientes</h6>
                    <p className="text-muted small mb-0">Clique num cliente para ver o detalhe completo.</p>
                </div>
                <input
                    className="form-control form-control-sm"
                    style={{ maxWidth: 240 }}
                    placeholder="🔍 Pesquisar..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {loading ? (
                <p className="text-muted">A carregar clientes...</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-dark">
                            <tr>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Empresa</th>
                                <th>Estado</th>
                                <th>Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(c => (
                                <tr key={c.id}>
                                    <td className="fw-semibold">{c.name}</td>
                                    <td style={{ fontSize: 13 }}>{c.email}</td>
                                    <td>
                                        <span className="badge bg-light text-dark border">{c.companyName}</span>
                                    </td>
                                    <td>
                                        <span className={`badge ${c.status === "Ativo" ? "bg-success" : "bg-danger"}`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn btn-sm btn-outline-dark" onClick={() => setSelected(c)}>
                                            Ver detalhe
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan={5} className="text-center text-muted py-4">Nenhum cliente encontrado.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

/* ───────────────────────── DETALHE DO CLIENTE ───────────────────────── */
function ClientDetail({ client, onBack }) {
    const [tab, setTab] = useState("geral");

    const tabs = [
        { id: "geral", label: "Dados Gerais" },
        { id: "risk", label: "Avaliação de Risco" },
        { id: "assets", label: "Ativos Tecnológicos" },
        { id: "incidents", label: "Incidentes" },
        { id: "docs", label: "Documentação" },
        { id: "pentests", label: "Pen Tests" },
        { id: "others", label: "Outros" },
    ];

    return (
        <div className="d-flex flex-column gap-3">
            {/* Header */}
            <div className="card p-3">
                <div className="d-flex align-items-center gap-3">
                    <button className="btn btn-sm btn-outline-secondary" onClick={onBack}>← Voltar</button>
                    <div className="d-flex align-items-center gap-3">
                        <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-semibold"
                            style={{ width: 44, height: 44, fontSize: 16 }}>
                            {(client.name || "?").substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <div className="fw-bold" style={{ fontSize: 16 }}>{client.name}</div>
                            <div className="text-muted small">{client.companyName} · {client.email}</div>
                        </div>
                    </div>
                    <span className={`ms-auto badge ${client.status === "Ativo" ? "bg-success" : "bg-danger"}`}>
                        {client.status}
                    </span>
                </div>
            </div>

            {/* Tabs */}
            <div className="card p-3">
                <div className="d-flex flex-wrap gap-2 mb-4">
                    {tabs.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={`btn btn-sm ${tab === t.id ? "btn-dark" : "btn-outline-secondary"}`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {tab === "geral" && <ClientGeneral client={client} />}
                {tab === "risk" && <ClientRisk client={client} />}
                {tab === "assets" && <ClientRequests client={client} typeFilter="Ativos Tecnológicos" emptyLabel="Sem ativos tecnológicos registados." />}
                {tab === "incidents" && <ClientRequests client={client} typeFilter="Report de Incidente" emptyLabel="Sem incidentes reportados." />}
                {tab === "docs" && <ClientRequests client={client} typeFilter="Documentação" emptyLabel="Sem pedidos de documentação." />}
                {tab === "pentests" && <ClientRequests client={client} typeFilter="Pentest" emptyLabel="Sem pen tests realizados." />}
                {tab === "others" && <ClientRequests client={client} typeFilter="Outros" emptyLabel="Sem outros pedidos." />}
            </div>
        </div>
    );
}

function ClientGeneral({ client }) {
    const fields = [
        { label: "Nome", value: client.name },
        { label: "Email", value: client.email },
        { label: "Telefone", value: client.phone || "—" },
        { label: "Empresa", value: client.companyName },
        { label: "Estado", value: client.status },
    ];

    const company = client.companyData;

    return (
        <div className="row g-3">
            <div className="col-md-6">
                <h6 className="fw-bold mb-3 text-dark">Dados do Utilizador</h6>
                <table className="table table-sm">
                    <tbody>
                        {fields.map(f => (
                            <tr key={f.label}>
                                <td className="text-muted" style={{ fontSize: 13, width: 140 }}>{f.label}</td>
                                <td className="fw-semibold" style={{ fontSize: 13 }}>{f.value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {company && (
                <div className="col-md-6">
                    <h6 className="fw-bold mb-3 text-dark">Dados da Empresa</h6>
                    <table className="table table-sm">
                        <tbody>
                            <tr>
                                <td className="text-muted" style={{ fontSize: 13, width: 160 }}>Nome</td>
                                <td className="fw-semibold" style={{ fontSize: 13 }}>{company.nome || "—"}</td>
                            </tr>
                            <tr>
                                <td className="text-muted" style={{ fontSize: 13 }}>Resp. Segurança</td>
                                <td style={{ fontSize: 13 }}>{company.nomeResponsavelSeg || "—"}</td>
                            </tr>
                            <tr>
                                <td className="text-muted" style={{ fontSize: 13 }}>Email Resp.</td>
                                <td style={{ fontSize: 13 }}>{company.emailResponsavelSeg || "—"}</td>
                            </tr>
                            <tr>
                                <td className="text-muted" style={{ fontSize: 13 }}>Contacto Perm.</td>
                                <td style={{ fontSize: 13 }}>{company.nomeContactoPerm || "—"}</td>
                            </tr>
                            <tr>
                                <td className="text-muted" style={{ fontSize: 13 }}>Email Contacto</td>
                                <td style={{ fontSize: 13 }}>{company.emailContactoPerm || "—"}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function ClientRisk({ client }) {
    // Static risk data — replace with API call when endpoint is ready
    const areas = [
        { label: "Segurança de Rede", value: 70 },
        { label: "Gestão de Acessos", value: 55 },
        { label: "Proteção de Dados", value: 80 },
        { label: "Continuidade de Negócio", value: 45 },
    ];

    const score = 62;
    const riskLevel = score >= 70 ? "Alto" : score >= 45 ? "Médio" : "Baixo";
    const riskColor = score >= 70 ? "danger" : score >= 45 ? "warning" : "success";

    return (
        <div className="row align-items-start g-4">
            <div className="col-md-3 text-center">
                <div style={{ fontSize: 64, fontWeight: 700, color: riskColor === "danger" ? "#dc3545" : riskColor === "warning" ? "#ffc107" : "#198754" }}>
                    {score}
                </div>
                <div className="text-muted" style={{ fontSize: 13 }}>Score de Risco</div>
                <span className={`badge bg-${riskColor} ${riskColor === "warning" ? "text-dark" : ""} mt-1`}>
                    Risco {riskLevel}
                </span>
            </div>
            <div className="col-md-9">
                <h6 className="fw-bold mb-3">Áreas de Risco</h6>
                {areas.map(({ label, value }) => (
                    <div className="mb-3" key={label}>
                        <div className="d-flex justify-content-between mb-1" style={{ fontSize: 13 }}>
                            <span>{label}</span>
                            <span className="fw-semibold">{value}%</span>
                        </div>
                        <div className="progress" style={{ height: 8, borderRadius: 4 }}>
                            <div
                                className="progress-bar"
                                style={{
                                    width: `${value}%`,
                                    background: value > 65 ? "#dc3545" : value > 45 ? "#ffc107" : "#198754",
                                    borderRadius: 4,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ClientRequests({ client, typeFilter, emptyLabel }) {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await axios.get(`${API}/requests`);
                const all = res.data.requests || [];
                const filtered = all.filter(r => {
                    const matchesType = (r.type || r.type_name || "").toLowerCase().includes(typeFilter.toLowerCase()) ||
                        typeFilter.toLowerCase().includes((r.type || r.type_name || "").toLowerCase());
                    return matchesType;
                });
                setRequests(filtered);
            } catch (err) {
                console.error("Erro ao carregar pedidos:", err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [typeFilter]);

    const statusColor = { "Pendente": "warning", "Em Execução": "info", "Concluído": "success", "open": "warning", "in_progress": "info", "closed": "secondary" };

    if (loading) return <p className="text-muted small">A carregar...</p>;

    return requests.length === 0 ? (
        <div className="text-center text-muted py-4 border rounded">
            <div style={{ fontSize: 28 }}>📋</div>
            <p className="mt-2 mb-0 small">{emptyLabel}</p>
        </div>
    ) : (
        <div className="table-responsive">
            <table className="table table-hover align-middle mb-0" style={{ fontSize: 13 }}>
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Assunto</th>
                        <th>Data</th>
                        <th>Estado</th>
                        <th>Descrição</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map(r => (
                        <tr key={r.id}>
                            <td className="fw-semibold text-primary">#{r.id}</td>
                            <td className="fw-semibold">{r.subject || r.title || "—"}</td>
                            <td className="text-muted">{r.date}</td>
                            <td>
                                <span className={`badge bg-${statusColor[r.status] || "secondary"}`}>
                                    {r.status}
                                </span>
                            </td>
                            <td className="text-muted" style={{ maxWidth: 220 }}>
                                {r.description
                                    ? r.description.length > 100
                                        ? r.description.slice(0, 100) + "..."
                                        : r.description
                                    : "—"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

/* ───────────────────────── PEDIDOS ───────────────────────── */
function Requests() {
    const [requests, setRequests] = useState([]);
    const [filter, setFilter] = useState("Todos");
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const [requestFiles, setRequestFiles] = useState({});
    const managerId = Number(localStorage.getItem("userId") || 1);

    const STATUS_LABELS = { in_progress: "Em Execução", closed: "Concluído" };
    const STATUS_COLOR = { in_progress: "info", closed: "success" };

    const reloadRequests = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API}/requests`);
            const allRequests = res.data.requests || [];
            setRequests(allRequests);
        } catch (err) {
            console.error("Erro ao carregar pedidos:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { reloadRequests(); }, []);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await axios.put(`${API}/requests/${id}/status`, { status: newStatus });
            await reloadRequests();
        } catch (err) {
            alert("Erro ao alterar estado: " + (err.response?.data?.message || err.message));
        }
    };

    const fetchFiles = async (requestId) => {
        try {
            const res = await axios.get(`${API}/requests/${requestId}/files`);
            setRequestFiles(prev => ({
                ...prev,
                [requestId]: res.data || []
            }));
        } catch (err) {
            console.error("Erro ao carregar ficheiros", err);
        }
    };

    const FILTER_MAP = {
        "Todos": null,
        "Em Execução": "in_progress",
        "Concluído": "closed",
    };

    const visibleRequests = requests.filter(r =>
        r.assignedToId === managerId &&
        (r.status === "in_progress" || r.status === "closed")
    );

    const filtered = filter === "Todos"
        ? visibleRequests
        : visibleRequests.filter(r => r.status === FILTER_MAP[filter]);

    if (loading) return <div className="text-center my-5"><p className="text-muted">A carregar pedidos...</p></div>;

    return (
        <div className="d-flex flex-column gap-3">

            {/* Contadores */}
            <div className="row g-3 mb-1">
                <div className="col">
                    <div className="card p-3 text-center">
                        <div className="text-muted small">Total atribuídos</div>
                        <h4 className="fw-bold mb-0">{visibleRequests.length}</h4>
                    </div>
                </div>
                <div className="col">
                    <div className="card p-3 text-center">
                        <div className="text-muted small">Em Execução</div>
                        <h4 className="fw-bold mb-0 text-info">
                            {visibleRequests.filter(r => r.status === "in_progress").length}
                        </h4>
                    </div>
                </div>
                <div className="col">
                    <div className="card p-3 text-center">
                        <div className="text-muted small">Concluídos</div>
                        <h4 className="fw-bold mb-0 text-success">
                            {visibleRequests.filter(r => r.status === "closed").length}
                        </h4>
                    </div>
                </div>
            </div>

            {/* Filtros */}
            <div className="card p-3">
                <div className="d-flex gap-2 flex-wrap">
                    {["Todos", "Em Execução", "Concluído"].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`btn btn-sm ${filter === f ? "btn-dark" : "btn-outline-secondary"}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Lista */}
            {filtered.length === 0 ? (
                <div className="text-center text-muted py-5 border rounded bg-white">
                    <div style={{ fontSize: 32 }}>📋</div>
                    <p className="mt-2 mb-0">Nenhum pedido atribuído em execução.</p>
                    <small>Os pedidos aparecem aqui depois de o administrador os atribuir.</small>
                </div>
            ) : (
                filtered.map(r => (
                    <div
                        key={r.id}
                        className="card p-3 border-start border-4"
                        style={{ borderLeftColor: r.status === "closed" ? "#6c757d" : "#0dcaf0" }}
                    >
                        <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                                <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                                    <span className="fw-bold">#{r.id} — {r.subject || r.title || "—"}</span>
                                    <span className={`badge bg-${STATUS_COLOR[r.status] || "secondary"}`} style={{ fontSize: 10 }}>
                                        {STATUS_LABELS[r.status] || r.status}
                                    </span>
                                    {r.type_name && (
                                        <span className="badge bg-light text-dark border" style={{ fontSize: 10 }}>
                                            {r.type_name}
                                        </span>
                                    )}
                                </div>
                                <div className="text-muted small mb-2">
                                    🏢 {r.company || "—"} · 📅 {r.date}
                                </div>
                                
                                {expandedId === r.id && r.description && (
                                    <div className="mt-2 p-2 bg-light rounded border small text-muted">
                                        <div className="mb-2">
                                            {r.description}
                                        </div>

                                        {(requestFiles[r.id] || []).length > 0 && (
                                        <div className="border-top pt-2 mt-2">
                                            <div className="fw-semibold mb-2">📎 Documentos recebidos</div>

                                            {(requestFiles[r.id] || [])
                                                // 🟢 FILTRO CORRIGIDO: 
                                                // Mantém apenas ficheiros cujo userId seja DIFERENTE do id do gestor atual.
                                                // Convertemos ambos para String para evitar falhas caso um seja texto e outro número.
                                                .filter(f => f.userId && String(f.userId) !== String(managerId))
                                                .map(f => (
                                                    <div key={f.id} className="d-flex justify-content-between align-items-center mb-1">
                                                        <span>📄 {f.fileName}</span>

                                                        <a
                                                            href={`${API}/requests/files/download/${f.id}`}
                                                            className="btn btn-sm btn-outline-dark"
                                                        >
                                                            Ver / Download
                                                        </a>
                                                    </div>
                                                ))
                                            }
                                            
                                            {/* Mensagem de feedback caso todos os ficheiros tenham sido enviados pelo gestor */}
                                            {(requestFiles[r.id] || []).filter(f => f.userId && String(f.userId) !== String(managerId)).length === 0 && (
                                                <div className="text-muted small fst-italic">Nenhum documento recebido do cliente para este pedido.</div>
                                            )}
                                        </div>
                                    )}
                                    </div>
                                )}
                            </div>

                            {/* Ações */}
                            <div className="d-flex flex-column gap-1 ms-3" style={{ minWidth: 160 }}>
                                <select
                                    className="form-select form-select-sm"
                                    value={r.status}
                                    onChange={e => handleStatusChange(r.id, e.target.value)}
                                    style={{ fontSize: 12 }}
                                    disabled={r.status === "closed"}
                                >
                                    <option value="in_progress">Em Execução</option>
                                    <option value="closed">Concluído</option>
                                </select>
                                <button
                                    className="btn btn-sm btn-outline-secondary"
                                    style={{ fontSize: 12 }}
                                    onClick={() => {
                                        const opening = expandedId !== r.id;
                                        setExpandedId(opening ? r.id : null);
                                        if (opening) {
                                            fetchFiles(r.id);
                                        }
                                    }}
                                >
                                    {expandedId === r.id ? "Fechar detalhe" : "Ver detalhe"}
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

/* ───────────────────────── TICKETS ───────────────────────── */
function Tickets() {
    const [tickets, setTickets] = useState([]);
    const [filter, setFilter] = useState("Todos");
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const [messages, setMessages] = useState({});
    const [replyText, setReplyText] = useState("");

    // Alterado para garantir que é tratado como Number em toda a parte
    const managerId = Number(localStorage.getItem("userId") || 1);

    const reloadTickets = async () => {
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

    useEffect(() => { reloadTickets(); }, []);

    const handleExpand = async (id) => {
        if (expandedId === id) { setExpandedId(null); return; }
        setExpandedId(id);
        if (!messages[id]) {
            try {
                const res = await axios.get(`${API}/questions/${id}/messages`);
                setMessages(prev => ({ ...prev, [id]: res.data.messages || [] }));
            } catch (err) {
                console.error("Erro ao carregar mensagens:", err);
            }
        }
    };

    const handleReply = async (ticketId) => {
        if (!replyText.trim()) return;
        try {
            await axios.post(`${API}/questions/${ticketId}/reply`, {
                message: replyText,
                userId: managerId, // já está tipado como Number acima
            });
            setReplyText("");
            const res = await axios.get(`${API}/questions/${ticketId}/messages`);
            setMessages(prev => ({ ...prev, [ticketId]: res.data.messages || [] }));
            await reloadTickets();
        } catch (err) {
            alert("Erro ao enviar resposta.");
        }
    };

    const handleClose = async (id) => {
        if (!window.confirm("Fechar este ticket?")) return;
        try {
            await axios.put(`${API}/questions/${id}/close`);
            await reloadTickets();
        } catch (err) {
            alert("Erro ao fechar ticket.");
        }
    };

    const STATUS_COLOR = { "Pendente": "warning", "Respondido": "success", "Fechado": "secondary" };

    // 1️⃣ Primeiro: Filtra apenas os tickets atribuídos a este manager
    const visibleTickets = tickets.filter(t => t.assignedToId === managerId);

    // 2️⃣ Segundo: Aplica o filtro da Tab ("Todos", "Pendente", etc.) sobre os tickets visíveis
    const filtered = filter === "Todos" ? visibleTickets : visibleTickets.filter(t => t.status === filter);

    if (loading) return <div className="text-center my-5"><p className="text-muted">A carregar tickets...</p></div>;

    return (
        <div className="d-flex flex-column gap-3">
            {/* Contadores (atualizados para refletir apenas os tickets do manager logado) */}
            <div className="row g-3 mb-1">
                {[
                    { label: "Total", value: visibleTickets.length, color: "dark" },
                    { label: "Pendentes", value: visibleTickets.filter(t => t.status === "Pendente").length, color: "warning" },
                    { label: "Respondidos", value: visibleTickets.filter(t => t.status === "Respondido").length, color: "success" },
                ].map(s => (
                    <div className="col" key={s.label}>
                        <div className="card p-3 text-center">
                            <div className="text-muted small">{s.label}</div>
                            <h4 className={`fw-bold mb-0 text-${s.color}`}>{s.value}</h4>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filtros */}
            <div className="card p-3">
                <div className="d-flex gap-2">
                    {["Todos", "Pendente", "Respondido"].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`btn btn-sm ${filter === f ? "btn-dark" : "btn-outline-secondary"}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Lista */}
            {filtered.length === 0 ? (
                <div className="text-center text-muted py-5 border rounded bg-white">
                    <div style={{ fontSize: 32 }}>🎫</div>
                    <p className="mt-2 mb-0">Nenhum ticket encontrado.</p>
                </div>
            ) : (
                filtered.map(t => (
                    <div
                        key={t.id}
                        className="card p-3 border-start border-4"
                        style={{ borderLeftColor: t.status === "Respondido" ? "#198754" : t.status === "Fechado" ? "#6c757d" : "#ffc107" }}
                    >
                        <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                                <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                                    <span className="fw-bold">#{t.id} — {t.subject}</span>
                                    <span className={`badge bg-${STATUS_COLOR[t.status] || "secondary"}`} style={{ fontSize: 10 }}>
                                        {t.status}
                                    </span>
                                </div>
                                <div className="text-muted small">
                                    👤 {t.createdBy || "—"} · 📅 {t.date}
                                    {t.assignedTo && t.assignedTo !== "Sem atribuição" && (
                                        <> · Atribuído a <strong>{t.assignedTo}</strong></>
                                    )}
                                </div>

                                {/* Conversa expandida */}
                                {expandedId === t.id && (
                                    <div className="mt-3 border-top pt-3">
                                        <div className="d-flex flex-column gap-2 mb-3" style={{ maxHeight: 280, overflowY: "auto" }}>
                                            {(messages[t.id] || []).map(m => {
                                                const isManager = m.userId === managerId;
                                                return (
                                                    <div
                                                        key={m.id}
                                                        className={`d-flex flex-column ${isManager ? "align-items-end" : "align-items-start"}`}
                                                    >
                                                        <div
                                                            className={`p-2 rounded small ${isManager
                                                                ? "bg-primary text-white"
                                                                : "bg-light border text-dark"
                                                                }`}
                                                            style={{ maxWidth: "70%" }}
                                                        >
                                                            <div className="fw-semibold mb-1" style={{ fontSize: 11, opacity: 0.8 }}>
                                                                {isManager ? "Eu (Gestor)" : m.sender?.name || "Cliente"}
                                                            </div>
                                                            {m.message}
                                                            <div className={`mt-1 ${isManager ? "text-white opacity-75" : "text-muted"}`} style={{ fontSize: 10 }}>
                                                                {m.sentAt ? new Date(m.sentAt).toLocaleString("pt-PT") : ""}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {t.status !== "Fechado" && (
                                            <div className="d-flex gap-2">
                                                <input
                                                    className="form-control form-control-sm"
                                                    placeholder="Escreve uma resposta..."
                                                    value={replyText}
                                                    onChange={e => setReplyText(e.target.value)}
                                                    onKeyDown={e => e.key === "Enter" && handleReply(t.id)}
                                                />
                                                <button className="btn btn-sm btn-dark" onClick={() => handleReply(t.id)}>
                                                    Enviar
                                                </button>
                                            </div>
                                        )}
                                        {t.status === "Fechado" && (
                                            <div className="alert alert-secondary py-2 small mb-0">🔒 Ticket fechado.</div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Ações */}
                            <div className="d-flex flex-column gap-1 ms-3">
                                <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => handleExpand(t.id)}
                                >
                                    {expandedId === t.id ? "Fechar" : "Responder"}
                                </button>
                                {t.status !== "Fechado" && (
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleClose(t.id)}>
                                        Fechar ticket
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

/* ───────────────────────── DOCUMENTOS ───────────────────────── */
function Docs() {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [requests, setRequests] = useState([]);
    const [form, setForm] = useState({ requestId: "", file: null });
    const [showForm, setShowForm] = useState(false);
    const [filter, setFilter] = useState("Todos");

    // 🔑 Captura o ID do gestor logado que guardou no componente Login
    const loggedInUserId = localStorage.getItem("userId") ? Number(localStorage.getItem("userId")) : null;

    const DOC_TYPES = ["Todos", "Relatório", "Pentest", "Política", "Procedimento", "Outro"];

    useEffect(() => {
        fetchDocs();
        fetchRequests();
    }, []);

    const fetchDocs = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API}/requests/files`);
            const data = res.data?.files || res.data;

            console.log("Ficheiros vindos do Backend:", data);
            if (Array.isArray(data)) setDocs(data);
        } catch (err) {
            console.error("Erro ao carregar documentos:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchRequests = async () => {
        try {
            const res = await axios.get(`${API}/requests`);
            setRequests(res.data.requests || []);
        } catch (err) {
            console.error("Erro ao carregar pedidos:", err);
        }
    };

    const handleUpload = async () => {
        if (!form.file || !form.requestId) {
            alert("Seleciona um pedido e um ficheiro.");
            return;
        }
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", form.file);
            fd.append("requestId", form.requestId);
            
            // 🟢 GARANTIA: Envia também o userId do gestor para ficar registado na Base de Dados
            if (loggedInUserId) {
                fd.append("userId", loggedInUserId);
            }

            await axios.post(`${API}/requests/files/upload`, fd, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setForm({ requestId: "", file: null });
            setShowForm(false);
            await fetchDocs();
        } catch (err) {
            alert("Erro ao fazer upload: " + (err.response?.data?.message || err.message));
        } finally {
            setUploading(false);
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
            alert("Não foi possível descarregar o ficheiro.");
        }
    };

    const handleDelete = async (fileId) => {
        if (!window.confirm("Remover este ficheiro?")) return;
        try {
            await axios.delete(`${API}/requests/files/${fileId}`);
            await fetchDocs();
        } catch (err) {
            alert("Erro ao remover ficheiro.");
        }
    };

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
        "Relatório": "primary", "Pentest": "danger",
        "Política": "warning", "Procedimento": "info", "Outro": "secondary",
    };

    // 🟢 FILTRAGEM DUPLA: Primeiro apenas os docs do utilizador atual, depois pelo tipo selecionado
    const filteredDocs = docs.filter(f => {
    // Se o ficheiro não tem userId, ignora
    if (!f.userId) return false;
    
    // Compara ambos convertidos para String para evitar erros de tipo (ex: 11 vs "11")
    return String(f.userId) === String(loggedInUserId);
});


    return (
        <div className="card p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h6 className="fw-bold mb-0">Gestão de Documentos</h6>
                    <p className="text-muted small mb-0">Carrega e partilha ficheiros com os clientes.</p>
                </div>
                <button
                    className="btn btn-sm btn-dark"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? "Cancelar" : "📤 Enviar Documento"}
                </button>
            </div>

            {/* Formulário de upload */}
            {showForm && (
                <div className="border rounded p-3 mb-3 bg-light">
                    <div className="row g-3">
                        <div className="col-md-5">
                            <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Associar a Pedido *</label>
                            <select
                                className="form-select form-select-sm"
                                value={form.requestId}
                                onChange={e => setForm(prev => ({ ...prev, requestId: e.target.value }))}
                            >
                                <option value="">Seleciona um pedido...</option>
                                {requests.map(r => (
                                    <option key={r.id} value={r.id}>
                                        #{r.id} — {r.subject || r.title || "—"} ({r.company || "—"})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-5">
                            <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Ficheiro *</label>
                            <input
                                type="file"
                                className="form-control form-control-sm"
                                onChange={e => setForm(prev => ({ ...prev, file: e.target.files[0] }))}
                            >
                            </input>
                            {form.file && <small className="text-success mt-1 d-block">📎 {form.file.name}</small>}
                        </div>
                        <div className="col-md-2 d-flex align-items-end">
                            <button
                                className="btn btn-sm btn-success w-100"
                                onClick={handleUpload}
                                disabled={uploading}
                            >
                                {uploading ? "A enviar..." : "Enviar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Filtros */}
            <div className="d-flex gap-2 flex-wrap mb-3">
                {DOC_TYPES.map(t => (
                    <button
                        key={t}
                        onClick={() => setFilter(t)}
                        className={`btn btn-sm ${filter === t ? "btn-dark" : "btn-outline-secondary"}`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {loading ? (
                <p className="text-muted">A carregar documentos...</p>
            ) : filteredDocs.length === 0 ? (
                <div className="text-center text-muted py-5 border rounded">
                    <div style={{ fontSize: 32 }}>📂</div>
                    <p className="mt-2 mb-0">Nenhum documento disponível para a sua conta.</p>
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
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDocs.map(f => (
                                <tr key={f.id}>
                                    <td className="fw-semibold">📄 {f.fileName || "Sem nome"}</td>
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
                                        {f.uploadedAt ? new Date(f.uploadedAt).toLocaleDateString("pt-PT") : "—"}
                                    </td>
                                    <td>
                                        <div className="d-flex gap-1">
                                            <button
                                                className="btn btn-sm btn-outline-dark"
                                                onClick={() => handleDownload(f.id, f.fileName)}
                                            >
                                                📥 Download
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleDelete(f.id)}
                                            >
                                                Remover
                                            </button>
                                        </div>
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

//CONFIGURAÇÕES DE CONTA

function Settings() {
    const [form, setForm] = useState({ current: "", newPw: "", confirm: "" });
    const [strength, setStrength] = useState(0);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const [profile, setProfile] = useState({ name: "", email: "" });

    const activeUserId = localStorage.getItem("userId") || 1;

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await axios.get(`${API}/users`);
                const userId = Number(localStorage.getItem("userId"));
                const me = res.data.users.find(u => u.id_Utilizador === userId);
                if (me) setProfile({
                    name: me.name,
                    email: me.email
                });
            } catch (err) {
                console.error("Erro ao carregar perfil:", err);
            }
        };
        loadProfile();
    }, []);

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
                        <div className="fw-semibold">{profile.name || "—"}</div>
                        <div className="text-muted small">{profile.email || "—"}</div>
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