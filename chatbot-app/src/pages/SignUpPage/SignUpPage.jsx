import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

// Facebook and Google buttons
import { LoginSocialFacebook } from "reactjs-social-login";
import { FacebookLoginButton } from "react-social-login-buttons";
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";

import './styles.css';


function SignUpPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessages, setErrorMessages] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!fullName || !username || !email || !password || !confirmPassword) {
      setErrorMessages({
        field: "form",
        message: "All fields are required.",
      });
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessages({
        field: "password",
        message: "Passwords do not match.",
      });
      return;
    }

    try {

      console.log("Registering user:", { email, password, name: fullName });

      const response = await axios.post(
        "https://app-e0a913bb-2fe4-4de5-956b-cbc49890465c.cleverapps.io/register",
        {
          email,
          password,
          name: fullName,
        }
      );
      console.log("Sign up success:", response);

      navigate("/login");
      window.location.reload();
      // Handle successful sign up, e.g., navigate to login page
    } catch (error) {
      console.error("Error during sign up:", error);
      if (error.response) {
        setErrorMessages({
          field: "server",
          message: error.response.data.message || "An error occurred during sign up.",
        });
      }
    }
  };

  const handleGoogleSignUpSuccess = (response) => {
    console.log('Google login success:', response);
  };

  const handleGoogleSignUpFailure = (error) => {
    console.log('Google login error:', error);
  };

  return (
    <div className="d-flex justify-content-center align-items-center signup-body" style={{ height: '100vh' }}>
      <div className="w-50 form-style">
        <h3>Sign Up</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formFullName">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errorMessages.field === "password" && <Form.Text className="text-danger">{errorMessages.message}</Form.Text>}
          </Form.Group>

          <Button type="submit" className="button-login">
            Sign Up
          </Button>
          {errorMessages.field === "form" && <Form.Text className="text-danger">{errorMessages.message}</Form.Text>}
        </Form>

        {/* Facebook Sign Up Button */}
        <LoginSocialFacebook
          appId="1234585024333167"
          onResolve={(response) => {
            console.log('Facebook login success:', response);
          }}
          onReject={(error) => {
            console.log('Facebook login error:', error);
          }}
        >
          <FacebookLoginButton />
        </LoginSocialFacebook>

        {/* Google Sign Up Button */}
        <GoogleOAuthProvider clientId='633182780411-u0nutjjuj72kcgjae0eepfge29qor0km.apps.googleusercontent.com'>
          <div className="mt-3">
            <GoogleLogin
              onSuccess={handleGoogleSignUpSuccess}
              onError={handleGoogleSignUpFailure}
            />
          </div>
        </GoogleOAuthProvider>
      </div>
    </div>
  );
}

export default SignUpPage;
