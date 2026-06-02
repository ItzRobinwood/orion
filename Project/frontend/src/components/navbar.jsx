import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar navbar-expand bg-white shadow-sm">
      <div className="container">

        <Link className="navbar-brand fw-bold" to="/">
          CyberBox
        </Link>

        <ul className="navbar-nav ms-auto align-items-center">
          <li className="nav-item"><Link className="nav-link" to="/">Início</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/services">Serviços</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/NIS2">NIS2</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/sectors">Setores</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/methodology">Metodologia</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/news">Notícias</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/contacts">Contatos</Link></li>
          <li className="nav-item ms-2">
            <Link className="btn btn-primary" to="/login">Login</Link>
          </li>
        </ul>

      </div>
    </nav>
  );
}

export default Navbar;