import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function NavbarLayout() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState('');

  function checkLoginStatus() {
    const accessToken = Cookies.get("accessToken");
    const refreshToken = Cookies.get("refreshToken");

    if (accessToken && refreshToken) {
      setIsLoggedIn(true);
      fetchProfilePic();
    } else {
      setIsLoggedIn(false);
    }
  }

  async function fetchProfilePic() {
    const userId = '5'; // Debes obtener el ID del usuario real
    setProfilePicUrl(`http://localhost:5000/profile-pic/${userId}.jpg`);
  }

  function handleLogout() {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    navigate("/login");
    window.location.reload();
  }

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary navbar-body sticky-top">
      <Container>
        <Navbar.Brand href="/">SIL-CHATBOT</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {isLoggedIn ? (
              <>
                <Nav.Link href="chatbot">Chat</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link href="/login">Log In</Nav.Link>
                <Nav.Link href="/signup">Sign Up</Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            {isLoggedIn ? (
              <NavDropdown title={<img src={profilePicUrl || '/default-profile.png'} alt="Profile" className="profile-pic" />} id="basic-nav-dropdown">
                <NavDropdown.Item href="perfil">Perfil</NavDropdown.Item>
                <NavDropdown.Item href="settings">
                  Settings
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Log out
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <></>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarLayout;
