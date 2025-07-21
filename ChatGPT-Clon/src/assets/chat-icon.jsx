// Modificación de un ícono importado desde lucide-react para adaptarlo al contexto del proyecto
function ChatIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-message-circle-more"
    >
        {/* La etiqueta svg permite crear dibujos vectoriales que no pierden calidad al modificar su tamaño */}

    {/* La etiqueta path permite realizar trazos vectoriales dentro de elementos svg*/}
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
      <path d="M8 12h.01" />
      <path d="M12 12h.01" />
      <path d="M16 12h.01" />
    </svg>
  );
}

// Se exporta el elemento final
export {
  ChatIcon
};