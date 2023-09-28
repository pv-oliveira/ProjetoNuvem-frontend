import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../../context/user-context';
// import { FiCheckCircle } from 'react-icons/fi';

import api from '../../../utils/axios';
import Modal from '../../../components/modal/modal.components';

import './form-produto.styles.css'


const FormProduto = ({ parentState, setParentState, setProduto, produto, updating }) => {
    // Campos com dados que são utilizados nas operações do CRUD
    const [formFields, setFormFields] = useState({
        name: "",
        type: "",
        price: "",
        promotion: false,
        discount: "",
    });
    const { _id, name, type, price, promotion, discount } = formFields;

    // Controle do modal
    const [modalOption, setModalOption] = useState("form");

    // Recebendo dados do usuario logado do Context para validação do token
    const auth = useContext(UserContext)

    useEffect(() => {
        async function fetchData() {
            if (!updating) return
            // Caso state "updating" seja true os campos serão preenchidos com os dado selecionado
            setFormFields(produto)
        }
        // Baixando dados
        fetchData()
    }, [parentState])

    // Função que atribui valor inserido ao hook "data" 
    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        
        if (type === 'checkbox') {
            setFormFields({ ...formFields, [name]: checked });
          } else {
            setFormFields({ ...formFields, [name]: value });
          }
    };

    // Função que executa as operações CREATE e UPDATE
    const handleSubmit = async (event) => {
        event.preventDefault();
        
        //Dados são enviados ao backend para serem enviados ao banco de dados, com validação do token
        if (updating) {
            const res = await api.post("/product/updateProduct", { _id, name, type, price: parseFloat(price), promotion, discount }, { headers: { authorization: auth.currentUser?.token}});

            res ? window.location.reload() : null
            return;
        } else {
            api.post("/product/create", { name, type, price: parseFloat(price), promotion, discount }, { headers: { authorization: auth.currentUser?.token}})
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
        if (limparItem) setProduto("");
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
                        className="primary-button"
                        style={{ marginRight: "40px" }}
                        onClick={() => handleQuestion(true, true, false)}
                    >
                        Sim
                    </button>
                    <button
                        className="primary-button"
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
                    >
                    <h2>Cadastro produto:</h2>
                    <div className='input-container-modal'>
                        <span >Nome:
                            <input
                                type="text"
                                required
                                id="name"
                                name="name"
                                value={name}
                                onChange={handleChange}
                            />
                        </span>
                        <span style={{padding: '20px'}}>Tipo:
                            <input
                                type="text"
                                required
                                id="type"
                                name="type"
                                value={type}
                                onChange={handleChange}
                            />
                        </span>
                        <span style={{padding: '20px'}}>Preço:
                            <input
                                type="text"
                                required
                                placeholder='R$'
                                id="price"
                                name="price"
                                value={price}
                                onChange={handleChange}
                            />
                        </span>
                        <div className='label-check'>
                        <label style={{marginRight: '140px', fontSize: '16px', marginTop: '2rem'}}>Promoção: </label>
                            <label className="switch" id="switch_promotion">
                            <input
                                className='check'
                                type="checkbox"
                                name='promotion'
                                checked={promotion}
                                onChange={handleChange}
                                ></input>
                            <span className="slider round" style={{margin: '0px'}}></span>
                            </label>
                        </div>
                        <span style={{padding: '20px'}}>Desconto:
                            <input
                                disabled={!promotion}
                                type="text"
                                required
                                id="discount"
                                name="discount"
                                value={discount}
                                onChange={handleChange}
                            />
                        </span>
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

export default FormProduto