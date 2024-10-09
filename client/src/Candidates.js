import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Make sure Bootstrap CSS is imported

const Candidate = () => {
    const [name, setName] = useState('');
    const [candidates, setCandidates] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Fetch candidates when the component mounts
    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/candidates');
                setCandidates(response.data);
            } catch (err) {
                console.error('Error fetching candidates:', err);
                setError('Failed to load candidates.');
            }
        };

        fetchCandidates();
    }, []);

    // Handle adding a new candidate
    const handleAddCandidate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token'); // Get JWT token from local storage

        if (!token) {
            setError('You need to be logged in to add candidates.');
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/candidates/addCandidate', { name }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccess('Candidate added successfully!');
            setError('');
            setName('');
            // Fetch updated candidate list
            const response = await axios.get('http://localhost:5000/api/candidates');
            setCandidates(response.data);
        } catch (err) {
            setError('An error occurred while adding the candidate.');
            setSuccess('');
        }
    };

    return (
        <div className="container mt-5">
            <div className="card mb-4">
                <div className="card-header">
                    <h3>Add a Candidate</h3>
                </div>
                <div className="card-body">
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <form onSubmit={handleAddCandidate}>
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Candidate Name"
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Add Candidate</button>
                    </form>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h4>Existing Candidates</h4>
                </div>
                <div className="card-body">
                    <ul className="list-group">
                        {candidates.length > 0 ? (
                            candidates.map((candidate) => (
                                <li className="list-group-item" key={candidate._id}>{candidate.name}</li>
                            ))
                        ) : (
                            <li className="list-group-item">No candidates available</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Candidate;
