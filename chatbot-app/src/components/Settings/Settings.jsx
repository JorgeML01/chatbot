import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from 'jwt-decode';
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./settings.css";

function Settings() {
    const tokenAccess = Cookies.get("accessToken");
    const tokenRefresh = Cookies.get("refreshToken");
    let decodedToken = "";

    const [selectedFile, setSelectedFile] = useState(null);

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

    const [userId, setUserId] = useState(decodedToken ? decodedToken.id : "");

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
          const response = await axios.post('http://localhost:5000/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          console.log('File uploaded successfully:', response.data);
        } catch (error) {
          console.error('Error uploading file:', error);
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
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Settings;
