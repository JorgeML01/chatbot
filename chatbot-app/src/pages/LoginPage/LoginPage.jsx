import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './styles.css';

function LoginPage() {
  return (
    <div className="d-flex justify-content-center align-items-center login-body" style={{ height: '80vh' }}>
        <div className="w-50 form-style">
        <h3>Log In</h3>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>User</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
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
      </Form>
      </div>
    </div>
  );
}

export default LoginPage;