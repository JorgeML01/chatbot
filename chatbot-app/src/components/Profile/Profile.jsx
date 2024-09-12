import React, { useState, useEffect } from 'react';
import Cookies from "js-cookie";
import './profile.css'; // Asegúrate de crear y agregar los estilos en este archivo CSS
import { jwtDecode } from 'jwt-decode';

function Profile() {
    const [profilePicUrl, setProfilePicUrl] = useState('/default-profile.jpg'); // Imagen por defecto
    const [name, setName] = useState('User');
    const [email, setEmail] = useState('Email');

    useEffect(() => {
        const tokenAccess = Cookies.get("accessToken");
        const googleName = Cookies.get("userName");
        const googleEmail = Cookies.get("userEmail");
        const googleProfilePic = Cookies.get("userPicture");
        const facebookName = Cookies.get("fbUserName");
        const facebookEmail = Cookies.get("fbUserEmail");
        const facebookProfilePic = Cookies.get("fbProfilePicture");

        // Verificar si el usuario inició sesión con Google
        if (googleName && googleEmail && googleProfilePic) {
            setName(googleName);
            setEmail(googleEmail);
            setProfilePicUrl(googleProfilePic);
        } 
        // Verificar si el usuario inició sesión con Facebook
        else if (facebookName && facebookEmail && facebookProfilePic) {
            setName(facebookName);
            setEmail(facebookEmail);
            setProfilePicUrl(facebookProfilePic);
        } 
        // Verificar si el usuario inició sesión con token de acceso
        else if (tokenAccess) {
            try {
                const decodedToken = jwtDecode(tokenAccess);
                const userId = decodedToken ? decodedToken.id : "default"; // Usar un ID por defecto en caso de que no esté disponible
                setName(decodedToken ? decodedToken.name : 'User');
                setEmail(decodedToken ? decodedToken.email : 'Email');

                // TODO: Cambiar la URL de la API. Usar la de nodejs.
                //
                //
                // Intentar cargar la imagen del perfil
                const profilePicUrl = `https://face-recognition-chatbot-api-1.onrender.com/profile-pic/${userId}.jpg`;

                fetch(profilePicUrl, {
                    method: "get",
                    headers: new Headers({
                        "ngrok-skip-browser-warning": "true",
                    }),
                })
                .then(response => {
                    if (response.ok) {
                        setProfilePicUrl(profilePicUrl); // Imagen disponible
                    } else {
                        setProfilePicUrl('/default-profile.jpg'); // Imagen por defecto si no está disponible
                    }
                })
                .catch(() => {
                    setProfilePicUrl('/default-profile.jpg'); // Imagen por defecto en caso de error
                });

            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, []);

    return (
        <div className="profile-container">
            <h1>Profile</h1>
            <div className="profile-picture">
                <img src={profilePicUrl} alt="Profile" />
            </div>
            <div className="profile-info">
                <p>Name: {name}</p>
                <p>Email: {email}</p>
            </div>
        </div>
    );
}

export default Profile;
