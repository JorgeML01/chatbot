import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function NavbarLayout() {
  return (
    <>
      <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary navbar-body sticky-top">
        <Container>
          <Navbar.Brand href="/">SIL-CHATBOT</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="chatbot">Chat</Nav.Link> 
            </Nav>
            <Nav>
              {/* Poner nombre y la fotito. Que se pueda agregar foto de perfil. Al darle que esté la opción de settings.*/}
              <NavDropdown title="Perfil" id="basic-nav-dropdown">
              <NavDropdown.Item href="perfil">Perfil</NavDropdown.Item>
              <NavDropdown.Item href="settings">
                Settings
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/login">Log out</NavDropdown.Item>
            </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default NavbarLayout;