import { useState, useEffect } from "react";
import "./modal.styles.css";

export default function Modal({ children, parentState }) {
  // Controla a visibilidade do modal que será herdada pelo componente pai
  const [visibility, setVisibility] = useState(false);

  // Função chamada no carregamento do componente
  useEffect(() => {
    setVisibility(parentState);

  }, [parentState]);

  if (visibility) return (
    <div className="modal-screen">
      <div className="modal-container" >
        {children}
      </div>
    </div>);
  else return null;
}