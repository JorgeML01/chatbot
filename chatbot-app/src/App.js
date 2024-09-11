import ChatbotPage from "./pages/ChatbotPage";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import SettingsPage from "./pages/SettingsPage";
import SignUpPage from "./pages/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import FaceRecognitionPage from "./pages/FaceRecognitionPage";
import NavbarLayout from "./components/Layout/NavbarLayout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <NavbarLayout />
        <Routes>
          <Route path="/" element={<MainPage/>}/>
          <Route path="/signup" element={<SignUpPage/>} />
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/settings" element={<SettingsPage/>} />
          <Route path="/chatbot" element={<ChatbotPage/>} />
          <Route path="/perfil" element={<ProfilePage/>} />
          <Route path="/face-recognition" element={<FaceRecognitionPage/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
