import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import AuthIdle from "../../assets/images/auth-idle.svg";
import AuthFace from "../../assets/images/auth-face.svg";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import './CamComponent.css'; // Importa el CSS

function CamComponent() {
  const videoRef = useRef();
  const canvasRef = useRef();
  const faceApiIntervalRef = useRef();
  const videoWidth = 640;
  const videoHeight = 360;

  const [localUserStream, setLocalUserStream] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loginResult, setLoginResult] = useState("PENDING");
  const [imageError, setImageError] = useState(false);
  const [labeledFaceDescriptors, setLabeledFaceDescriptors] = useState(null);
  const [counter, setCounter] = useState(5);
  const [confidence, setConfidence] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const loadModels = async () => {
      const uri = "/models";
      await faceapi.nets.ssdMobilenetv1.loadFromUri(uri);
      await faceapi.nets.faceLandmark68Net.loadFromUri(uri);
      await faceapi.nets.faceRecognitionNet.loadFromUri(uri);
    };

    loadModels()
      .then(async () => {
        const username = Cookies.get("username");
        if (username) {
          const descriptors = await loadLabeledImages(username);
          if (descriptors) {
            setLabeledFaceDescriptors(descriptors);
          }
        }
      })
      .then(() => setModelsLoaded(true));
  }, []);

  useEffect(() => {
    const username = Cookies.get('username');
  
    if (loginResult === 'SUCCESS') {
      const counterInterval = setInterval(() => {
        setCounter((prevCounter) => prevCounter - 1);
      }, 1000);
  
      if (counter === 0) {
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.srcObject = null;
        }
  
        if (localUserStream.current) {
          localUserStream.current.getTracks().forEach((track) => track.stop());
        }
  
        clearInterval(counterInterval);
        clearInterval(faceApiIntervalRef.current);
  
        // Actualizar cookies con los nuevos tokens
        axios.get(`https://app-e0a913bb-2fe4-4de5-956b-cbc49890465c.cleverapps.io/user/${username}`)
          .then((response) => {
            const { accessToken, refreshToken } = response.data.data;
            Cookies.set('accessToken', accessToken);
            Cookies.set('refreshToken', refreshToken);
            localStorage.setItem('faceAuth', JSON.stringify({ status: true }));
            navigate("/");
            window.location.reload();
          })
          .catch((error) => {
            console.error('Error fetching tokens:', error);
          });
  

      }
  
      return () => clearInterval(counterInterval);
    }
  }, [loginResult, counter, localUserStream, navigate]);
  

  async function fetchImageWithFallback(username) {
    const basePath = `https://app-e0a913bb-2fe4-4de5-956b-cbc49890465c.cleverapps.io/photos/`;
    const formats = ['jpeg', 'jpg', 'png']; // Lista de formatos a intentar
    let img;

    for (let format of formats) {
        const imgPath = `${basePath}${username}.${format}`;
        try {
            img = await faceapi.fetchImage(imgPath);
            console.log(`Imagen encontrada: ${imgPath}`);
            return img; // Si encuentra la imagen, la devuelve y termina el bucle
        } catch (error) {
            console.log(`No se encontró la imagen en formato ${format}`);
        }
    }

    throw new Error("No se pudo encontrar la imagen en ninguno de los formatos."); // Si no se encuentra ninguna imagen
  }

  const getLocalUserVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
      });
      videoRef.current.srcObject = stream;
      setLocalUserStream(stream);
    } catch (err) {
      console.error("Error accessing webcam:", err);
    }
  };

  const scanFace = async () => {
    faceapi.matchDimensions(canvasRef.current, videoRef.current);
    const faceApiInterval = setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptors();

      const resizedDetections = faceapi.resizeResults(detections, {
        width: videoWidth,
        height: videoHeight,
      });

      if (labeledFaceDescriptors) {
        const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);
        const results = resizedDetections.map((d) =>
          faceMatcher.findBestMatch(d.descriptor)
        );

        if (results.length > 0) {
          const bestMatch = results[0];
          setConfidence(bestMatch.distance);
          if (bestMatch.label === Cookies.get("username")) {
            setLoginResult("SUCCESS");
          } else {
            setLoginResult("FAILED");
            setCounter(5);
          }
        } else {
          setLoginResult("FAILED");
        }
      }

      // Verificar que el canvas esté disponible antes de dibujar
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, videoWidth, videoHeight);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      }

    }, 1000 / 15);
    faceApiIntervalRef.current = faceApiInterval;
  };

  const loadLabeledImages = async (username) => {
    if (!username) return null;

    const descriptions = [];
    try {

      let img = null;
      // Ejemplo de uso
      try {
        img = await fetchImageWithFallback(username);
        // Continúa con el procesamiento de la imagen
      } catch (error) {
        console.error(error.message);
      }

      const detections = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detections) {
        descriptions.push(detections.descriptor);
      }

      return new faceapi.LabeledFaceDescriptors(username, descriptions);
    } catch (err) {
      console.error("Error loading labeled images:", err);
      setImageError(true);
      return null;
    }
  };

  if (imageError) {
    return (
      <div className="cam-container">
        <h2 className="heading error-message">
          Upps! There is no profile picture associated with this account.
        </h2>
        <span className="heading">Please contact administration for registration or try again later.</span>
      </div>
    );
  }

  return (
    <div className="cam-container">
      {!localUserStream && !modelsLoaded && (
        <h2 className="heading">
          <span>You're Attempting to Log In With Your Face.</span>
          <span className="indicator">Loading Models...</span>
        </h2>
      )}
      {!localUserStream && modelsLoaded && (
        <h2 className="heading">
          <span className="indicator">Please Recognize Your Face to Completely Log In.</span>
        </h2>
      )}
      {localUserStream && loginResult === "SUCCESS" && (
        <h2 className="heading">
          <span className="indicator">We've successfully recognized your face!</span>
          <span className="indicator">Please stay {counter} more seconds...</span>
        </h2>
      )}
      {localUserStream && loginResult === "FAILED" && (
        <h2 className="heading error-message">
          <span>Upps! We did not recognize your face.</span>
        </h2>
      )}
      {localUserStream && !modelsLoaded && loginResult === "PENDING" && (
        <h2 className="heading">
          <span className="indicator">Scanning Face...</span>
        </h2>
      )}
      <div className="video-container">
        <video
          muted
          autoPlay
          ref={videoRef}
          height={videoHeight}
          width={videoWidth}
          onPlay={scanFace}
          style={{ display: localUserStream ? "block" : "none" }}
        />
        <canvas
          ref={canvasRef}
          style={{ position: "absolute", display: localUserStream ? "block" : "none" }}
        />
      </div>
      {!localUserStream && (
        <>
          {modelsLoaded ? (
            <>
              <img
                alt="loading models"
                src={AuthFace}
                className="img-placeholder"
              />
              <button
                onClick={getLocalUserVideo}
                type="button"
                className="button"
              >
                Scan my face
              </button>
            </>
          ) : (
            <>
              <img
                alt="loading models"
                src={AuthIdle}
                className="img-placeholder"
              />
              <button
                disabled
                type="button"
                className="loading-button"
              >
                <div className="spinner"></div>
                Loading...
              </button>
            </>
          )}
        </>
      )}
      {localUserStream && <div className="confidence">Confidence: {((1 - confidence) * 100).toFixed(2)}%</div>}
    </div>
  );
}

export default CamComponent;
