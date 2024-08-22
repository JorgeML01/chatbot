import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

// Facebook and Google buttons
import { LoginSocialFacebook } from "reactjs-social-login";
import { FacebookLoginButton } from "react-social-login-buttons";
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';

import './styles.css';

function LoginPage() {
  const handleGoogleLoginSuccess = (response) => {
    console.log('Google login success:', response);
  };

  const handleGoogleLoginFailure = (error) => {
    console.log('Google login error:', error);
  };

  return (
    <div className="d-flex justify-content-center align-items-center login-body" style={{ height: '80vh' }}>
        <div className="w-50 form-style">
          <h3>Log In</h3>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicUser">
              <Form.Label>User</Form.Label>
              <Form.Control type="user" placeholder="Enter user" />
              <Form.Text className="text-muted">
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <Button type="submit" className="button-login">
              Log in
            </Button>
            <Button type="submit" className="button-login">
              Reconociento facial
            </Button>
          </Form>

          {/* Facebook Login Button */}
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
