# Proyecto: DevfSeek V.48R4H4M 🐋
## Autor: Abraham Medina
## Sensei: Daniel Gloria 

---

##  🤖 Estructura del Proyecto

Este repositorio contiene el desarrollo paso a paso de una aplicación web con React en el frontend y Express en el backend. Cada **rama** (`parte-1`, `parte-2`, etc.) corresponde a un tema o módulo independiente del curso. 

El objetivo es aprender desde la configuración inicial del proyecto hasta la implementación de un backend con Express, bases de datos y consumo de IA mediante Ollama.

---

## Funcionalidad del Chat Base: Proporcionada por DEVF

```javascript
const [messages, setMessages] = useState([]);
const [input, setInput] = useState("");

const sendMessage = async (e) => {
  if (!input.trim()) return;
  setMessages([...messages, { text: input, sender: "user" }]);
  setInput("");

  setTimeout(() => {
    setMessages((prev) => [
      ...prev,
      { text: "Respuesta generada...", sender: "bot" },
    ]);
  }, 1000);
};
```

---

## Índice de Entregables

---

## Parte 1: React Hook Form y Validación de Formularios Avanzada

**Rama:** `parte-1`
**Descripción:** Implementación de formularios en React utilizando React Hook Form y técnicas avanzadas de validación. Uso de la IA para creación de un FrontEnd básico. Configuración inicial del proyecto, instalación de Tailwind CSS y creación de un diseño básico para la interfaz de usuario.

---

## Parte 2: Consumo de APIs (useEffect) y manejo de Ollama

**Rama:** `parte-2`
**Descripción:** Instalación de Ollama e integración con un modelo de IA ligero. Creación de un Custom Hook para el servicio *deepseek-r1:1.5b.* Uso de `useEffect` en React para consumir la API y manejar datos asíncronos. Adición del componente History en su primera versión para en un siguiente paso gestionar las consultas previas.

---

## Parte 3: Gestión de Estados con useContext

**Rama:** `parte-3`
**Descripción:** Gestión del estado global en una aplicación React utilizando el hook `useContext`. Manejo de historial de interacciones con `useReducer` y `useContext`.

---

## Parte 4: Creación de un servidor con Express

**Rama:** `parte-4`
**Descripción:** Creación de un servidor básico utilizando el framework Express de Node.js.

---

## Parte 5: Endpoints en Express

**Rama:** `parte-5`
**Descripción:** Creación de un endpoint POST para recibir datos. Introducción al concepto y uso de middlewares.

---

## Parte 6: API REST

**Rama:** `parte-6`
**Descripción:**  Desarrollo de un endpoint para consumir la función de Ollama. Comprensión del rol del backend en apps modernas.

---