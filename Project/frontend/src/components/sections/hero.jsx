import React from "react";
// 1. Corrected path to go up TWO levels into the src/assets folder
import heroImage from "../../assets/heroimg.png";

function Hero() {
  return (
    <section
      className="text-white py-5"
      style={{ background: "linear-gradient(to right, #2c3e50, #3c8dbc)" }}
    >
      <div className="container">
        <div className="row align-items-center">

          {/* Texto */}
          <div className="col-md-6">
            <h1 className="display-4 fw-bold mb-4">
              Cibersegurança para organizações
            </h1>
            <p className="lead mb-4">
              Num contexto em que os ataques cibernéticos aumentam todos os dias, as organizações precisam de proteger os seus sistemas, dados e serviços críticos. Apoiamos empresas e entidades públicas na redução do risco cibernético, no cumprimento de requisitos regulatórios, incluindo a Diretiva Europeia NIS2, e no reforço da sua postura de segurança.
            </p>
            <button className="btn btn-light btn-lg">
              Contactar
            </button>
          </div>

          {/* Lado direito */}
          {/* Lado direito */}
<div className="col-md-6 text-center">
  <div className="img-container">
    <img 
      src={heroImage} 
      alt="Tecnologiameeting" 
      className="w-100 rounded shadow" 
      style={{ 
        height: "350px",      // 1. Locks the vertical height so it doesn't get too big
        objectFit: "cover",   // 2. Stretches the image sideways cleanly without distorting it
        objectPosition: "center" // 3. Keeps the focus of the image dead center
      }} 
    />
  </div>
</div>

        </div>
      </div>
    </section>
  );
}

export default Hero;