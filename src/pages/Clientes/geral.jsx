import React, { useState } from "react";
import Modal from '../../components/modal/modal.components';


export default function GeralCrud({ parentState, cliente, setParentState, setCliente }) {
    const [modalOption, setModalOption] = useState("geral");      //Hook para controle do modal das info gerais

    const modalOptionsMap = {
        geral: (
            <>
                <table className="secundary-table" cellSpacing="0" cellPadding="8" style={{height:'400px',  width: '80%' }}>
                    <tbody>
                        <tr>
                            <td style={{borderStyle: 'groove'}}>Nome</td>
                            <td> {cliente?.name} </td>
                        </tr>
                        <tr>
                            <td style={{borderStyle: 'groove'}}> Email </td>
                            <td> {cliente?.email} </td>
                        </tr>
                        <tr>
                            <td style={{borderStyle: 'groove'}}> CPF </td>
                            <td> {cliente?.cpf} </td>
                        </tr>
                        <tr>
                            <td style={{borderStyle: 'groove'}}> Endereço </td>
                            <td> {cliente?.address} </td>
                        </tr>
                        <tr>
                            <td style={{borderStyle: 'groove'}}> Telefone </td>
                            <td> {cliente?.phone || "-"} </td>
                        </tr>
                    </tbody>
                </table>

                <button
                    className="button"
                    style={{
                        color: "#006699",
                        backgroundColor: "white",
                        border: "1px solid",
                    }}
                    onClick={() => { setParentState(false); setCliente({}); setModalOption('geral') }}
                >
                    Sair
                </button>
            </>
        )
    }

    return (<>
        <Modal parentState={parentState}>{modalOptionsMap[modalOption]}</Modal>
    </>)
}