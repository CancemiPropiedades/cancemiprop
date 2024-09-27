import React from "react";
import ImgInicio from '../Imagenes/inicio.png';
import FormularioBusqueda from "../Componentes/FormularioBusqueda";
import Card from "../Componentes/Card";
import PropertySearch from "../Componentes/PropertySearchPage";
import '../Css/Home.css';

function Home() {
  return (
    <div>
      <div>
            <h1>Bienvenido a Inmobiliaria</h1>
            <PropertySearch />
        </div>
      <div className="ContainerImg">
        <FormularioBusqueda/>
        <img className="imgInicio" src={ImgInicio} alt="Imagen de inicio" />
      </div>
      <div className="ContainerCards">
        <Card/>
      </div>
    </div>
  );
}

export default Home;