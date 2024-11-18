import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import HomePage from './pages/HomePage/HomePage';
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import ProtectedRoute from "./components/Components/ProtectedRoute";
import ProtectorInv from "./components/Components/ProtectorInv";
import DashboardLayout from "./components/Layouts/DashboardLayout";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import LogPage from "./pages/NewLogPage/NewLogPage";
import BitacoraDetailPage from "./pages/BitacoraDetailPage/BitacoraDetailPage";

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
                        path="/logs/new"
                        element={
                            <ProtectedRoute
                                element={
                                    <DashboardLayout>
                                        <ProtectorInv>
                                            <LogPage />
                                        </ProtectorInv>
                                    </DashboardLayout>
                                }
                            />
                        }
                    />
                    <Route
                        path="/logs/edit/:id"
                        element={
                            <ProtectedRoute
                                element={
                                    <DashboardLayout>
                                        <LogPage />
                                    </DashboardLayout>
                                }
                            />
                        }
                    />
                    <Route
                        path="/log-information/:id"
                        element={
                            <ProtectedRoute
                                element={
                                    <DashboardLayout>
                                        <BitacoraDetailPage />
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
