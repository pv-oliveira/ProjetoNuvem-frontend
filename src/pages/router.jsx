import React, { useContext } from 'react'
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { UserContext } from './../context/user-context';
import Login from './Login/login';
import ListaClientes from './Clientes/clientes';
import Header from '../components/header/header.component';


const router = () => {
  const auth = useContext(UserContext)

  console.log('teste')

  // Componente que confere se há usuario conectado, só permite acesso a rotas privadas a usuarios
  const PrivateRoute = () => {
    return auth.currentUser ? <Header> <Outlet /> </Header> : <Navigate to="/" />
  }
    
  return (
    <>
    <Routes>
      <Route element={<PrivateRoute />}>
        <Route path="/clientes" element={<ListaClientes />} />
      </Route>

      <Route path="/" element={!auth.currentUser ? <Login /> : <Navigate to="/clientes" />} />
      <Route path='/*' element={<Navigate to='/' />} />
    </Routes>
  </>
  )
}

export default router