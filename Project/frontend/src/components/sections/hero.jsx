import React from "react";
import heroImage from "../../assets/heroimg.png";
import { getContent } from "../../services/contentService";

function Hero() {
  return (
    <section
      className="text-white py-5"
      style={{ background: "linear-gradient(to right, #2c3e50, #3c8dbc)" }}
    >
      <div className="container">
        <div className="row align-items-center">

          <div className="col-md-6">
            <h1 className="display-4 fw-bold mb-4">
              {getContent("Início", "Hero Título", "Cibersegurança para organizações")}
            </h1>
            <p className="lead mb-4">
              {getContent("Início", "Hero Texto", "Num contexto em que os ataques cibernéticos aumentam todos os dias...")}
            </p>
            <button className="btn btn-light btn-lg">
              {getContent("Início", "Hero Botão", "Contactar")}
            </button>
          </div>

          <div className="col-md-6 text-center">
            <div className="img-container">
              <img
                src={heroImage}
                alt="Tecnologia meeting"
                className="w-100 rounded shadow"
                style={{
                  height: "350px",
                  objectFit: "cover",
                  objectPosition: "center"
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