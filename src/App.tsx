import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import DeckDetail from "./pages/DeckDetail";
import StudySession from "./pages/StudySession";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import { Toaster } from "./components/ui/toaster";

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { currentUser } = useAuth();
    return currentUser ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/" element={<MainLayout />}>
                        <Route
                            index
                            element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="deck/:deckId"
                            element={
                                <PrivateRoute>
                                    <DeckDetail />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="study/:deckId"
                            element={
                                <PrivateRoute>
                                    <StudySession />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="leaderboard"
                            element={
                                <PrivateRoute>
                                    <Leaderboard />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="profile"
                            element={
                                <PrivateRoute>
                                    <Profile />
                                </PrivateRoute>
                            }
                        />
                        {/* Add more routes here */}
                    </Route>
                </Routes>
            </Router>
            <Toaster />
        </AuthProvider>
    );
}

export default App;
