import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Login from './components/Login';
import Logout from './components/Logout';
import Chatbot from './components/Chatbot';

const App = () => {
    const { isAuthenticated, loginWithRedirect } = useAuth0();

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/chat" element={isAuthenticated ? <Chatbot /> : <Login />} />
                    <Route path="/" element={
                        isAuthenticated ? (
                            <Chatbot />
                        ) : (
                            <div>
                                <h1>Welcome to the Chatbot!</h1>
                                <button onClick={loginWithRedirect}>Log In</button>
                            </div>
                        )
                    } />
                </Routes>
            </div>
        </Router>
    );
};

export default App;