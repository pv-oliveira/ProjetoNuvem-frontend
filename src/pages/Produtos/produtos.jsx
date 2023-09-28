import React, { useContext, useEffect, useState } from 'react'
import api from '../../utils/axios';
import { UserContext } from '../../context/user-context';
import DynamicTable from '../../components/dynamic-table/dynamic-table';
import FormProduto from './form-produtos/form-produto';
import GeralProduto from "./geral"
import Modal from '../../components/modal/modal.components';

const Produtos = () => {
      // Dados que são recebidos
  const data = {
    name: "",
    type: "",
    price: 0,
    promotion: false,
    discount: "",
  }

  const [modalForm, setModalForm] = useState(false);        //Hook para controle do modal do formulário
  const [modalGeral, setModalGeral] = useState(false);      //Hook para controle do modal das info gerais
  const [modalDelete, setModalDelete] = useState(false);    //Hook para controle do modal que remoção 

  const [produto, setProduto] = useState(data);                   //Hook para armazenamento do objeto com os dados, para ser passado aos componentes filhos
  const [updating, setUpdating] = useState(false);          //Hook para controle do modo update

  const [staticData, setStaticData] = useState([]);         //Dados baixados do backend (READ) que já foram previamente cadastrado 
  const [load, setLoad] = useState(false);                  // Hook para renderezação aguardar dados serem baixados

  const auth = useContext(UserContext);

  // Função para exclusão (DELETE) de dados selecionado
  const handleDelete = async () => {
    if (!produto) return alert("Nenhum dado selecionado!");
    const id = produto._id
    
    await api.post('/product/deleteProduct', { id }, { headers: { authorization: auth.currentUser?.token } })
    window.location.reload()
    return
  }

  // Dados são baixados do backend antes da renderização
  useEffect(() => {
    const fetchData = async () => {
      
      const data = await api.get("/product/getProducts", { headers: { authorization: auth.currentUser?.token } });

      setStaticData(data.data);
      setLoad(true);
    };
    fetchData();
  }, [modalForm]);

  if (!load) return <h3>Carregando...</h3>;
  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent:'center', alignItems: 'center'}}>
      <Modal parentState={modalDelete}>
        <>
          <p> Tem certeza que deseja excluir os dados de {`${produto.name}`} permanentemente do banco de dados? </p>
          <span>
            <button className="button" onClick={handleDelete}  > Confirmar </button>
            <button className="button" onClick={() => setModalDelete(false)} > Cancelar </button>
          </span>
        </>
      </Modal>

      <GeralProduto
        parentState={modalGeral}
        setParentState={setModalGeral}
        setProduto={setProduto}
        produto={produto}
      />

      <FormProduto
        parentState={modalForm}
        setParentState={setModalForm}
        produto={produto}
        setProduto={setProduto}
        updating={updating}
      />
      <h2>Lista Produtos</h2>
      <DynamicTable
        hoveble={true}
        dataStatic={staticData}
        dataStruct={[
          {
            header: "Nome",
            field: "name",
          },
          {
            header: "Tipo",
            field: "type",
          },
          {
            header: "Preço",
            field: "price",
          },
          {
            header: "Promoção",
            field: "promocao",
          },
          {
            header: "Desconto",
            field: "desconto",
          },
          {
            header: "Valor",
            field: "valor",
          }
        ]}
        navItens={[
          {
            returnIcon: () => {},
            describe: "General Information",
            action: (itens, dataCache) => {
              setProduto(dataCache.filter(item => item._id === itens[0])[0])
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
              setProduto(dataCache.filter(item => item._id === itens[0])[0])
              setModalForm(true);
            },
            activeWith: (itens, cache) =>
              itens.length === 1 && cache.find((item) => item._id === itens[0]),
          },
          {
            returnIcon: () => {},
            describe: "Delete",
            action: (itens, dataCache) => {
              setProduto(dataCache.filter(item => item._id === itens[0])[0])
              setModalDelete(true)
            },
            activeWith: (itens, cache) =>
              itens.length === 1 && cache.find((item) => item._id === itens[0]),
            red: true,
          },
        ]}
      />
    </div>
  )
}

export default Produtos