import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import HomePage from './pages/HomePage/HomePage';
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import ProtectedRoute from "./components/Components/ProtectedRoute";
import DashboardLayout from "./components/Layouts/DashboardLayout";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import NewLogPage from "./pages/NewLogPage/NewLogPage";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    {/* Rutas con Sidebar */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute
                                element={
                                    <DashboardLayout>
                                        <DashboardPage />
                                    </DashboardLayout>
                                }
                            />
                        }
                    />
                    <Route
                        path="/new-log"
                        element={
                            <ProtectedRoute
                                element={
                                    <DashboardLayout>
                                        <NewLogPage />
                                    </DashboardLayout>
                                }
                            />
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
