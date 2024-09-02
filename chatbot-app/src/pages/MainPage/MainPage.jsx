import React from 'react';
import UpperButtons from '../../components/Main/UpperButtons/UpperButtons.jsx';
import BodyMain from '../../components/Main/BodyMain/BodyMain.jsx';
import Cookies from "js-cookie";
import { jwtDecode } from 'jwt-decode';
import './styles.css'; // Asegúrate de tener un archivo CSS importado

function MainPage() {
    const tokenAccess = Cookies.get("accessToken");
    const tokenRefresh = Cookies.get("refreshToken");
    let decodedToken = "";

    if (tokenAccess && tokenRefresh) {
        try {
            decodedToken = jwtDecode(tokenAccess);
        } catch (error) {
            console.error("Error decoding token:", error);
        }
    }

    const name = decodedToken ? decodedToken.name : "User";

    return (
        <div>
            <div className="welcome-message">
                Welcome, {name}!
            </div>
            <UpperButtons />
            <BodyMain />
        </div>
    );
}

export default MainPage;
