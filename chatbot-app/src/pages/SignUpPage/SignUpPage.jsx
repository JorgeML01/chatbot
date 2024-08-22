import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

// Facebook and Google buttons
import { LoginSocialFacebook } from "reactjs-social-login";
import { FacebookLoginButton } from "react-social-login-buttons";
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';

function SignUpPage() {

  const handleGoogleSignUpSuccess = (response) => {
    console.log('Google login success:', response);
  };

  const handleGoogleSignUpFailure = (error) => {
    console.log('Google login error:', error);
  };

  return (
    <div className="d-flex justify-content-center align-items-center signup-body" style={{ height: '90vh' }}>
      <div className="w-50 form-style">
        <h3>Sign Up</h3>
        <Form>
          <Form.Group className="mb-3" controlId="formFullName">
            <Form.Label>Full Name</Form.Label>
            <Form.Control type="text" placeholder="Enter full name" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Enter username" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Enter password" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type="password" placeholder="Confirm your password" />
          </Form.Group>

          <Button type="submit" className="button-login">
            Sign Up
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
