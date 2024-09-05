import React from 'react';
import { Helmet } from 'react-helmet';

const ChatbotComponent = () => {
  return (
    <div>
      {/* Helmet para incluir los scripts y estilos */}
      <Helmet>
        <link rel="stylesheet" href="https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/themes/df-messenger-default.css" />
        <script src="https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/df-messenger.js"></script>
      </Helmet>

      {/* df-messenger */}
      <df-messenger
        project-id="chatbot-app-433407"
        agent-id="916068a5-3bf0-4557-a258-22aad662c891"
        language-code="es"
        max-query-length="-1"
      >
        <df-messenger-chat chat-title="CHATBOT-ES-RAG"></df-messenger-chat>
      </df-messenger>

      {/* Inline styling para el chatbot */}
      <style>
        {`
          df-messenger {
            z-index: 999;
            position: fixed;
            --df-messenger-font-color: #000;
            --df-messenger-font-family: Google Sans;
            --df-messenger-chat-background: #f3f6fc;
            --df-messenger-message-user-background: #d3e3fd;
            --df-messenger-message-bot-background: #fff;
            bottom: 0;
            left: 50%; /* Coloca el chatbot al 50% del ancho de la pantalla */
            transform: translateX(-50%); /* Mueve el chatbot hacia la izquierda para centrarlo */
            width: 1000px; /* Ancho del chatbot */
            height: 630px; /* Altura fija del chatbot */
            overflow-y: auto; /* Habilita el desplazamiento vertical para los mensajes */
          }
        `}
      </style>
    </div>
  );
};

export default ChatbotComponent;
