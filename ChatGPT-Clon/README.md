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