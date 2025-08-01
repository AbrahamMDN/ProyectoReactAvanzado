// Se importan todos los módulos de React
import * as React from "react";

// Se crea el contexto global
const GlobalContext = React.createContext();

// Se crea una variable para almacenar los mensajes y el chat actual
const storage = {
  messages: [],
  currentChat: [],
};

// Se crea el Reducer para gestionar las acciones de la interacción usuario-IA
function globalReducer(state, action) {
    // Se introducen las acciones posibles y su lógica
    switch (action.type) {
        // Se guarda el chat actual en el historial
        case "@save_history": {
            // Si no hay un chat actual sólo se devuelve el estado en ese momento
            if (!state.currentChat?.length) return state
            // Se recupera el historial existente en memoria local
            const prev = localStorage.getItem("history");
            // Si hay mensajes previos se almacenan en la variable, sino, permanece como una lista vacía
            const messages = prev ? JSON.parse(prev) : [];
            
            // Estructura de un nuevo chat
            const newChat = {
                // Se obtiene el primer mensaje del chat como título (será el que se muestre en el historial de interacciones)
                title: state.currentChat[0].text,
                content: state.currentChat
            }
            
            // Se actualiza el historial en memoria local con el contenido del chat actual 
            localStorage.setItem(
                "history",
                JSON.stringify([...messages, newChat]),
            );
            
            // Se limpia el campo del chat actual y se devuelve el input en su formato inicial
            state.currentChat = [];
            return state;
        }
        // Se cargan los mensajes del historial
        case "@load_messages": {
            // Se leen todos los mensajes guardados en memoria local
            const history = localStorage.getItem("history");
            // Si no hay historial existente se devuelve la lista de mensajes y el estado actual
            if (!history) {
                return { messages: [], ...state };
            }
            // Se evita que el estado se sobreescriba
            state.messages = JSON.parse(history);
            return { ...state };
        }
        // Se maneja el chat actual
        case "@current_chat": {      
            // Se actualiza estado del chat actual y se devuelve el estado
            state.currentChat = action.payload;
            return { ...state };
        }
        // Si no es una acción esperada, se genera un nuevo error
        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
};

// Se crea el Provider para aplicar el contexto global
function GlobalProvider({ children }) {
  // Se inicializa el Reducer con storage como estado inicial
  const [state, dispatch] = React.useReducer(globalReducer, storage);
  // Se almacena el valor de state y dispatch en la variable value
  const value = { state, dispatch };

  // Se genera la estuctura del Provider
  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

// Se crea la función que aplica el contexto global 
function useGlobal() {
  const context = React.useContext(GlobalContext);
  // Si no hay un contexto definido, se genera un nuevo error que lo señala
  if (context === undefined) {
    throw new Error("useGlobal must be used within a GlobalProvider");
  }

  return context;
};

// Se exportan el Provider y el contexto Global
// eslint-disable-next-line
export { GlobalProvider, useGlobal };