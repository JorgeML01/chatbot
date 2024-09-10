import React, { useState } from 'react';
import './styles.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { LoginSocialFacebook } from "reactjs-social-login";
import { FacebookLoginButton } from "react-social-login-buttons";
import { jwtDecode } from 'jwt-decode';
import { FaFingerprint } from 'react-icons/fa'; // Importar el ícono de reconocimiento facial

function LoginPage() {
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState("");
  const [comparisonResult, setComparisonResult] = useState(null);
  const [errorMessages, setErrorMessages] = useState({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [facebookError, setFacebookError] = useState("");
  const [googleError, setGoogleError] = useState("");
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate("/");
    window.location.reload();
  };

  const handleGoogleLoginSuccess = (response) => {
    // Decodificar el token JWT
    const userObject = jwtDecode(response.credential);
    console.log("Google login success:", userObject);
  
    // Ejemplo de metadatos disponibles
    console.log("User email:", userObject.email);
    console.log("User name:", userObject.name);
    console.log("User profile picture:", userObject.picture);
  
    // Guardar en cookies si es necesario
    Cookies.set("userEmail", userObject.email);
    Cookies.set("userName", userObject.name);
    Cookies.set("userPicture", userObject.picture);
    
    navigate("/");
    window.location.reload();
  };
  
  const handleGoogleLoginFailure = (error) => {
    console.log('Google login error:', error);
    setGoogleError("Google login failed. Please try again.");
  };

  const handleFacebookLoginSuccess = (response) => {
    console.log('Facebook login success:', response);
    
    // Ejemplo de metadatos disponibles
    const userObject = response.data;
    console.log("User email:", userObject.email);
    console.log("User name:", userObject.name);
    console.log("User profile picture:", userObject.picture?.data?.url);
  
    // Guardar en cookies si es necesario
    Cookies.set("userEmail", userObject.email);
    Cookies.set("userName", userObject.name);
    Cookies.set("userPicture", userObject.picture?.data?.url);
  
    navigate("/");
    window.location.reload();
  };

  const handleFacebookLoginFailure = (error) => {
    console.log('Facebook login error:', error);
    setFacebookError("Facebook login failed. Please try again.");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!email || !password) {
      setErrorMessages({
        field: "credentials",
        message: "Email and password are required.",
      });
      return;
    }

    try {
      const response = await fetch("https://app-e0a913bb-2fe4-4de5-956b-cbc49890465c.cleverapps.io/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        Cookies.set("accessToken", data.data.accessToken);
        Cookies.set("refreshToken", data.data.refreshToken);
        handleLoginSuccess();
      } else {
        setErrorMessages({
          field: "credentials",
          message: "Invalid email or password.",
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessages({
        field: "credentials",
        message: "An error occurred. Please try again.",
      });
    }
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleUsernameSubmit = async () => {
    handleCloseModal();
    // Aquí puedes manejar la lógica para el `username`, si es necesario
    console.log('Username:', username);

    // Ejemplo de cómo podrías enviar el username a un servidor o usarlo en el estado de la aplicación
    // ...
  };

  return (
    <div className="d-flex justify-content-center align-items-center login-body" style={{ height: '80vh' }}>
      <div className="w-50 form-style">
        <h3>Log In</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errorMessages.field === "credentials" && <Form.Text className="text-danger">{errorMessages.message}</Form.Text>}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button type="submit" className="button-login">
            Log in
          </Button>
        </Form>

        {/* Face Recognition Icon and Modal */}
        <div className="mt-3 text-center">
          <FaFingerprint 
            onClick={handleShowModal} 
            size={50} 
            style={{ cursor: 'pointer', color: '#007bff' }}
          />
          <p>Click the icon for facial recognition</p>
        </div>

        {/* Modal for Username Input */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Enter Username</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleUsernameSubmit}>
              Continue
            </Button>
          </Modal.Footer>
        </Modal>

        {facebookError && <Form.Text className="text-danger">{facebookError}</Form.Text>}
        {googleError && <Form.Text className="text-danger">{googleError}</Form.Text>}

        {/* Facebook Login Button */}
        <LoginSocialFacebook
          appId="1234585024333167"
          onResolve={handleFacebookLoginSuccess}
          onReject={handleFacebookLoginFailure}
        >
          <FacebookLoginButton />
        </LoginSocialFacebook>

        {/* Google Login Button */}
        <GoogleOAuthProvider clientId='633182780411-u0nutjjuj72kcgjae0eepfge29qor0km.apps.googleusercontent.com'>
          <div className="mt-3">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginFailure}
            />
          </div>
        </GoogleOAuthProvider>
      </div>
    </div>
  );
}

export default LoginPage;
