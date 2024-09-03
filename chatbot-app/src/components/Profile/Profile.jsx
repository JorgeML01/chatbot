import React, { useState, useEffect } from 'react';
import Cookies from "js-cookie";
import { jwtDecode } from 'jwt-decode';
import './profile.css'; // Asegúrate de crear y agregar los estilos en este archivo CSS

function Profile() {
    const [profilePicUrl, setProfilePicUrl] = useState('/default-profile.jpg'); // Imagen por defecto
    const [name, setName] = useState('User');
    const [email, setEmail] = useState('Email');

    useEffect(() => {
        const tokenAccess = Cookies.get("accessToken");
        const tokenRefresh = Cookies.get("refreshToken");
        
        if (tokenAccess && tokenRefresh) {
            try {
                const decodedToken = jwtDecode(tokenAccess);
                const userId = decodedToken ? decodedToken.id : "default"; // Usar un ID por defecto en caso de que no esté disponible
                setName(decodedToken ? decodedToken.name : 'User');
                setEmail(decodedToken ? decodedToken.email : 'Email');

                // Intentar cargar la imagen del perfil
                const profilePicUrl = `https://8c30-190-242-25-103.ngrok-free.app/profile-pic/${userId}.jpg`;
                
                fetch(profilePicUrl)
                    .then(response => {
                        if (response.ok) {
                            setProfilePicUrl(profilePicUrl); // Imagen disponible
                        } else {
                            setProfilePicUrl('/default-profile.jpg'); // Imagen por defecto
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
