import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

const Login = () => {
    const [voterId, setVoterId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Use useNavigate instead of useHistory

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { voterId, password });
            localStorage.setItem('token', response.data.token); // Store the JWT token
            localStorage.setItem('voterId', voterId); // Store voter ID
            navigate('/vote'); // Redirect to voting page
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="container mt-5">
            <h3 className="text-center">Login</h3>
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
                <button type="submit" className="btn btn-primary w-100">Login</button>
            </form>
        </div>
    );
};

export default Login;
