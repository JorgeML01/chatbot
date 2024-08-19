import ChatbotPage from "./pages/ChatbotPage";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import SettingsPage from "./pages/SettingsPage";
import SignUpPage from "./pages/SignUpPage";
import FooterLayout from "./components/Layout/Footer/FooterLayout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage/>}/>
        <Route path="/signup" element={<SignUpPage/>} />
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/settings" element={<SettingsPage/>} />
        <Route path="/chatbot" element={<ChatbotPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
