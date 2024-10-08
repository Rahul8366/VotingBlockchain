import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';      // Your Login component
import Vote from './Vote';        // Your Vote component
import Register from './Register';
import Candidate from './Candidates';

const App = () => {
    return (
        <Router>
            <div>
                <h1>Voting System</h1>
                <Routes>
                    <Route path="/" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/vote" element={<Vote />} />
                    <Route path="/candidates" element={<Candidate />} />
                </Routes>
            </div> 
        </Router>
    );
};

export default App;
