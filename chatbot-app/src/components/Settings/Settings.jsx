import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from 'jwt-decode';
import { Button, Form, Container, Row, Col, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./settings.css";

// import AuthIdle from "../../assets/images/auth-idle.svg";
// import AuthFace from "../../assets/images/auth-face.svg";
// import * as faceapi from "face-api.js";

function Settings() {
    const tokenAccess = Cookies.get("accessToken");
    const tokenRefresh = Cookies.get("refreshToken");
    let decodedToken = "";

    const [selectedFile, setSelectedFile] = useState(null);
    const [userId, setUserId] = useState("");
    const [successMessage, setSuccessMessage] = useState(""); // Nuevo estado para el mensaje de éxito
    const [errorMessage, setErrorMessage] = useState(""); // Nuevo estado para el mensaje de error

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    if (tokenAccess && tokenRefresh) {
        try {
            decodedToken = jwtDecode(tokenAccess);
        } catch (error) {
            console.error("Error decoding token:", error);
        }
    }

    // Actualiza el estado de userId con el id decodificado
    useState(() => {
        setUserId(decodedToken ? decodedToken.id : "");
    }, [decodedToken]);

    const handleUpload = async () => {
        if (!selectedFile) {
            alert("Please select a file first!");
            setUserId(decodedToken ? decodedToken.id : "");
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append("userId", userId); // Enviar el ID del usuario

        try {
            // https://face-recognition-chatbot-api-1.onrender.com/upload
            const response = await axios.post('https://face-recognition-chatbot-api-1.onrender.com/upload', formData, {
                headers: {
                    // 'Content-Type': 'multipart/form-data',
                },
            });
            console.log('File uploaded successfully:', response.data);
            setSuccessMessage("File uploaded successfully!"); // Mostrar mensaje de éxito
            setErrorMessage(""); // Limpiar mensaje de error si lo hubo
        } catch (error) {
            console.error('Error uploading file:', error);
            setSuccessMessage(""); // Limpiar mensaje de éxito si lo hubo
            setErrorMessage("Error uploading file."); // Mostrar mensaje de error
        }
    };

    return (
        <Container>
            <Row className="justify-content-center mt-5">
                <Col md={6}>
                    <div className="text-center">
                        <h1>Update Profile/Auth Picture</h1>
                        <p>Choose a new photo to update your profile picture.</p>
                        <Form>
                            <Form.Group controlId="formFile">
                                <Form.Control 
                                    type="file" 
                                    onChange={handleFileChange} 
                                    className="mb-3" 
                                />
                            </Form.Group>
                            <Button 
                                onClick={handleUpload}
                                className="button-upload-settings"
                            >
                                Upload
                            </Button>
                            {successMessage && (
                                <Alert variant="success" className="mt-3">
                                    {successMessage}
                                </Alert>
                            )}
                            {errorMessage && (
                                <Alert variant="danger" className="mt-3">
                                    {errorMessage}
                                </Alert>
                            )}
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Settings;
