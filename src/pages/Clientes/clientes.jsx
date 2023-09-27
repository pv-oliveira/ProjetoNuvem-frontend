import React, { useState, useEffect, useContext } from "react";
// import { FiEdit3, FiEye, FiFilePlus, FiTrash2 } from "react-icons/fi";

import api from "../../utils/axios";
import DynamicTable from "../../components/dynamic-table/dynamic-table";
import Modal from '../../components/modal/modal.components';

import GeralCrud from "./geral";
import { UserContext } from "../../context/user-context";
import FormCliente from "./Form-Clientes/form-cliente";


const ListaClientes = () => {
  // Dados que são recebidos
  const data = {
    name: "",
    email: "",
    cpf: "",
    address: "",
    phone: "",
  }
  
  const [modalForm, setModalForm] = useState(false);        //Hook para controle do modal do formulário
  const [modalGeral, setModalGeral] = useState(false);      //Hook para controle do modal das info gerais
  const [modalDelete, setModalDelete] = useState(false);    //Hook para controle do modal que remoção 

  const [crud, setCrud] = useState(data);                   //Hook para armazenamento do objeto com os dados, para ser passado aos componentes filhos
  const [updating, setUpdating] = useState(false);          //Hook para controle do modo update

  const [staticData, setStaticData] = useState([]);         //Dados baixados do backend (READ) que já foram previamente cadastrado 
  const [load, setLoad] = useState(false);                  // Hook para renderezação aguardar dados serem baixados

  const auth = useContext(UserContext)

  // Função para exclusão (DELETE) de dados selecionado
  const handleDelete = async () => {
    if (!crud) return alert("Nenhum dado selecionado!");
    const id = crud._id
    
    await api.post('/client/deleteClient', { id }, { headers: { authorization: auth.currentUser?.token } })
    window.location.reload()
    return
  }

  // Dados são baixados do backend antes da renderização
  useEffect(() => {
    const fetchData = async () => {
      
      const users = await api.get("/client/getClients", { headers: { authorization: auth.currentUser?.token } });

      setStaticData(users.data);
      setLoad(true);
    };
    fetchData();
  }, [modalForm]);

  
  if (!load) return <h3>Carregando...</h3>;
  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent:'center', alignItems: 'center'}}>

      <Modal parentState={modalDelete}>
        <>
          <p> Tem certeza que deseja excluir os dados de {`${crud.name}`} permanentemente do banco de dados? </p>
          <span>
            <button className="primary-button" onClick={handleDelete}  > Confirmar </button>
            <button className="primary-button" onClick={() => setModalDelete(false)} > Cancelar </button>
          </span>
        </>
      </Modal>

      <GeralCrud
        parentState={modalGeral}
        setParentState={setModalGeral}
        setCrud={setCrud}
        crud={crud}
      />

      <FormCliente
        parentState={modalForm}
        setParentState={setModalForm}
        crud={crud}
        setCrud={setCrud}
        updating={updating}
      />

      <h2>ListaClientes</h2>
      <DynamicTable
        hoveble={true}
        dataStatic={staticData}
        dataStruct={[
          {
            header: "Nome",
            field: "name",
          },
          {
            header: "Email",
            field: "email",
          },
          {
            header: "Cpf",
            field: "cpf",
          },
          {
            header: "Address",
            field: "address",
          },
          {
            header: "Phone",
            field: "phone",
          }
        ]}
        navItens={[
          {
            returnIcon: () => {},
            describe: "General Information",
            action: (itens, dataCache) => {
              setCrud(dataCache.filter(item => item._id === itens[0])[0])
              setModalGeral(true);
            },
            activeWith: (itens, cache) =>
              itens.length === 1 && cache.find((item) => item._id === itens[0]),
          },
          {
            returnIcon: () => {},
            describe: "Create",
            action: (itens, dataCache) => {
              setUpdating(false);
              setModalForm(true);
            },
            activeWith: () => true,
          },
          {
            returnIcon: () => {},
            describe: "Update",
            action: (itens, dataCache) => {
              setUpdating(true);
              setCrud(dataCache.filter(item => item._id === itens[0])[0])
              setModalForm(true);
            },
            activeWith: (itens, cache) =>
              itens.length === 1 && cache.find((item) => item._id === itens[0]),
          },
          {
            returnIcon: () => {},
            describe: "Delete",
            action: (itens, dataCache) => {
              setCrud(dataCache.filter(item => item._id === itens[0])[0])
              setModalDelete(true)
            },
            activeWith: (itens, cache) =>
              itens.length === 1 && cache.find((item) => item._id === itens[0]),
            red: true,
          },
        ]}
      />
    </div>
  );
};

export default ListaClientes;
