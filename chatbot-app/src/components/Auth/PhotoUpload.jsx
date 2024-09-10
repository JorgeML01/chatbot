import React, { useState } from 'react';
import axios from 'axios';

const PhotoUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setErrorMessage('No file selected.');
      return;
    }

    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!['png', 'jpg', 'jpeg'].includes(fileExtension)) {
      setErrorMessage('Only PNG, JPG, or JPEG files are allowed.');
      return;
    }

    setSelectedFile(file);
    setErrorMessage(null);  // Clear any previous error messages
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage('No file selected.');
      return;
    }

    const formData = new FormData();
    formData.append('photo', selectedFile);

    try {
      const response = await axios.post('http://localhost:8080/upload/customUserId', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccessMessage('Photo uploaded successfully!');
      setErrorMessage(null);  // Clear any previous error messages
    } catch (error) {
      setErrorMessage('Error uploading file.');
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto mt-5">
      <h2 className="text-2xl mb-4">Upload a Photo</h2>

      <input 
        type="file" 
        accept=".png, .jpg, .jpeg"
        onChange={handleFileChange}
        className="mb-4"
      />

      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

      <button
        onClick={handleUpload}
        className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded"
      >
        Upload Photo
      </button>
    </div>
  );
};

export default PhotoUpload;
