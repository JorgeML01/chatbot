import React from 'react';
import Cookies from "js-cookie";
import { jwtDecode } from 'jwt-decode';
import './profile.css'; // Asegúrate de crear y agregar los estilos en este archivo CSS

function Profile() {
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
    const email = decodedToken ? decodedToken.email : "Email";
    const userId = decodedToken ? decodedToken.id : "default"; // Usar un ID por defecto en caso de que no esté disponible

    // const profilePicUrl = `http://localhost:5000/profile-pic/${userId}.jpg`; // Cambia la URL según tu configuración
    const profilePicUrl = `https://ff1f-190-242-25-103.ngrok-free.app/profile-pic/${userId}.jpg`;

    return (
        <div className="profile-container">
            <h1>Profile</h1>
            <div className="profile-picture">
                <img src={profilePicUrl || '/default-profile.png'} alt="Profile" />
            </div>
            <div className="profile-info">
                <p>Name: {name}</p>
                <p>Email: {email}</p>
            </div>
        </div>
    );
}

export default Profile;
