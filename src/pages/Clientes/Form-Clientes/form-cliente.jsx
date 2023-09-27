import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../../context/user-context';
// import { FiCheckCircle } from 'react-icons/fi';

import api from '../../../utils/axios';
import Modal from '../../../components/modal/modal.components';

import './form-cliente.styles.css'


const FormCliente = ({ parentState, setParentState, setCrud, crud, updating }) => {
    // Campos com dados que são utilizados nas operações do CRUD
    const [formFields, setFormFields] = useState({
        name: "",
        email: "",
        cpf: "",
        address: "",
        phone: "",
    });
    const { _id, name, email, cpf, address, phone } = formFields;

    // Controle do modal
    const [modalOption, setModalOption] = useState("form");

    // Recebendo dados do usuario logado do Context para validação do token
    const auth = useContext(UserContext)

    useEffect(() => {
        async function fetchData() {
            if (!updating) return
            // Caso state "updating" seja true os campos serão preenchidos com os dado selecionado
            setFormFields(crud)
        }
        // Baixando dados
        fetchData()
    }, [parentState])

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
            const res = await api.post("/client/updateClient", { _id, name, email, cpf, address, phone }, { headers: { authorization: auth.currentUser?.token}});

            res ? window.location.reload() : null
            return;
        } else {
            api.post("/client/create", { name, email, cpf, address, phone }, { headers: { authorization: auth.currentUser?.token}})
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
        if (limparItem) setCrud("");
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
                    <h2>Enter Data:</h2>
                    <div className='input-container-modal'>
                        <span >Name:
                            <input
                                type="text"
                                required
                                id="name"
                                name="name"
                                value={name}
                                onChange={handleChange}
                            />
                        </span>
                        <span style={{padding: '20px'}}>Email:
                            <input
                                type="text"
                                required
                                id="email"
                                name="email"
                                value={email}
                                onChange={handleChange}
                            />
                        </span>
                        <span style={{padding: '20px'}}>Cpf:
                            <input
                                type="text"
                                required
                                id="cpf"
                                name="cpf"
                                value={cpf}
                                onChange={handleChange}
                            />
                        </span>
                        <span style={{padding: '20px'}}>Address:
                            <input
                                type="text"
                                required
                                id="address"
                                name="address"
                                value={address}
                                onChange={handleChange}
                            />
                        </span>
                        <span style={{padding: '20px'}}>Phone:
                            <input
                                type="text"
                                required
                                id="phone"
                                name="phone"
                                value={phone}
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

export default FormCliente