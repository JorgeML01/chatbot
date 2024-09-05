import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import ChatbotComponent from '../../components/Chatbot';
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
    <div className="">
      <ChatbotComponent />
    </div>
  );
};



export default Chatbot;
