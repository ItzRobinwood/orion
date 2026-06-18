import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';


export default function AdminDashboard() {
    const [active, setActive] = useState("dashboard");

    const nav = [
        { id: "dashboard", label: "Dashboard" },
        { id: "accounts", label: "Contas" },
        { id: "tickets", label: "Tickets" },
        { id: "requests", label: "Pedidos" },
        { id: "docs", label: "Documentos" },
        { id: "settings", label: "Configurações" },
        { id: "content", label: "Gestão de Conteúdo" },
    ];

    const renderContent = () => {
        switch (active) {
            case "dashboard": return <Dashboard />;
            case "accounts": return <Accounts />;
            case "tickets": return <Tickets />;
            case "requests": return <Requests />;
            case "docs": return <Docs />;
            case "settings": return <Settings />;
            case "content": return <Content />;
            default: return null;
        }
    };

    return (
        <div className="d-flex vh-100">
            <div className="bg-dark text-white p-3 d-flex flex-column" style={{ width: 250 }}>
                <h4 className="mb-4">CyberBox</h4>
                {nav.map((item) => (
                    <button key={item.id} onClick={() => setActive(item.id)}
                        className={`btn w-100 mb-2 text-start ${active === item.id ? "btn-primary" : "btn-outline-light"}`}>
                        {item.label}
                    </button>
                ))}
                <div className="mt-auto pt-4 small text-secondary">© 2026 CyberBox</div>
            </div>
            <div className="flex-grow-1 bg-light p-4 overflow-auto">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="m-0 text-capitalize">{active}</h4>
                    <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-dark">Admin</span>
                        <img src="https://i.pravatar.cc/40" className="rounded-circle" alt="admin" />
                    </div>
                </div>
                {renderContent()}
            </div>
        </div>
    );
}

function Dashboard() {
    return (
        <>
            <div className="row g-3 mb-4">
                <Card title="Utilizadores" value="24" color="primary" />
                <Card title="Tickets" value="7" color="danger" />
                <Card title="Pedidos" value="12" color="warning" />
                <Card title="Documentos" value="38" color="success" />
            </div>
            <div className="card p-3">
                <h6>Atividade recente</h6>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">Admin fez login</li>
                    <li className="list-group-item">Ticket #T002 atualizado</li>
                    <li className="list-group-item">Novo utilizador criado</li>
                </ul>
            </div>
        </>
    );
}

function Accounts() {
    const [accounts, setAccounts] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [managers, setManagers] = useState([]);
    const [clients, setClients] = useState([]);

    const reloadAdmins = async () => {
        try {
            const res = await axios.get("https://orion-dewp.onrender.com/api/users");
            const data = res.data;
            const mapped = data.users
                .filter(u => u.id_tipo === 1)
                .map(u => ({
                    ...u,
                    id: u.id_Utilizador,
                    phone: u.telephone,
                    status: u.active ? "Ativo" : "Inativo"
                }));
            setAdmins(mapped);
        } catch (err) {
            console.error("Error loading admins:", err);
        }
    };

    const reloadManagers = async () => {
        try {
            const res = await axios.get("https://orion-dewp.onrender.com/api/users");
            const data = res.data;
            const mapped = data.users
                .filter(u => u.id_tipo === 2)
                .map(u => ({
                    ...u,
                    id: u.id_Utilizador,
                    phone: u.telephone,
                    status: u.active ? "Ativo" : "Inativo"
                }));
            setManagers(mapped);
        } catch (err) {
            console.error("Error loading managers:", err);
        }
    };

    // Esta função foi melhorada para aceitar opcionalmente os dados das empresas mais recentes
    const reloadClients = async (currentAccounts = accounts) => {
        try {
            const res = await axios.get("https://orion-dewp.onrender.com/api/users");
            const data = res.data;

            const mapped = data.users
                .filter(u => u.id_tipo === 3)
                .map(u => {
                    // Mapeia usando a lista de empresas atualizada
                    const associatedCompany = currentAccounts.find(acc => acc.id === u.companyId);

                    return {
                        ...u,
                        id: u.id_Utilizador,
                        phone: u.telephone,
                        status: u.active ? "Ativo" : "Inativo",
                        companyName: associatedCompany ? associatedCompany.company : "Sem Empresa"
                    };
                });

            setClients(mapped);
        } catch (err) {
            console.error("Error loading clients:", err);
        }
    };

    const reloadCompanies = async () => {
        try {
            const res = await axios.get("https://orion-dewp.onrender.com/api/companies");
            const data = res.data;
            const mapped = data.companies.map(c => ({
                id: c.id,
                company: c.nome,
                status: c.status ? "Ativo" : "Inativo",
                securityManager: {
                    name: c.nomeResponsavelSeg || "",
                    email: c.emailResponsavelSeg || "",
                    phone: c.telefoneResponsavelSeg || ""
                },
                permanentContact: {
                    name: c.nomeContactoPerm || "",
                    email: c.emailContactoPerm || "",
                    phone: c.telefoneContactoPerm || ""
                },
                clients: (c.users || []).filter(u => u.id_tipo === 3).map(u => ({
                    name: u.name,
                    email: u.email,
                    phone: u.telephone
                }))
            }));

            setAccounts(mapped);
            // IMPORTANTE: Passamos o mapeamento diretamente para atualizar os clientes na hora!
            await reloadClients(mapped);
        } catch (err) {
            console.error("Error loading companies:", err);
        }
    };

    // 1. Primeiro ciclo de vida: Carrega dados independentes e as empresas
    useEffect(() => {
        reloadAdmins();
        reloadManagers();
        reloadCompanies();
    }, []);

    return (
        <div className="d-flex flex-column gap-4">
            <CompaniesTable accounts={accounts} setAccounts={setAccounts} reloadCompanies={reloadCompanies} />
            <AdminsTable admins={admins} setAdmins={setAdmins} reloadAdmins={reloadAdmins} />
            <ManagersTable managers={managers} setManagers={setManagers} reloadManagers={reloadManagers} />
            {/* Adicionada a prop accounts para o ClientsTable poder usar no dropdown de criação/edição */}
            <ClientsTable clients={clients} setClients={setClients} reloadClients={reloadClients} accounts={accounts} />
        </div>
    );
}


function CompaniesTable({ accounts, setAccounts, reloadCompanies }) {
    const getEmptyForm = () => ({
        company: "",
        status: "Ativo",
        securityManager: { name: "", email: "", phone: "" },
        permanentContact: { name: "", email: "", phone: "" },
    });

    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(getEmptyForm());
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState(null);

    const setField = (f, v) => setForm((p) => ({ ...p, [f]: v }));
    const setSubField = (s, f, v) => setForm((p) => ({ ...p, [s]: { ...p[s], [f]: v } }));

    const setEField = (f, v) => setEditForm((p) => ({ ...p, [f]: v }));
    const setESubField = (s, f, v) => setEditForm((p) => ({ ...p, [s]: { ...p[s], [f]: v } }));

    const handleCreate = async () => {
        if (!form.company) return;
        try {
            const res = await axios.post("https://orion-dewp.onrender.com/api/companies", {
                nome: form.company,
                status: form.status === "Ativo",
                nomeResponsavelSeg: form.securityManager.name,
                emailResponsavelSeg: form.securityManager.email,
                telefoneResponsavelSeg: form.securityManager.phone,
                nomeContactoPerm: form.permanentContact.name,
                emailContactoPerm: form.permanentContact.email,
                telefoneContactoPerm: form.permanentContact.phone
            });
            if (res.data.success) {
                await reloadCompanies();
                setForm(getEmptyForm());
                setShowForm(false);
            } else {
                alert("Error: " + res.data.message);
            }
        } catch (err) {
            alert("Connection error: " + err.message);
        }
    };

    const startEdit = (a) => {
        setEditingId(a.id);
        setEditForm({ ...a });
        setShowForm(false);
    };

    const cancelEdit = () => { setEditingId(null); setEditForm(null); };

    const saveEdit = async () => {
        if (!editForm.company) return;
        try {
            const res = await axios.put(`https://orion-dewp.onrender.com/api/companies/${editingId}`, {
                nome: editForm.company,
                status: editForm.status === "Ativo",
                nomeResponsavelSeg: editForm.securityManager.name,
                emailResponsavelSeg: editForm.securityManager.email,
                telefoneResponsavelSeg: editForm.securityManager.phone,
                nomeContactoPerm: editForm.permanentContact.name,
                emailContactoPerm: editForm.permanentContact.email,
                telefoneContactoPerm: editForm.permanentContact.phone
            });
            if (res.data.success) {
                await reloadCompanies();
                cancelEdit();
            } else {
                alert("Error: " + res.data.message);
            }
        } catch (err) {
            alert("Connection error: " + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Tens a certeza que desejas remover esta empresa?")) return;
        try {
            const res = await axios.delete(`https://orion-dewp.onrender.com/api/companies/${id}`);
            if (res.data.success) {
                await reloadCompanies();
            } else {
                alert("Error: " + res.data.message);
            }
        } catch (err) {
            alert("Connection error: " + err.message);
        }
    };

    const statusColor = (s) => s === "Ativo" ? "bg-success" : s === "Pendente" ? "bg-warning text-dark" : "bg-danger";

    return (
        <div className="card p-3 shadow-sm border-0">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0 fw-bold">Empresas</h5>
                <button type="button" className="btn btn-sm btn-dark"
                    onClick={() => { setShowForm(!showForm); cancelEdit(); setForm(getEmptyForm()); }}>
                    {showForm ? "Cancelar" : "+ Nova Empresa"}
                </button>
            </div>

            {showForm && (
                <div className="bg-light p-3 border rounded mb-3">
                    <CompanyForm form={form} title="Nova Empresa" submitLabel="Criar Empresa"
                        setField={setField} setSubField={setSubField}
                        onSubmit={handleCreate} />
                </div>
            )}

            <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-dark">
                        <tr>
                            <th>Empresa</th>
                            <th>Resp. Segurança</th>
                            <th>Contacto Perm.</th>
                            <th>Estado</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.map((a) => {
                            // Criamos um array de elementos com chaves individuais para contornar o Fragment do React
                            const rows = [
                                <tr key={`row-${a.id}`}>
                                    <td className="fw-semibold text-dark">{a.company}</td>
                                    <td>{a.securityManager?.name || "—"}</td>
                                    <td>{a.permanentContact?.name || "—"}</td>
                                    <td><span className={`badge ${statusColor(a.status)}`}>{a.status}</span></td>
                                    <td>
                                        <div className="d-flex gap-1">
                                            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => startEdit(a)}>Editar</button>
                                            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(a.id)}>Remover</button>
                                        </div>
                                    </td>
                                </tr>
                            ];

                            // Se estiver em modo de edição, adiciona a linha do formulário logo a seguir
                            if (editingId === a.id && editForm) {
                                rows.push(
                                    <tr key={`edit-${a.id}`}>
                                        <td colSpan={5} className="p-0">
                                            <div className="border border-warning rounded m-2 p-3 bg-white">
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <h6 className="mb-0 fw-bold text-warning">Editar — {a.company}</h6>
                                                    <button type="button" className="btn btn-sm btn-link text-secondary p-0 text-decoration-none" onClick={cancelEdit}>✕ Cancelar</button>
                                                </div>
                                                <CompanyForm form={editForm} title="" submitLabel="Guardar Alterações"
                                                    setField={setEField} setSubField={setESubField}
                                                    onSubmit={saveEdit} />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }

                            return rows;
                        })}

                        {accounts.length === 0 && (
                            <tr><td colSpan={5} className="text-center text-muted py-4">Nenhuma empresa criada.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


function ClientsTable({ clients, setClients, reloadClients, accounts }) {
    // 1. O estado inicial agora inclui o campo companyId vazio
    const getEmptyForm = () => ({
        name: "",
        email: "",
        phone: "",
        password: "",
        status: "Ativo",
        companyId: ""
    });

    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(getEmptyForm());
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState(null);

    const generatePassword = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$";
        return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    };

    // 2. Ação de Criar Cliente com Chave Estrangeira da Empresa
    const handleCreate = async () => {
        if (!form.name || !form.email || !form.password || !form.companyId) {
            alert("Por favor, preencha o nome, email, password e selecione uma empresa.");
            return;
        }
        try {
            const res = await axios.post("https://orion-dewp.onrender.com/api/users", {
                name: form.name,
                email: form.email,
                password: form.password,
                telephone: form.phone,
                id_tipo: 3, // Tipo 3 para Clientes
                companyId: parseInt(form.companyId) // Envia o ID da Empresa selecionada
            });

            if (res.data.success) {
                await reloadClients(); // Atualiza a lista geral
                setForm(getEmptyForm());
                setShowForm(false);
            } else {
                alert("Error: " + res.data.message);
            }
        } catch (err) {
            alert("Connection error: " + err.message);
        }
    };

    const startEdit = (c) => {
        setEditingId(c.id_Utilizador || c.id);
        setEditForm({
            ...c,
            companyId: c.companyId || "" // Garante que o ID antigo fica selecionado no dropdown
        });
        setShowForm(false);
    };

    const cancelEdit = () => { setEditingId(null); setEditForm(null); };

    // 3. Ação de Guardar Alterações do Cliente
    const saveEdit = async () => {
        if (!editForm.name || !editForm.email || !editForm.companyId) {
            alert("Nome, Email e Empresa são obrigatórios.");
            return;
        }
        try {
            const res = await axios.put(`https://orion-dewp.onrender.com/api/users/${editingId}`, {
                name: editForm.name,
                email: editForm.email,
                telephone: editForm.phone,
                status: editForm.status,
                companyId: parseInt(editForm.companyId) // Atualiza a associação da empresa
            });

            if (res.data.success) {
                await reloadClients();
                cancelEdit();
            } else {
                alert("Error: " + res.data.message);
            }
        } catch (err) {
            alert("Connection error: " + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Tem a certeza que deseja remover este cliente?")) return;
        try {
            const res = await axios.delete(`https://orion-dewp.onrender.com/api/users/${id}`);
            if (res.data.success) {
                await reloadClients();
            } else {
                alert("Error: " + res.data.message);
            }
        } catch (err) {
            alert("Connection error: " + err.message);
        }
    };

    const statusColor = (s) => s === "Ativo" ? "bg-success" : "bg-danger";

    return (
        <div className="card p-3 shadow-sm border-0">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0 fw-bold">Clientes</h5>
                <button type="button" className="btn btn-sm btn-dark"
                    onClick={() => { setShowForm(!showForm); cancelEdit(); setForm(getEmptyForm()); }}>
                    {showForm ? "Cancelar" : "+ Novo Cliente"}
                </button>
            </div>

            {/* Formulário de Criação */}
            {showForm && (
                <ClientPersonForm
                    form={form}
                    setForm={setForm}
                    title="Novo Cliente Corporativo"
                    submitLabel="Criar Cliente"
                    generatePassword={generatePassword}
                    onSubmit={handleCreate}
                    accounts={accounts}
                />
            )}

            <div className="table-responsive">
                <table className="table table-hover mb-0 align-middle">
                    <thead className="table-success">
                        <tr>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Telefone</th>
                            <th>Empresa</th>
                            <th>Estado</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((c) => (
                            <React.Fragment key={c.id_Utilizador || c.id}>
                                <tr>
                                    <td className="fw-semibold">{c.name}</td>
                                    <td>{c.email}</td>
                                    <td>{c.phone || "—"}</td>
                                    <td>
                                        <span className="badge bg-light text-dark border">
                                            {c.companyName || "Sem empresa"}
                                        </span>
                                    </td>
                                    <td><span className={`badge ${statusColor(c.status)}`}>{c.status}</span></td>
                                    <td>
                                        <div className="d-flex gap-1">
                                            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => startEdit(c)}>Editar</button>
                                            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c.id_Utilizador || c.id)}>Remover</button>
                                        </div>
                                    </td>
                                </tr>

                                {/* Linha de Edição Inline */}
                                {editingId === (c.id_Utilizador || c.id) && editForm && (
                                    <tr>
                                        <td colSpan={6} className="p-0">
                                            <div className="border border-warning rounded m-2 p-3 bg-white">
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <h6 className="mb-0 fw-bold text-warning">Editar Cliente — {c.name}</h6>
                                                    <button type="button" className="btn btn-sm btn-link text-secondary p-0 text-decoration-none" onClick={cancelEdit}>✕ Cancelar</button>
                                                </div>
                                                <ClientPersonForm
                                                    form={editForm}
                                                    setForm={setEditForm}
                                                    title=""
                                                    submitLabel="Guardar Alterações"
                                                    generatePassword={generatePassword}
                                                    onSubmit={saveEdit}
                                                    isEdit={true}
                                                    accounts={accounts}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                        {clients.length === 0 && (
                            <tr><td colSpan={6} className="text-center text-muted py-3">Nenhum cliente cadastrado.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
function CompanyForm({ form, title, submitLabel, setField, setSubField, onSubmit }) {
    return (
        <>
            {title && <h6 className="mb-3">{title}</h6>}

            <div className="row g-2 mb-3">
                <div className="col-md-6">
                    <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Nome da Empresa *</label>
                    <input className="form-control form-control-sm" placeholder="Ex: TechCorp Lda"
                        value={form.company} onChange={(e) => setField("company", e.target.value)} />
                </div>
                <div className="col-md-3">
                    <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Estado</label>
                    <select className="form-select form-select-sm"
                        value={form.status} onChange={(e) => setField("status", e.target.value)}>
                        <option value="Ativo">Ativo</option>
                        <option value="Pendente">Pendente</option>
                        <option value="Inativo">Inativo</option>
                    </select>
                </div>
            </div>
            <hr />

            <div className="mb-3">
                <label className="fw-semibold d-block mb-2" style={{ fontSize: 13 }}>Responsável de Segurança</label>
                <div className="row g-2">
                    {["name", "email", "phone"].map((f) => (
                        <div className="col-md-4" key={f}>
                            <label className="form-label" style={{ fontSize: 11 }}>
                                {f === "name" ? "Nome" : f === "email" ? "Email" : "Telefone"}
                            </label>
                            <input className="form-control form-control-sm"
                                placeholder={f === "name" ? "Nome" : f === "email" ? "email@empresa.com" : "+351 910 000 000"}
                                value={form.securityManager[f]}
                                onChange={(e) => setSubField("securityManager", f, e.target.value)} />
                        </div>
                    ))}
                </div>
            </div>
            <hr />

            <div className="mb-3">
                <label className="fw-semibold d-block mb-2" style={{ fontSize: 13 }}>Contacto Permanente</label>
                <div className="row g-2">
                    {["name", "email", "phone"].map((f) => (
                        <div className="col-md-4" key={f}>
                            <label className="form-label" style={{ fontSize: 11 }}>
                                {f === "name" ? "Nome" : f === "email" ? "Email" : "Telefone"}
                            </label>
                            <input className="form-control form-control-sm"
                                placeholder={f === "name" ? "Nome" : f === "email" ? "email@empresa.com" : "+351 910 000 000"}
                                value={form.permanentContact[f]}
                                onChange={(e) => setSubField("permanentContact", f, e.target.value)} />
                        </div>
                    ))}
                </div>
            </div>

            <button className="btn btn-sm btn-success" onClick={onSubmit}>
                {submitLabel}
            </button>
        </>
    );
}

// ==========================================
// SUB-FORMULÁRIO ADAPTADO COM DROPDOWN
// ==========================================
function ClientPersonForm({ form, setForm, title, submitLabel, generatePassword, onSubmit, isEdit = false, accounts }) {
    return (
        <div className="border rounded p-3 mb-4 bg-white">
            {title && <h6 className="mb-3 text-secondary fw-bold">{title}</h6>}
            <div className="row g-3">
                {[
                    { f: "name", label: "Nome Completo", type: "text", ph: "Nome do cliente" },
                    { f: "email", label: "Email", type: "email", ph: "cliente@empresa.com" },
                    { f: "phone", label: "Telefone", type: "tel", ph: "+351 9xx xxx xxx" },
                ].map(({ f, label, type, ph }) => (
                    <div className="col-md-4" key={f}>
                        <label className="form-label fw-semibold mb-1" style={{ fontSize: 12 }}>{label}</label>
                        <input type={type} className="form-control form-control-sm" placeholder={ph}
                            value={form[f] || ""} onChange={(e) => setForm({ ...form, [f]: e.target.value })} />
                    </div>
                ))}

                {/* DROPDOWN PARA ESCOLHER A EMPRESA */}
                <div className="col-md-4">
                    <label className="form-label fw-semibold mb-1 text-primary" style={{ fontSize: 12 }}>Empresa Pertencente *</label>
                    <select
                        className="form-select form-select-sm border-primary-subtle"
                        value={form.companyId}
                        onChange={(e) => setForm({ ...form, companyId: e.target.value })}
                    >
                        <option value="">-- Selecione uma Empresa --</option>
                        {accounts.map((acc) => (
                            <option key={acc.id} value={acc.id}>
                                {acc.company}
                            </option>
                        ))}
                    </select>
                </div>

                {!isEdit ? (
                    <div className="col-md-4">
                        <label className="form-label fw-semibold mb-1" style={{ fontSize: 12 }}>Password</label>
                        <div className="input-group input-group-sm">
                            <input type="text" className="form-control form-control-sm" placeholder="Gere a password"
                                value={form.password || ""} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                            <button type="button" className="btn btn-outline-secondary"
                                onClick={() => setForm({ ...form, password: generatePassword() })}>Gerar</button>
                        </div>
                    </div>
                ) : (
                    <div className="col-md-4">
                        <label className="form-label fw-semibold mb-1" style={{ fontSize: 12 }}>Password</label>
                        <input type="password" className="form-control form-control-sm bg-light" value="placeholder" disabled />
                    </div>
                )}

                <div className="col-md-4">
                    <label className="form-label fw-semibold mb-1" style={{ fontSize: 12 }}>Estado</label>
                    <select className="form-select form-select-sm"
                        value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                        <option>Ativo</option>
                        <option>Inativo</option>
                    </select>
                </div>
            </div>
            <button type="button" className="btn btn-sm btn-success mt-3" onClick={onSubmit}>{submitLabel}</button>
        </div>
    );
}


function AdminsTable({ admins, setAdmins, reloadAdmins }) {
    const getEmptyForm = () => ({ name: "", email: "", phone: "", password: "", status: "Ativo" });
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(getEmptyForm());
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState(null);

    const generatePassword = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
        return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    };

    const handleCreate = async () => {
        if (!form.name || !form.email || !form.password) {
            alert("Please fill in name, email and password before creating.");
            return;
        }
        try {
            const res = await axios.post("https://orion-dewp.onrender.com/api/users", {
                name: form.name,
                email: form.email,
                password: form.password,
                telephone: form.phone,
                id_tipo: 1
            });
            if (res.data.success) {
                await reloadAdmins();
                setForm(getEmptyForm());
                setShowForm(false);
            } else {
                alert("Error: " + res.data.message);
            }
        } catch (err) {
            alert("Connection error: " + err.message);
        }
    };

    const startEdit = (a) => {
        setEditingId(a.id_Utilizador || a.id);
        setEditForm({ ...a });
        setShowForm(false);
    };
    const cancelEdit = () => { setEditingId(null); setEditForm(null); };

    const saveEdit = async () => {
        if (!editForm.name || !editForm.email) return;
        try {
            const res = await axios.put(`https://orion-dewp.onrender.com/api/users/${editingId}`, {
                name: editForm.name,
                email: editForm.email,
                telephone: editForm.phone,
                status: editForm.status
            });
            if (res.data.success) {
                await reloadAdmins();
                cancelEdit();
            } else {
                alert("Error: " + res.data.message);
            }
        } catch (err) {
            alert("Connection error: " + err.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`https://orion-dewp.onrender.com/api/users/${id}`);
            if (res.data.success) {
                await reloadAdmins();
            } else {
                alert("Error: " + res.data.message);
            }
        } catch (err) {
            alert("Connection error: " + err.message);
        }
    };

    const statusColor = (s) => s === "Ativo" ? "bg-success" : "bg-danger";

    return (
        <div className="card p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Administradores</h5>
                <button type="button" className="btn btn-sm btn-dark"
                    onClick={() => { setShowForm(!showForm); cancelEdit(); setForm(getEmptyForm()); }}>
                    {showForm ? "Cancelar" : "+ Novo Administrador"}
                </button>
            </div>
            {showForm && (
                <PersonForm form={form} setForm={setForm} title="Novo Administrador"
                    submitLabel="Criar Administrador" generatePassword={generatePassword} onSubmit={handleCreate} />
            )}
            <table className="table table-hover mb-0">
                <thead className="table-primary">
                    <tr><th>Nome</th><th>Email</th><th>Telefone</th><th>Estado</th><th>Ações</th></tr>
                </thead>
                <tbody>
                    {admins.map((a) => (
                        <>
                            <tr key={a.id}>
                                <td className="fw-semibold">{a.name}</td>
                                <td>{a.email}</td>
                                <td>{a.phone}</td>
                                <td><span className={`badge ${statusColor(a.status)}`}>{a.status}</span></td>
                                <td>
                                    <div className="d-flex gap-1">
                                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => startEdit(a)}>Editar</button>
                                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(a.id_Utilizador || a.id)}>Remover</button>
                                    </div>
                                </td>
                            </tr>
                            {editingId === (a.id_Utilizador || a.id) && editForm && (
                                <tr key={`edit-${a.id}`}>
                                    <td colSpan={5} className="p-0">
                                        <div className="border border-warning rounded m-2 p-3 bg-white">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h6 className="mb-0">Editar — {a.name}</h6>
                                                <button type="button" className="btn btn-sm btn-link text-secondary p-0" onClick={cancelEdit}>✕ Cancelar</button>
                                            </div>
                                            <PersonForm form={editForm} setForm={setEditForm} title=""
                                                submitLabel="Guardar Alterações" generatePassword={generatePassword}
                                                onSubmit={saveEdit} isEdit={true} />
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </>
                    ))}
                    {admins.length === 0 && (
                        <tr><td colSpan={5} className="text-center text-muted py-3">Nenhum administrador criado.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

function ManagersTable({ managers, setManagers, reloadManagers }) {
    const getEmptyForm = () => ({ name: "", email: "", phone: "", password: "", status: "Ativo" });
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(getEmptyForm());
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState(null);

    const generatePassword = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
        return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    };

    const handleCreate = async () => {
        if (!form.name || !form.email || !form.password) {
            alert("Please fill in name, email and password before creating.");
            return;
        }
        try {
            const res = await axios.post("https://orion-dewp.onrender.com/api/users", {
                name: form.name,
                email: form.email,
                password: form.password,
                telephone: form.phone,
                id_tipo: 2
            });
            if (res.data.success) {
                await reloadManagers();
                setForm(getEmptyForm());
                setShowForm(false);
            } else {
                alert("Error: " + res.data.message);
            }
        } catch (err) {
            alert("Connection error: " + err.message);
        }
    };

    const startEdit = (m) => {
        setEditingId(m.id_Utilizador || m.id);
        setEditForm({ ...m });
        setShowForm(false);
    };
    const cancelEdit = () => { setEditingId(null); setEditForm(null); };

    const saveEdit = async () => {
        if (!editForm.name || !editForm.email) return;
        try {
            const res = await axios.put(`https://orion-dewp.onrender.com/api/users/${editingId}`, {
                name: editForm.name,
                email: editForm.email,
                telephone: editForm.phone,
                status: editForm.status
            });
            if (res.data.success) {
                await reloadManagers();
                cancelEdit();
            } else {
                alert("Error: " + res.data.message);
            }
        } catch (err) {
            alert("Connection error: " + err.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`https://orion-dewp.onrender.com/api/users/${id}`);
            if (res.data.success) {
                await reloadManagers();
            } else {
                alert("Error: " + res.data.message);
            }
        } catch (err) {
            alert("Connection error: " + err.message);
        }
    };

    const statusColor = (s) => s === "Ativo" ? "bg-success" : "bg-danger";

    return (
        <div className="card p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Gestores</h5>
                <button type="button" className="btn btn-sm btn-dark"
                    onClick={() => { setShowForm(!showForm); cancelEdit(); setForm(getEmptyForm()); }}>
                    {showForm ? "Cancelar" : "+ Novo Gestor"}
                </button>
            </div>
            {showForm && (
                <PersonForm form={form} setForm={setForm} title="Novo Gestor"
                    submitLabel="Criar Gestor" generatePassword={generatePassword} onSubmit={handleCreate} />
            )}
            <table className="table table-hover mb-0">
                <thead className="table-info">
                    <tr><th>Nome</th><th>Email</th><th>Telefone</th><th>Estado</th><th>Ações</th></tr>
                </thead>
                <tbody>
                    {managers.map((m) => (
                        <>
                            <tr key={m.id}>
                                <td className="fw-semibold">{m.name}</td>
                                <td>{m.email}</td>
                                <td>{m.phone}</td>
                                <td><span className={`badge ${statusColor(m.status)}`}>{m.status}</span></td>
                                <td>
                                    <div className="d-flex gap-1">
                                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => startEdit(m)}>Editar</button>
                                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(m.id_Utilizador || m.id)}>Remover</button>
                                    </div>
                                </td>
                            </tr>
                            {editingId === (m.id_Utilizador || m.id) && editForm && (
                                <tr key={`edit-${m.id}`}>
                                    <td colSpan={5} className="p-0">
                                        <div className="border border-warning rounded m-2 p-3 bg-white">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h6 className="mb-0">Editar — {m.name}</h6>
                                                <button type="button" className="btn btn-sm btn-link text-secondary p-0" onClick={cancelEdit}>✕ Cancelar</button>
                                            </div>
                                            <PersonForm form={editForm} setForm={setEditForm} title=""
                                                submitLabel="Guardar Alterações" generatePassword={generatePassword}
                                                onSubmit={saveEdit} isEdit={true} />
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </>
                    ))}
                    {managers.length === 0 && (
                        <tr><td colSpan={5} className="text-center text-muted py-3">Nenhum gestor criado.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

function PersonForm({ form, setForm, title, submitLabel, generatePassword, onSubmit, isEdit = false }) {
    return (
        <div className="border rounded p-3 mb-4 bg-white">
            {title && <h6 className="mb-3">{title}</h6>}
            <div className="row g-3">
                {[
                    { f: "name", label: "Nome Completo", type: "text", ph: "Nome completo" },
                    { f: "email", label: "Email", type: "email", ph: "utilizador@cyberbox.pt" },
                    { f: "phone", label: "Telefone", type: "tel", ph: "+351 910 000 000" },
                ].map(({ f, label, type, ph }) => (
                    <div className="col-md-4" key={f}>
                        <label className="form-label fw-semibold" style={{ fontSize: 12 }}>{label}</label>
                        <input type={type} className="form-control form-control-sm" placeholder={ph}
                            value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} />
                    </div>
                ))}

                {!isEdit ? (
                    <div className="col-md-4">
                        <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Password</label>
                        <div className="input-group input-group-sm">
                            <input type="text" className="form-control form-control-sm" placeholder="Gere uma password"
                                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                            <button type="button" className="btn btn-outline-secondary"
                                onClick={() => setForm({ ...form, password: generatePassword() })}>Gerar</button>
                        </div>
                    </div>
                ) : (
                    <div className="col-md-4">
                        <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Password</label>
                        <input type="password" className="form-control form-control-sm bg-light" value="placeholder" disabled />
                        <small className="text-muted" style={{ fontSize: 11 }}>A password não pode ser alterada aqui.</small>
                    </div>
                )}

                <div className="col-md-4">
                    <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Estado</label>
                    <select className="form-select form-select-sm"
                        value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                        <option>Ativo</option>
                        <option>Inativo</option>
                    </select>
                </div>
            </div>
            <button type="button" className="btn btn-sm btn-success mt-3" onClick={onSubmit}>{submitLabel}</button>
        </div>
    );
}

function Tickets() {
    return (
        <div className="card p-3">
            <h5>Tickets</h5>
            <ul className="list-group mt-3">
                <li className="list-group-item">#T001 - VPN falhou</li>
                <li className="list-group-item">#T002 - Relatório em falta</li>
            </ul>
        </div>
    );
}

function Requests({ managers = [] }) { // Recebe os managers passados pelo painel pai
    const [requests, setRequests] = useState([]);
    const [filter, setFilter] = useState("Todos");
    const [loading, setLoading] = useState(true);
    // Estado para saber qual card está em modo de atribuição de gestor
    const [activeAssignId, setActiveAssignId] = useState(null);

    // Tradutor de estados do Sequelize ENUM ('open', 'in_progress', 'closed') para o teu Layout
    const translateStatus = (dbStatus) => {
        switch (dbStatus) {
            case "open": return "Pendente";
            case "in_progress": return "Em Execução";
            case "closed": return "Concluídos";
            default: return "Pendente";
        }
    };

    const reloadRequests = async () => {
        try {
            setLoading(true);

            const response = await axios.get("https://orion-dewp.onrender.com/api/requests");
            const data = response.data;

            if (data && data.success && data.requests) {
                const mappedRequests = data.requests.map(r => ({
                    id: r.id,
                    title: r.type || "Geral", 
                    description: r.notes || "Sem descrição", 
                    company: "CyberBox Cliente", 
                    date: r.date || "N/A", 
                    itemsCount: 0,
                    type: r.type_name || "Geral",
                    subtype: null,
                    // 🟢 Mapeia os dados reais que vêm do teu novo backend
                    assignedToId: r.assignedToId || "",
                    assignedToName: r.assignedToName || "Sem atribuição",
                    status: r.status || "Pendente" 
                }));

                setRequests(mappedRequests);
            } else {
                setRequests([]);
            }

        } catch (err) {
            console.error("Erro ao carregar pedidos:", err.message);
            setRequests([]);
        } finally {
            setLoading(false);
        }
    };

    // Função para disparar o PUT para a API quando mudas o gestor
    const handleAssignManager = async (requestId, managerId) => {
        try {
            const res = await axios.put(`https://orion-dewp.onrender.com/api/requests/${requestId}/assign`, {
                managerId: managerId ? parseInt(managerId) : null
            });

            if (res.data.success) {
                await reloadRequests(); // Recarrega os dados reais
                setActiveAssignId(null); // Fecha a dropdown do card
            } else {
                alert("Erro ao atribuir gestor: " + res.data.message);
            }
        } catch (err) {
            alert("Erro de ligação: " + err.message);
        }
    };

    useEffect(() => {
        reloadRequests();
    }, []);

    const totalRequests = requests.length;
    const countByStatus = (status) => requests.filter(r => r.status === status).length;

    const filteredRequests = filter === "Todos"
        ? requests
        : requests.filter(r => r.status === filter);

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case "Pendente": return "bg-warning text-dark";
            case "Em Execução": return "bg-info text-dark";
            case "Concluídos": return "bg-secondary";
            default: return "bg-primary";
        }
    };

    if (loading) {
        return <div className="text-center my-5 text-dark"><h5>A carregar gestão de pedidos com Axios... 🚀</h5></div>;
    }

    return (
        <div className="d-flex flex-column gap-4 text-dark text-start">
            <div>
                <h3 className="fw-bold mb-1">Gestão de Pedidos</h3>
                <p className="text-muted small">Gerir pedidos dos clientes</p>
            </div>

            {/* --- Summary Status Cards --- */}
            <div className="row g-3">
                <div className="col">
                    <div className="card p-3 d-flex flex-row align-items-center gap-3 shadow-sm">
                        <div>
                            <div className="text-muted small">Total</div>
                            <h4 className="fw-bold m-0">{totalRequests}</h4>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card p-3 d-flex flex-row align-items-center gap-3 shadow-sm">
                        <div>
                            <div className="text-muted small">Pendentes</div>
                            <h4 className="fw-bold text-primary m-0">{countByStatus("Pendente")}</h4>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card p-3 d-flex flex-row align-items-center gap-3 shadow-sm">
                        <div>
                            <div className="text-muted small">Em Execução</div>
                            <h4 className="fw-bold text-warning m-0">{countByStatus("Em Execução")}</h4>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card p-3 d-flex flex-row align-items-center gap-3 shadow-sm">
                        <div>
                            <div className="text-muted small">Concluídos</div>
                            <h4 className="fw-bold text-secondary m-0">{countByStatus("Concluídos")}</h4>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Filter Tab Menu --- */}
            <div className="card p-3 shadow-sm">
                <div className="d-flex align-items-center gap-2 mb-2 text-muted small fw-semibold">
                    <span>Filtros</span>
                </div>
                <div className="d-flex gap-2">
                    {["Todos", "Pendente", "Em Execução", "Concluídos"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`btn btn-sm px-3 ${filter === status ? "btn-primary" : "btn-light border text-secondary"}`}
                        >
                            {status}
                            {countByStatus(status) > 0 && ` (${countByStatus(status)})`}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- Request Row Items View --- */}
            <div className="d-flex flex-column gap-2">
                {filteredRequests.map((request) => (
                    <div key={request.id} className="card p-3 shadow-sm bg-white d-flex flex-row justify-content-between align-items-center border-start border-4 border-info">
                        <div>
                            <div className="d-flex align-items-center gap-2 mb-1">
                                <h6 className="fw-bold m-0">{request.title}</h6>
                                <span className={`badge ${getStatusBadgeClass(request.status)}`} style={{ fontSize: "10px" }}>
                                    {request.status}
                                </span>
                            </div>
                            <p className="text-muted small m-0 mb-2">{request.description}</p>
                            
                            <div className="d-flex align-items-center flex-wrap gap-3 text-secondary" style={{ fontSize: "12px" }}>
                                <span>👤 {request.company}</span>
                                <span>📅 {request.date}</span>
                                {request.subtype && <span className="text-dark bg-light px-1 rounded">🏷️ Subtipo: {request.subtype}</span>}
                                <span>🛠️ {request.type}</span>
                                
                                {/* 🟢 GESTÃO DO BOTÃO / DROPDOWN DENTRO DOS INFOS DO CARD */}
                                {activeAssignId === request.id ? (
                                    <div className="d-flex align-items-center gap-1">
                                        <select
                                            className="form-select form-select-sm border-primary w-auto"
                                            defaultValue={request.assignedToId || ""}
                                            onChange={(e) => handleAssignManager(request.id, e.target.value)}
                                        >
                                            <option value="">⚠️ Sem atribuição</option>
                                            {managers && managers.map((m) => (
                                                <option key={m.id} value={m.id}>
                                                    👤 {m.name || m.nome}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-danger px-2"
                                            onClick={() => setActiveAssignId(null)}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ) : (
                                    <div className="d-flex align-items-center gap-2">
                                        <span className="text-primary fw-medium">
                                            Atribuído: {request.assignedToId ? request.assignedToName : "Sem atribuição"}
                                        </span>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-dark px-2"
                                            onClick={() => setActiveAssignId(request.id)}
                                        >
                                            {request.assignedToId ? "Alterar" : "Atribuir"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {filteredRequests.length === 0 && (
                    <div className="text-center text-muted p-4 bg-white border rounded">
                        Nenhum pedido encontrado com o estado atual selecionado.
                    </div>
                )}
            </div>
        </div>
    );
}


function Docs() {
    return (
        <div className="card p-3">
            <h5>Documentos</h5>
            <p>Repositório de ficheiros</p>
        </div>
    );
}

function Settings() {
    return (
        <div className="card p-3">
            <h5>Configurações</h5>
            <div className="mb-3">
                <label className="form-label">Nome</label>
                <input className="form-control" defaultValue="Admin User" />
            </div>
            <div className="mb-3">
                <label className="form-label">Email</label>
                <input className="form-control" defaultValue="admin@cyberbox.pt" />
            </div>
            <button type="button" className="btn btn-dark">Guardar</button>
        </div>
    );
}

function Card({ title, value, color }) {
    return (
        <div className="col-md-3">
            <div className={`card text-bg-${color} p-3`}>
                <h6>{title}</h6>
                <h3>{value}</h3>
            </div>
        </div>
    );
}

function Content() {
    const [pages, setPages] = useState([
        { id: 1, page: "Início", section: "Hero", content: "Segurança cibernética para empresas modernas.", updated: "10/05/2026" },
        { id: 2, page: "Home", section: "Sobre nós", content: "A CyberBox protege empresas desde 2018...", updated: "08/05/2026" },
        { id: 3, page: "Serviços", section: "Intro", content: "Oferecemos soluções completas de cibersegurança.", updated: "02/05/2026" },
        { id: 4, page: "NIS2", section: "Descrição", content: "A diretiva NIS2 entra em vigor em 2024...", updated: "28/04/2026" },
        { id: 5, page: "Contacto", section: "Texto", content: "Entre em contacto connosco para mais informações.", updated: "20/04/2026" },
    ]);
    const [editing, setEditing] = useState(null);
    const [text, setText] = useState("");

    // TODO: replace useState initial data with API call when endpoint is ready
    // const reloadContent = async () => {
    //     const res = await fetch("https://orion-dewp.onrender.com/api/content");
    //     const data = await res.json();
    //     setPages(data.content);
    // };
    // useEffect(() => { reloadContent(); }, []);

    const handleEdit = (item) => { setEditing(item.id); setText(item.content); };

    const handleSave = async (id) => {
        // TODO: uncomment when endpoint is ready
        // try {
        //     const res = await fetch(`https://orion-dewp.onrender.com/api/content/${id}`, {
        //         method: "PUT",
        //         headers: { "Content-Type": "application/json" },
        //         body: JSON.stringify({ content: text })
        //     });
        //     const data = await res.json();
        //     if (!data.success) { alert("Error: " + data.message); return; }
        //     await reloadContent();
        // } catch (err) {
        //     alert("Connection error: " + err.message);
        // }

        // TODO: remove this local update once API is connected
        setPages(pages.map(p => p.id === id ? { ...p, content: text, updated: new Date().toLocaleDateString("pt-PT") } : p));
        setEditing(null);
    };

    return (
        <div className="card p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Gestão de Conteúdo</h5>
                <span className="badge bg-secondary">{pages.length} secções</span>
            </div>
            <table className="table">
                <thead>
                    <tr><th>Página</th><th>Secção</th><th>Conteúdo</th><th>Atualizado</th><th>Ação</th></tr>
                </thead>
                <tbody>
                    {pages.map((item) => (
                        <tr key={item.id}>
                            <td><span className="badge bg-dark">{item.page}</span></td>
                            <td>{item.section}</td>
                            <td style={{ maxWidth: 250 }}>
                                {editing === item.id
                                    ? <textarea className="form-control form-control-sm" rows={2}
                                        value={text} onChange={(e) => setText(e.target.value)} />
                                    : <span className="text-muted" style={{ fontSize: 13 }}>{item.content}</span>}
                            </td>
                            <td style={{ fontSize: 13, color: "#6b7280" }}>{item.updated}</td>
                            <td>
                                {editing === item.id ? (
                                    <>
                                        <button type="button" className="btn btn-sm btn-success me-1" onClick={() => handleSave(item.id)}>Guardar</button>
                                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setEditing(null)}>Cancelar</button>
                                    </>
                                ) : (
                                    <button type="button" className="btn btn-sm btn-outline-dark" onClick={() => handleEdit(item)}>Editar</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}