import { BrowserRouter, Routes, Route } from "react-router";
import { Analises } from "./pages/Analises";
import { Clientes } from "./pages/Clientes";
import { Home } from "./pages/Home";
import { Pedidos } from "./pages/Pedidos";
import { Produtos } from "./pages/Produtos";

import "./styles/global.css";
import "./styles/theme.css";
import { CreateProdutos } from "./pages/Produtos/createProdutos";
import { MessageContainer } from "./components/Messages/MessageContainer";

export function App(){
  return (
    <BrowserRouter>
        <MessageContainer >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analises" element={<Analises />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/pedidos" element={<Pedidos />} />
            <Route path="/produtos" element={<Produtos />} />
            <Route path="/produtos/criar" element={<CreateProdutos />} />
          </Routes>
        </MessageContainer>
    </BrowserRouter>
  )
}