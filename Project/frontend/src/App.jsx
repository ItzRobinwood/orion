import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import Services from "./pages/services";
import NIS2 from "./pages/NIS2";
import Sectors from "./pages/sectors";
import Methodology from "./pages/methodology";
import News from "./pages/news";
import Contacts from "./pages/contacts";
import ClientArea from "./pages/clientArea";
import Login from "./pages/login";
import AdminDashboard from "./pages/adminDashboard";
import ClientDashboard from "./pages/clientDashboard";
import ManagerDashboard from "./pages/managerDashboard";
import './App.css';

function ProtectedRoute({ children, allowedTypes }) {
  const token = localStorage.getItem("token");
  const userType = Number(localStorage.getItem("userType"));

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedTypes && !allowedTypes.includes(userType)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/NIS2" element={<NIS2 />} />
        <Route path="/sectors" element={<Sectors />} />
        <Route path="/methodology" element={<Methodology />} />
        <Route path="/news" element={<News />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/clientArea" element={<ClientArea />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/adminDashboard"
          element={
            <ProtectedRoute allowedTypes={[1]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/managerDashboard"
          element={
            <ProtectedRoute allowedTypes={[2]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clientDashboard"
          element={
            <ProtectedRoute allowedTypes={[3]}>
              <ClientDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;