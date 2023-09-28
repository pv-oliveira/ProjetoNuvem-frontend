import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/user-context';

import './header.styles.css'

/* Componente Header para navegação entre as páginas */

const Header = ({children}) => {
  const navigate = useNavigate();     // Hook que permite a navegação
  
  // Dados do usuario recebidos do Context para ser usado no sign
  const { setCurrentUser, setToken } = useContext(UserContext) 

  return ( <>
    <div className='navigation'>
      <div className='routes-links'>
        <button className="button" onClick={() => navigate('/clientes')}>Clientes</button>
        <button className="button" onClick={() => navigate('/produtos')}>Produtos</button>
        <button className="button" onClick={() => navigate('/pedidos')}>Pedidos</button>
      </div>
      <div className='nav-links'>
        {/* <button className="four-btn" onClick={() => navigate('/')}>Login</button> */}
        <button className="button" onClick={() => {setCurrentUser(null); setToken('')}}>Logout</button>
      </div>
    </div>
   {children}
  </>
  )
}

export default Header