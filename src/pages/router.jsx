import React, { useContext } from 'react'
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { UserContext } from './../context/user-context';
import Login from './Login/login';
import ListaClientes from './Clientes/clientes';
import ListaProdutos from './Produtos/produtos';
import ListaPedidos from './Pedidos/pedidos';
import Header from '../components/header/header.component';


const router = () => {
  const auth = useContext(UserContext)

  // Componente que confere se há usuario conectado, só permite acesso a rotas privadas a usuarios
  const PrivateRoute = () => {
    return auth.currentUser ? <Header> <Outlet /> </Header> : <Navigate to="/" />
  }
    
  return (
    <>
    <Routes>
      <Route element={<PrivateRoute />}>
        <Route path="/clientes" element={<ListaClientes />} />
        <Route path="/produtos" element={<ListaProdutos />} />
        <Route path="/pedidos" element={<ListaPedidos />} />
      </Route>

      <Route path="/" element={!auth.currentUser ? <Login /> : <Navigate to="/clientes" />} />
      <Route path='/*' element={<Navigate to='/' />} />
    </Routes>
  </>
  )
}

export default router