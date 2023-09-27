import { useState, useEffect } from "react";

import "./dynamic-table.styles.css";

// Componente que gera uma tabela com dados dinâmicamente
/*
props:
{
  dataStatic?:      dados estáticos, ou carregados em outro componente
  dataStruct: [{    estrutura esperada do dado baixado
    header,         indica um titulo da coluna para um dado
    field,          indica nome do campo do dado
  }]
  hoveble:          booleano que indica que itens da tabela são selecionávels, default true
  navItens?: [{     (opcional) lista com itens de navbar de controle
    returnIcon:     função para retorno de JSX com icone (react icons)
    describe:       texto para tooltipe do icone
    action:         função acionada com o click no ícone, tem como parâmetro os itens selecionados
    activeWith:     função para indicar se item é clical ou não, tem como parâmetro os itens selecioados e deve retornar bool
  }]
}
*/

export default function DynamicTable({ dataStatic, dataStruct, parentLoading, hoveble, navItens, forceRender }) {
  const [rendData, setRendData] = useState([]);         // Guarda lista de dados a serem renderizadas na tela

  const [selectItem, setSelectItem] = useState([]);     // Guarda lista com ids de item selecionados na tabela

  const [load, setLoad] = useState(false);                       // Indica que carregamento foi concluído
  const [renderTrigger, setRenderTrigger] = useState(false);    // Força a atualização de componentes

  // Função para formatar dado renderizado de acordo com estrutura dada e retornará uma lista com colunas
  function acertItem(item) {
    const coluns = [];
    const dataToForEach = dataStruct
    dataToForEach.forEach((element) => {
      if (element) {
        const field = element?.field;
        const formatedItem = item[field];
        coluns.push({ formated: formatedItem });
      }
    });

    return coluns;
  }

  // Função para selecionar (ou "deselecionar") um item
  function handleClickItem(itemId) {
    if (hoveble) {
      if (selectItem[0] !== itemId) setSelectItem([itemId]);
      else setSelectItem([]);

      // Forçando atualização da renderização  
      setRenderTrigger(!renderTrigger);
    }
  }

  // Função chamada no carregamento do componente
  useEffect(() => {
    async function fetchData() {
      try {
        async function savingData(data) {
          if (dataStatic) setRendData(data);
          setLoad(true);
        }
        if (dataStatic) {
          savingData(dataStatic)
        }
      } catch (error) {
        console.log(error);
      }
    }
    // Baixando dados
    fetchData();
    // eslint-disable-next-line
  }, [parentLoading, forceRender]);

  return (
    <>
      {
        <form className="search-menu" onSubmit={async (e) => { e.preventDefault(); }} >
          <nav>
            {
              navItens?.map((item, index) => {
                return (
                  <span
                    key={`nav-item-${index}`}
                    className="hastooltip"
                    onClick={() => {
                      if (item.activeWith(selectItem, rendData)) {
                        item.action(selectItem, rendData);
                        if (item.red || item.desSelect) setSelectItem([]);
                      }
                    }}
                    style={item.activeWith(selectItem, rendData) ?
                      item.red ? { color: "red" } : { color: "#3bb6f3" } : { color: "#ffffff" }}>

                    <span className="svg-container">{item.returnIcon()}</span>
                    <span className="tooltiptext"> {item.describe} </span>
                  </span>
                )
              })
            }
          </nav>
        </form>
      }

      <div id="dynamic-table" className="scroller-content" >
        <table className={hoveble ? "primary-table primary-table-hover" : "primary-table"} cellSpacing="0" cellPadding="8">
          <thead>
            {
              <tr>
                <th>#</th>
                {
                  dataStruct?.map((item, index) => {
                    if (item) {
                      return (
                        <th
                          key={`colunms-${index}`}
                        >
                          {item.header}
                        </th>
                      )
                    } else return null
                  })
                }
              </tr>
            }
          </thead>
          <tbody>
            {
              load && !parentLoading ? rendData.length === 0 ? <tr>
                <td colSpan={1 + dataStruct?.length} > <i style={{ color: "gray" }} > nenhum item no momento... </i> </td>
              </tr> : rendData.map((item, index) => {
                const coluns = acertItem(item);
                return (
                  <tr
                    key={`rows-${index}-${item?._id}`}
                    onClick={() => handleClickItem(item?._id)}
                    style={selectItem.indexOf(item?._id) !== -1 ? { color: 'white', backgroundColor: '#006699' } : undefined}
                  >
                    <td>{ index + 1 }</td>
                    {coluns?.map((itemInfo, indexItemInfo) => {
                      return <td
                        key={`item-${item?._id}-column-${indexItemInfo}-row-${index}`}
                      >
                        {itemInfo.formated}
                      </td>
                    })}
                  </tr>
                )
              }) : null
            }
          </tbody>
        </table>
      </div>
    </>
  )
}