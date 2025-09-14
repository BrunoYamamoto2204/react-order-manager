import { BrowserRouter, Routes, Route } from "react-router";
import { Analises } from "./pages/Analises";
import { Clientes } from "./pages/Clientes";
import { Home } from "./pages/Home";
import { Pedidos } from "./pages/Pedidos";
import { Produtos } from "./pages/Produtos";

import "./styles/global.css";
import "./styles/theme.css";

export function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Analises" element={<Analises />} />
        <Route path="/Clientes" element={<Clientes />} />
        <Route path="/Pedidos" element={<Pedidos />} />
        <Route path="/Produtos" element={<Produtos />} />
      </Routes>
    </BrowserRouter>
  )
}