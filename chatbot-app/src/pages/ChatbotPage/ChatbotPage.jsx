import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import './styles.css';  // Archivo CSS personalizado

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const userMessage = { text: inputMessage, sender: 'user' };
      setMessages([...messages, userMessage]);
      setInputMessage('');

      // Simular respuesta del bot
      setTimeout(() => {
        const botMessage = { text: `Hola Buenos Días! Un gusto en conocerte. ¿Hay algo en lo que necesitas ayuda?`, sender: 'bot' };
        setMessages(prevMessages => [...prevMessages, botMessage]);
      }, 1000);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <div className="message-text">{msg.text}</div>
          </div>
        ))}
      </div>
      <Form.Group className="input-container d-flex">
        <Form.Control
          type="text"
          placeholder="Mensajéa al bot aquí..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="message-input"
        />
        <Button variant="" onClick={handleSendMessage} className="send-button">
          Enviar
        </Button>
      </Form.Group>
    </div>
  );
};



export default Chatbot;
