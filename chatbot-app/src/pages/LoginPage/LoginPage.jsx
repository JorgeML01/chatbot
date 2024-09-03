import './styles.css';
import React, { useState } from 'react'; 
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

function LoginPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const [errorMessages, setErrorMessages] = useState({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [facebookError, setFacebookError] = useState("");
  const [googleError, setGoogleError] = useState("");

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
    setGoogleError("Google login failed. Please try again.");
  };

  const handleFacebookLoginSuccess = (response) => {
    console.log('Facebook login success:', response);
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
      const response = await axios.post(
        "https://app-e0a913bb-2fe4-4de5-956b-cbc49890465c.cleverapps.io/login",
        {
          email,
          password,
        }
      );

      Cookies.set("accessToken", response.data.data.accessToken);
      Cookies.set("refreshToken", response.data.data.refreshToken);

      handleLoginSuccess();
    } catch (error) {
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
          message: "No response from server. Please try again.",
        });
      } else {
        console.error("Error al hacer la solicitud:", error.message);
        setErrorMessages({
          field: "credentials",
          message: "An error occurred. Please try again.",
        });
      }
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('File uploaded successfully:', response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
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
        </Form>

        <Form.Group className="mt-3">
          <Form.Label>Facial Recognition</Form.Label>
          <Form.Control 
            type="file" 
            onChange={handleFileChange}
          />
          <Button 
            type="button" 
            className="button-login mt-2" 
            onClick={handleUpload}
          >
            Upload Photo
          </Button>
        </Form.Group>

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
