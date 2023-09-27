import React, { useState } from "react";
import Modal from '../../components/modal/modal.components';


export default function GeralCrud({ parentState, crud, setParentState, setCrud }) {
    const [modalOption, setModalOption] = useState("geral");      //Hook para controle do modal das info gerais

    const modalOptionsMap = {
        geral: (
            <>
                <table className="secundary-table" cellSpacing="0" cellPadding="8" style={{height:'400px',  width: '80%' }}>
                    <tbody>
                        <tr>
                            <td style={{borderStyle: 'groove'}}>Nome</td>
                            <td> {crud?.name} </td>
                        </tr>
                        <tr>
                            <td style={{borderStyle: 'groove'}}> Email </td>
                            <td> {crud?.email} </td>
                        </tr>
                        <tr>
                            <td style={{borderStyle: 'groove'}}> CPF </td>
                            <td> {crud?.cpf} </td>
                        </tr>
                        <tr>
                            <td style={{borderStyle: 'groove'}}> Endereço </td>
                            <td> {crud?.address} </td>
                        </tr>
                        <tr>
                            <td style={{borderStyle: 'groove'}}> Telefone </td>
                            <td> {crud?.phone || "-"} </td>
                        </tr>
                    </tbody>
                </table>

                <button
                    className="primary-button"
                    style={{
                        color: "#006699",
                        backgroundColor: "white",
                        border: "1px solid",
                    }}
                    onClick={() => { setParentState(false); setCrud({}); setModalOption('geral') }}
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