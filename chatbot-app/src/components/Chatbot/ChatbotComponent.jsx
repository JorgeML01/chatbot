import React, { useState, useRef, useEffect } from 'react';
import './ChatbotComponent.css';

const ChatbotComponent = () => {
  const [query, setQuery] = useState('');
  const [responses, setResponses] = useState([]); // Array de respuestas
  const [loading, setLoading] = useState(false);

  // Referencia para el contenedor del chat, nos ayudará a anclar al final del chat
  const chatWindowRef = useRef(null);

  // Función para enviar el mensaje
  const handleSend = async () => {
    if (!query) return;

    setLoading(true);

    try {
      const res = await fetch('https://app-e0a913bb-2fe4-4de5-956b-cbc49890465c.cleverapps.io/detectIntent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          sessionId: 'user-session-1',
          languageCode: 'es',
        }),
      });

      const data = await res.json();
      setResponses((prevResponses) => [
        ...prevResponses,
        {
          query: query,
          agentResponse: data.agentResponse,
          matchedIntent: data.matchedIntent,
          currentPage: data.currentPage,
          sentiment: data.sentiment,
        },
      ]);
      setQuery(''); // Limpiar el campo de texto después de enviar
    } catch (err) {
      console.error(err);
    }

    setLoading(false); // Dejar de mostrar "Escribiendo..."
  };

  // Función para manejar el evento 'Enter'
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  // Desplazar el chat hacia abajo automáticamente cuando cambian las respuestas
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [responses, loading]); // Ejecuta este efecto cada vez que cambien las respuestas o el estado de loading

  return (
    <div className="chatbot-container">
      <h2>Chatbot</h2>
      <div className="chatWindow" ref={chatWindowRef}>
        <div className="responseList">
          {responses.length === 0 && <p>No hay respuesta aún. Escribe algo para empezar.</p>}
          {responses.map((response, index) => (
            <div key={index} className="responseContainer">
              <p><strong>Tu mensaje:</strong> {response.query}</p>
              <p><strong>Respuesta del Agente:</strong> {response.agentResponse}</p>
              <p><strong>Intento Detectado:</strong> {response.matchedIntent}</p>
              <p><strong>Página Actual:</strong> {response.currentPage}</p>
              <p><strong>Análisis de Sentimiento:</strong> Score: {response.sentiment.score}, Magnitude: {response.sentiment.magnitude}</p>
            </div>
          ))}
        </div>
        {/* Mostrar "Escribiendo..." al final mientras carga */}
        {loading && <p className="typingIndicator">Escribiendo...</p>}
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress} // Enviar con Enter
        placeholder="Escribe tu mensaje"
      />
      <button onClick={handleSend}>Enviar</button>
    </div>
  );
};

export default ChatbotComponent;
