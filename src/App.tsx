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
import { EditFinanceiro } from "./pages/Financeiro/editFinanceiro";
import { Permissoes } from "./pages/Permissoes";
import { checkPermissionAsync } from "./services/permissionApi";
import { useEffect, useState } from "react";

type ProtectedRouteType = { 
  children: React.ReactNode, 
  module: string, 
  action: string,
}

function ProtectedRoute({ children, module, action } : ProtectedRouteType){
  const { user, isLoading } = useAuth()

  const [ isAllowed,  setIsAllowed ] = useState<boolean>()

  useEffect(() => {
    setIsAllowed(undefined)
    let ignore = false

    if (!user?.role) {
      if(!ignore)
        setIsAllowed(false)
      return
    }

    const checkPermission = async () => {
      if (module === "permissions") {
        if(!ignore)
          setIsAllowed(user.role === "admin")
        return
      }

      if (module === "home") {
        if(!ignore)
          setIsAllowed(true)
        return
      }

      const payload = { role: user.role, module: module, permission: action }
      const allowed = await checkPermissionAsync(payload)
      
      if(!ignore)
        setIsAllowed(allowed)
    }

    checkPermission()

    return () => {
        ignore = true
    }
  }, [module, action, user])

  if (isLoading || isAllowed === undefined) {
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

  // Valida se tem usuário
  if (!user) 
    return <Navigate to="/login"></Navigate>

  if (!isAllowed)
    return <Navigate to="/"></Navigate>

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
      
      {/* Rotas protegidas */}
      <Route path="/" element={
          <ProtectedRoute module="home" action="all">
            <Home />
          </ProtectedRoute>
      }/>

      <Route path="/analises" element={
          <ProtectedRoute module="analytics" action="read">
            <Analises />
          </ProtectedRoute>
      }/>

      <Route path="/clientes" element={
          <ProtectedRoute module="customers" action="read">
            <Clientes />
          </ProtectedRoute>
      }/>

      <Route path="/pedidos" element={
          <ProtectedRoute module="orders" action="read">
            <Pedidos />
          </ProtectedRoute>
      }/>

      <Route path="/financeiro" element={
        <ProtectedRoute module="financial" action="read">
          <Financeiro />
        </ProtectedRoute>
      }/>

      <Route path="/produtos" element={
          <ProtectedRoute module="products" action="read">
            <Produtos />
          </ProtectedRoute>
      }/>

      <Route path="/produtos/criar" element={
          <ProtectedRoute module="products" action="create">
            <CreateProdutos />
          </ProtectedRoute>
      }/>

      <Route path="/clientes/criar" element={
          <ProtectedRoute module="customers" action="create">
            <CreateCliente />
          </ProtectedRoute>
      }/>

      <Route path="/pedidos/novo" element={
          <ProtectedRoute module="orders" action="create">
            <CreatePedido />
          </ProtectedRoute>
      }/>

      <Route path="/financeiro/criar" element={
        <ProtectedRoute module="financial" action="create">
          <CreateFinanceiro />
        </ProtectedRoute>
      }/>

      <Route path="/pedidos/editar/:id" element={
          <ProtectedRoute module="orders" action="update">
            <EditPedido />
          </ProtectedRoute>
      }/>

      <Route path="/produtos/editar/:id" element={
          <ProtectedRoute module="products" action="update">
            <EditProdutos />
          </ProtectedRoute>
      }/>

      <Route path="/clientes/editar/:id" element={
          <ProtectedRoute module="customers" action="update">
            <EditCliente />
          </ProtectedRoute>
      }/>

      <Route path="/financeiro/editar/:id" element={
          <ProtectedRoute module="financial" action="update">
            <EditFinanceiro />
          </ProtectedRoute>
      }/>

      <Route path="/permissoes" element={
          <ProtectedRoute module="permissions" action="all">
            <Permissoes />
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