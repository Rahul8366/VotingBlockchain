import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

const Register = () => {
    const [voterId, setVoterId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/register', { voterId, password });
            alert('Registered successfully!');
            navigate('/login'); // Redirect to login page after registration
        } catch (error) {
            console.error('Registration error:', error);
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <div className="container mt-5">
            <h3 className="text-center">Register</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-3">
                    <label htmlFor="voterId" className="form-label">Voter ID</label>
                    <input
                        type="text"
                        id="voterId"
                        className="form-control"
                        value={voterId}
                        onChange={(e) => setVoterId(e.target.value)}
                        placeholder="Enter your voter ID"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        id="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">Register</button>
            </form>
        </div>
    );
};

export default Register;
