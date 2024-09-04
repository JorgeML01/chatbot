import 'bootstrap/dist/css/bootstrap.min.css';
import './navbar.css';

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
    const url = `https://face-recognition-chatbot-api-1.onrender.com/profile-pic/${userId}.jpg`; // URL de Ngrok
    // const url = `http://localhost:5000/profile-pic/${userId}.jpg`;

    try {
      const response = await fetch(url, {
        method: "get",
        headers: new Headers({
          "ngrok-skip-browser-warning": "false",
        }),
      });

      if (response.ok) {
        setProfilePicUrl(url); // Imagen disponible
      } else {
        setProfilePicUrl('/default-profile.png'); // Imagen por defecto si no está disponible
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
  }, [checkLoginStatus]);

  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary navbar-body sticky-top">
      <Container>
        <Navbar.Brand href="/">
          <img src="/6.png" alt="Logo" className="navbar-logo" /> {/* Añade esta línea */}
          <title-nav className="title-style">
           SIL-CHATBOT
          </title-nav>
        </Navbar.Brand>
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
                <NavDropdown.Item href="settings">Settings</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Log out</NavDropdown.Item>
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
