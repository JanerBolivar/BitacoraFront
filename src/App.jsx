import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import HomePage from './pages/HomePage/HomePage';
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import { ProtectedAuthenticator, ProtectedLogs, ProtectedManage } from "./components/Components/ProtectedRoute";
import DashboardLayout from "./components/Layouts/DashboardLayout";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import LogPage from "./pages/NewLogPage/NewLogPage";
import BitacoraDetailPage from "./pages/BitacoraDetailPage/BitacoraDetailPage";
import ManageUsersPage from "./pages/ManageUsersPage/ManageUsersPage";

import CreateUserAdmin from "./pages/CreateUserAdmin/CreateUserAdmin";

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
                            <ProtectedAuthenticator
                                element={
                                    <DashboardLayout>
                                        <DashboardPage />
                                    </DashboardLayout>
                                }
                            />
                        }
                    />
                    <Route
                        path="/manage-users"
                        element={
                            <ProtectedAuthenticator
                                element={
                                    <DashboardLayout>
                                        <ProtectedManage>
                                            <ManageUsersPage />
                                        </ProtectedManage>
                                    </DashboardLayout>
                                }
                            />
                        }
                    />
                    <Route
                        path="/manage/create-user"
                        element={
                            <ProtectedAuthenticator
                                element={
                                    <DashboardLayout>
                                        <ProtectedManage>
                                            <CreateUserAdmin />
                                        </ProtectedManage>
                                    </DashboardLayout>
                                }
                            />
                        }
                    />
                    <Route
                        path="/logs/new"
                        element={
                            <ProtectedAuthenticator
                                element={
                                    <DashboardLayout>
                                        <ProtectedLogs>
                                            <LogPage />
                                        </ProtectedLogs>
                                    </DashboardLayout>
                                }
                            />
                        }
                    />
                    <Route
                        path="/logs/edit/:id"
                        element={
                            <ProtectedAuthenticator
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
                            <ProtectedAuthenticator
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
