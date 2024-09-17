import React, { useState, useEffect } from 'react';
import UpperButtons from '../../components/Main/UpperButtons/UpperButtons.jsx';
import BodyMain from '../../components/Main/BodyMain/BodyMain.jsx';
import Cookies from "js-cookie";
import { jwtDecode } from 'jwt-decode';
import './styles.css'; // Asegúrate de tener un archivo CSS importado

function MainPage() {
    const [name, setName] = useState("User"); // Estado inicial para el nombre

    useEffect(() => {
        const tokenAccess = Cookies.get("accessToken");
        const tokenRefresh = Cookies.get("refreshToken");
        const userName = Cookies.get("userName"); // Nombre desde Google o Facebook

        // Si hay un nombre en cookies de Google o Facebook, úsalo
        if (userName) {
            setName(userName);
        } else if (tokenAccess && tokenRefresh) {
            try {
                const decodedToken = jwtDecode(tokenAccess);
                setName(decodedToken ? decodedToken.name : "User");
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, []); // Solo ejecuta esto una vez al montar el componente

    return (
        <div>
            <div className="welcome-message">
                Welcome back, {name}!
            </div>
            <UpperButtons />
            <BodyMain />
        </div>
    );
}

export default MainPage;
