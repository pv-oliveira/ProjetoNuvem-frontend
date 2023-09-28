import React, { useState } from "react";
import Modal from '../../components/modal/modal.components';


export default function Geral({ parentState, pedido, setParentState, setPedido }) {
    const [modalOption, setModalOption] = useState("geral");      //Hook para controle do modal das info gerais

    const modalOptionsMap = {
        geral: (
            <>
                <table className="secundary-table" cellSpacing="0" cellPadding="8" style={{height:'400px',  width: '80%' }}>
                    <tbody>
                        <tr>
                            <td style={{borderStyle: 'groove'}}>Cliente</td>
                            <td> {pedido?.cliente} </td>
                        </tr>
                        <tr>
                            <td style={{borderStyle: 'groove'}}> Produto </td>
                            <td> {pedido?.produto} </td>
                        </tr>
                        <tr>
                            <td style={{borderStyle: 'groove'}}> Endereço </td>
                            <td> {pedido?.address} </td>
                        </tr>
                        <tr>
                            <td style={{borderStyle: 'groove'}}> Descrição </td>
                            <td> {pedido?.description} </td>
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
                    onClick={() => { setParentState(false); setPedido({}); setModalOption('geral') }}
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