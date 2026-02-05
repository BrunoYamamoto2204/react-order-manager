import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Analises } from "./pages/Analises";
import { Clientes } from "./pages/Clientes";
import { Home } from "./pages/Home";
import { Pedidos } from "./pages/Pedidos";
import { Produtos } from "./pages/Produtos";

import "./styles/global.css";
import "./styles/theme.css";
import { CreateProdutos } from "./pages/Produtos/createProdutos";
import { MessageContainer } from "./components/Messages/MessageContainer";
import { CreateCliente } from "./pages/Clientes/createCliente";
import { CreatePedido } from "./pages/Pedidos/createPedido";
import { EditPedido } from "./pages/Pedidos/editPedido";
import { EditProdutos } from "./pages/Produtos/editProdutos";
import { EditCliente } from "./pages/Clientes/editCliente";
import { Login } from "./pages/Login";
import { AuthProvider } from "./context/AuthProvider";
import { useAuth } from "./hooks/useAuth";
import { Financeiro } from "./pages/Financeiro";
import { CreateFinanceiro } from "./pages/Financeiro/createFinanceiro";

function ProtectedRoute({ children }: {children: React.ReactNode }){
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '2rem',
          color: 'var(--primary)'
      }}>
          Carregando...
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login"></Navigate>
  }

  return <>{children}</>
}

function AppRoutes(){
  const { user } = useAuth()

  return (
    <Routes>
      {/* Rota de Login */}
      <Route 
        path="/login" 
        element={user ? <Navigate to="/" replace /> : <Login />}
      />
      <Route path="/login" element={<Login />}></Route>
      
      {/* Rotas protegidas */}
      <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
      }/>

      <Route path="/analises" element={
          <ProtectedRoute>
            <Analises />
          </ProtectedRoute>
      }/>

      <Route path="/clientes" element={
          <ProtectedRoute>
            <Clientes />
          </ProtectedRoute>
      }/>

      <Route path="/pedidos" element={
          <ProtectedRoute>
            <Pedidos />
          </ProtectedRoute>
      }/>

      <Route path="/financeiro" element={
        <ProtectedRoute>
          <Financeiro />
        </ProtectedRoute>
      }/>

      <Route path="/produtos" element={
          <ProtectedRoute>
            <Produtos />
          </ProtectedRoute>
      }/>

      <Route path="/produtos/criar" element={
          <ProtectedRoute>
            <CreateProdutos />
          </ProtectedRoute>
      }/>

      <Route path="/clientes/criar" element={
          <ProtectedRoute>
            <CreateCliente />
          </ProtectedRoute>
      }/>

      <Route path="/pedidos/novo" element={
          <ProtectedRoute>
            <CreatePedido />
          </ProtectedRoute>
      }/>

      <Route path="/financeiro/criar" element={
        <ProtectedRoute>
          <CreateFinanceiro />
        </ProtectedRoute>
      }/>

      <Route path="/pedidos/editar/:id" element={
          <ProtectedRoute>
            <EditPedido />
          </ProtectedRoute>
      }/>

      <Route path="/produtos/editar/:id" element={
          <ProtectedRoute>
            <EditProdutos />
          </ProtectedRoute>
      }/>

      <Route path="/clientes/editar/:id" element={
          <ProtectedRoute>
            <EditCliente />
          </ProtectedRoute>
      }/>

      {/* Rota de fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export function App(){
  return(
    <BrowserRouter>  {/*Usar navigate para navergar entre componentes */}
       <AuthProvider> {/* Verifica se há login e se o token é válido */}
        <MessageContainer > {/*Usar Mensagens do Toastify */}
          <AppRoutes />
        </MessageContainer>
      </AuthProvider>
    </BrowserRouter>
  )
}