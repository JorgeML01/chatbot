import React, { useState } from 'react'; // Asegúrate de importar useState
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

// Facebook and Google buttons
import { LoginSocialFacebook } from "reactjs-social-login";
import { FacebookLoginButton } from "react-social-login-buttons";
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';

import './styles.css';

function LoginPage() {
  const navigate = useNavigate();
  const [errorMessages, setErrorMessages] = useState({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSuccess = () => {
    navigate("/");
    window.location.reload();
  };

  const handleGoogleLoginSuccess = (response) => {
    console.log('Google login success:', response);
    navigate("/");
    window.location.reload();
  };

  const handleGoogleLoginFailure = (error) => {
    console.log('Google login error:', error);
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
      const response = await axios.post(
        "app-e0a913bb-2fe4-4de5-956b-cbc49890465c.cleverapps.io/login",
        {
          email,
          password,
        }
      );

      Cookies.set("accessToken", response.data.data.accessToken);
      Cookies.set("refreshToken", response.data.data.refreshToken);

      handleLoginSuccess();
    } catch (error) {
      // Login error
      if (error.response) {
        if (error.response.status === 400 || error.response.status === 401) {
          setErrorMessages({
            field: "credentials",
            message: "Invalid email or password.",
          });
        }
      } else if (error.request) {
        console.error("No se recibió respuesta del servidor...");
        setErrorMessages({
          field: "credentials",
          message: "Invalid email or password.",
        });
      } else {
        console.error("Error al hacer la solicitud:", error.message);
      }
    }
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
          <Button type="button" className="button-login">
            Reconocimiento facial
          </Button>
        </Form>

        {/* Facebook Login Button */}
        <LoginSocialFacebook
          appId="1234585024333167"
          onResolve={(response) => {
            console.log('Facebook login success:', response);
            navigate("/");
            window.location.reload();
          }}
          onReject={(error) => {
            console.log('Facebook login error:', error);
          }}
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
