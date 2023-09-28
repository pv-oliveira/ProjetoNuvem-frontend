import React, { useContext, useEffect, useState } from "react";
import DynamicTable from "../../components/dynamic-table/dynamic-table";
import api from "../../utils/axios";
import { UserContext } from "../../context/user-context";
import FormPedido from "./form-pedidos/form-pedido";
import Modal from "../../components/modal/modal.components";
import Geral from "./geral";

const Pedidos = () => {
  const data = {
    description: "",
    client: "",
    product: "",
    address: "",
  };

  const [modalForm, setModalForm] = useState(false); //Hook para controle do modal do formulário
  const [modalGeral, setModalGeral] = useState(false); //Hook para controle do modal das info gerais
  const [modalDelete, setModalDelete] = useState(false); //Hook para controle do modal que remoção

  const [pedido, setPedido] = useState(data); //Hook para armazenamento do objeto com os dados, para ser passado aos componentes filhos
  const [updating, setUpdating] = useState(false); //Hook para controle do modo update

  const [staticData, setStaticData] = useState([]); //Dados baixados do backend (READ) que já foram previamente cadastrado
  const [load, setLoad] = useState(false); // Hook para renderezação aguardar dados serem baixados

  const auth = useContext(UserContext);

  // Função para exclusão (DELETE) de dados selecionado
  const handleDelete = async () => {
    if (!pedido) return alert("Nenhum dado selecionado!");
    const id = pedido._id;

    await api.post(
      "/pedido/deletePedido",
      { id },
      { headers: { authorization: auth.currentUser?.token } }
    );
    window.location.reload();
    return;
  };

  // Dados são baixados do backend antes da renderização
  useEffect(() => {
    const fetchData = async () => {
      const data = await api.get("/pedido/getPedidos", {
        headers: { authorization: auth.currentUser?.token },
      });
      
      setStaticData(data.data);
      setLoad(true);
    };
    fetchData();
  }, [modalForm]);



  if (!load) return <h3>Carregando...</h3>;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
        <Modal parentState={modalDelete}>
        <>
          <p> Tem certeza que deseja excluir os dados do pedido de {`${pedido.produto}`} permanentemente do banco de dados? </p>
          <span>
            <button className="button" onClick={handleDelete}  > Confirmar </button>
            <button className="button" onClick={() => setModalDelete(false)} > Cancelar </button>
          </span>
        </>
      </Modal>

      <Geral
        parentState={modalGeral}
        setParentState={setModalGeral}
        setPedido={setPedido}
        pedido={pedido}
      />

      <FormPedido
        parentState={modalForm}
        setParentState={setModalForm}
        pedido={pedido}
        setPedido={setPedido}
        updating={updating}
      />

      <h2>Lista Pedidos</h2>

      <DynamicTable
        hoveble={true}
        dataStatic={staticData}
        dataStruct={[
          {
            header: "Produto",
            field: "produto",
          },
          {
            header: "Cliente",
            field: "cliente",
          },
          {
            header: "Endereço",
            field: "address",
          },
          {
            header: "Observação",
            field: "description",
          },
        ]}
        navItens={[
          {
            returnIcon: () => {},
            describe: "General Information",
            action: (itens, dataCache) => {
              setPedido(dataCache.filter((item) => item._id === itens[0])[0]);
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
              setPedido(dataCache.filter((item) => item._id === itens[0])[0]);
              setModalForm(true);
            },
            activeWith: (itens, cache) =>
              itens.length === 1 && cache.find((item) => item._id === itens[0]),
          },
          {
            returnIcon: () => {},
            describe: "Delete",
            action: (itens, dataCache) => {
              setPedido(dataCache.filter((item) => item._id === itens[0])[0]);
              setModalDelete(true);
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

export default Pedidos;
