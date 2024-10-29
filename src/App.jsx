import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import HomePage from './pages/HomePage/HomePage'
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import ProtectedRoute from "./components/Components/ProtectedRoute";
import Sidebar from "./pages/Sidebar/Sidebar";

function App() {
    return (
        <>
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/dashboard" element={<ProtectedRoute element={<Sidebar />} />} />
                    </Routes>
                </Router>
            </AuthProvider>
        </>
    )
}

export default App
