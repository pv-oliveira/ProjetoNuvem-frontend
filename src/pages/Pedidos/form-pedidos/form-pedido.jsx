import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../../context/user-context';
// import { FiCheckCircle } from 'react-icons/fi';

import api from '../../../utils/axios';
import Modal from '../../../components/modal/modal.components';

import './form-pedido.styles.css'


const FormPedido = ({ parentState, setParentState, setPedido, pedido, updating }) => {
    // Campos com dados que são utilizados nas operações do CRUD
    const [formFields, setFormFields] = useState({
        description: "",
        client: "",
        product: "",
        address: "",
    });
    const { _id, description, client, product, address } = formFields;

    
    const [produtos, setProdutos] = useState([]);
    const [clientes, setClientes] = useState([]);

    // Controle do modal
    const [modalOption, setModalOption] = useState("form");

    // Recebendo dados do usuario logado do Context para validação do token
    const auth = useContext(UserContext)

    useEffect(() => {
        async function fetchData() {
            if (!updating) return
            // Caso state "updating" seja true os campos serão preenchidos com os dado selecionado
            setFormFields(pedido)
        }
        // Baixando dados
        fetchData()
    }, [parentState]);
    
    useEffect(() => {
        const fetchData = async () => {
          const clientes = await api.get("/client/getClients", {
            headers: { authorization: auth.currentUser?.token },
          });
          const produtos = await api.get("/product/getProducts", {
            headers: { authorization: auth.currentUser?.token },
          });
          setClientes(clientes.data);
          setProdutos(produtos.data);
        };
        fetchData();
      }, []);

    // Função que atribui valor inserido ao hook "data" 
    const handleChange = (event) => {
        const { name, value } = event.target;
        
        setFormFields({ ...formFields, [name]: value });

    };

    // Função que executa as operações CREATE e UPDATE
    const handleSubmit = async (event) => {
        event.preventDefault();
        
        //Dados são enviados ao backend para serem enviados ao banco de dados, com validação do token
        if (updating) {
            const res = await api.post("/pedido/updatePedido", { _id, description, client_id: client, product_id: product, address }, { headers: { authorization: auth.currentUser?.token}});

            res ? window.location.reload() : null
            return;
        } else {
            api.post("/pedido/create", { description, client_id: client, product_id: product, address }, { headers: { authorization: auth.currentUser?.token}})
            .then(res => {
                console.log(res)
                window.location.reload()
            });
            return;
        }
    };

    // Caso modal seja fechado evita que existam dados anteriores nos states
    function handleQuestion(toParentState, toLimpezaParcial, limparItem) {
        setParentState(toParentState);
        if (limparItem) setPedido("");
        setModalOption("form");
    }

    const modalOptionsMap = {
        confirm:
            <>
                <span style={{ fontSize: "40pt", color: "#4eaf2e" }}>
                    
                </span>
                <h4>
                    Ação concluída com sucesso!
                    <br /> Deseja continuar cadastrando?
                </h4>
                <div style={{ marginTop: "25px" }}>
                    <button
                        className="button"
                        style={{ marginRight: "40px" }}
                        onClick={() => handleQuestion(true, true, false)}
                    >
                        Sim
                    </button>
                    <button
                        className="button"
                        style={{
                            color: "#006699",
                            backgroundColor: "white",
                            border: "1px solid",
                        }}
                        onClick={() => handleQuestion(false, false, true)}
                    >
                        Não
                    </button>
                </div>
            </>,
        form: (
            <>
                <form
                    onSubmit={handleSubmit}
                    className='form-container'
                    id="modal-pedido-form"
                    >
                    <h2>Cadastro pedido:</h2>
                    <div className='input-container-modal'>
                    <span style={{padding: '20px'}}>Clientes:
                        <select name="client" id="client" value={pedido.client_id} onChange={handleChange}>
                            <option value="">Selecione</option>
                            {clientes.map((cliente) => (
                                <option value={cliente._id}>{cliente.name}</option>
                            ))}
                        </select>
                        </span>

                        <span style={{padding: '20px'}}>Produtos:
                        <select name="product" id="product" value={pedido.product_id} onChange={handleChange}>
                            <option value="">Selecione</option>
                            {produtos.map((produto) => (
                                <option value={produto._id}>{produto.name}</option>
                            ))}
                        </select>
                        </span>


                        <span >Endereço:
                            <input
                                style={{ width: '300px' }}
                                type="text"
                                required
                                id="address"
                                name="address"
                                value={address}
                                onChange={handleChange}
                            />
                        </span>

                        <div style={{padding: '20px'}}>Observações:
                            <textarea
                                type="text"
                                required
                                id="description"
                                name="description"
                                value={description}
                                onChange={handleChange}
                            />
                        </div>
                        
                        
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
                        <button className='button' >Enviar</button>

                        <button
                            type='button'
                            className="button"
                            style={{
                                color: "#006699",
                                backgroundColor: "white",
                                border: "1px solid",
                            }}
                            onClick={() => handleQuestion(false, false, true)}
                        >
                            Sair
                        </button>
                    </div>
                </form>
            </>
        )
    }

    return (<>
        <Modal parentState={parentState}>{modalOptionsMap[modalOption]}</Modal>
    </>
    )
}

export default FormPedido