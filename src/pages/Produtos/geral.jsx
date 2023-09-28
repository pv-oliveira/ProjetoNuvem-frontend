import React, { useState } from "react";
import Modal from '../../components/modal/modal.components';


export default function GeralCrud({ parentState, produto, setParentState, setProduto }) {
    const [modalOption, setModalOption] = useState("geral");      //Hook para controle do modal das info gerais

    const modalOptionsMap = {
        geral: (
            <>
                <table className="secundary-table" cellSpacing="0" cellPadding="8" style={{height:'400px',  width: '80%' }}>
                    <tbody>
                        <tr>
                            <td style={{borderStyle: 'groove'}}>Nome</td>
                            <td> {produto?.name} </td>
                        </tr>
                        <tr>
                            <td style={{borderStyle: 'groove'}}> Tipo </td>
                            <td> {produto?.type} </td>
                        </tr>
                        <tr>
                            <td style={{borderStyle: 'groove'}}> Preço </td>
                            <td> {produto?.preco} </td>
                        </tr>
                        <tr>
                            <td style={{borderStyle: 'groove'}}> Promoção </td>
                            <td> {produto?.promocao} </td>
                        </tr>
                        <tr>
                            <td style={{borderStyle: 'groove'}}> Desconto </td>
                            <td> {produto?.desconto || "-"} </td>
                        </tr>
                        <tr>
                            <td style={{borderStyle: 'groove'}}> Valor </td>
                            <td> {produto?.valor || "-"} </td>
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
                    onClick={() => { setParentState(false); setProduto({}); setModalOption('geral') }}
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