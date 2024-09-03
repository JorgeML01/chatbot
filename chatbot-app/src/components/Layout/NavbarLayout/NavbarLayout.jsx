import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import React, { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';

function NavbarLayout() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState('/default-profile.png'); // Imagen por defecto

  // Define checkLoginStatus as a useCallback to avoid unnecessary effect reruns
  const checkLoginStatus = useCallback(() => {
    const accessToken = Cookies.get("accessToken");
    const refreshToken = Cookies.get("refreshToken");
    
    if (accessToken && refreshToken) {
      setIsLoggedIn(true);
      fetchProfilePic();
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  async function fetchProfilePic() {
    const userId = jwtDecode(Cookies.get("accessToken")).id;
    const url = `https://d0bc-190-242-25-103.ngrok-free.app/profile-pic/${userId}.jpg`; // Cambia a la URL de producción si es necesario

    try {
      const response = await fetch(url);
      if (response.ok) {
        setProfilePicUrl(url); // Imagen disponible
      } else {
        setProfilePicUrl('/default-profile.jpg'); // Imagen por defecto si no está disponible
      }
    } catch (error) {
      console.error('Error fetching profile picture:', error);
      setProfilePicUrl('/default-profile.png'); // Imagen por defecto en caso de error
    }
  }

  function handleLogout() {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    navigate("/login");
    window.location.reload();
  }

  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]); // Include checkLoginStatus in dependencies array

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
              <NavDropdown title={<img src={profilePicUrl} alt="Profile" className="profile-pic" />} id="basic-nav-dropdown">
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
