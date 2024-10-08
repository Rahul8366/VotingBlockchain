import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Web3 from 'web3';

const Vote = () => {
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [web3, setWeb3] = useState(null);
    const [votingContract, setVotingContract] = useState(null);

    // Replace with your contract ABI and address
    const votingContractABI =  [
        {
          "inputs": [],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "voter",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "candidateId",
              "type": "uint256"
            }
          ],
          "name": "Voted",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "candidates",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "voteCount",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [],
          "name": "candidatesCount",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "hasVoted",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "_name",
              "type": "string"
            }
          ],
          "name": "addCandidate",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_candidateId",
              "type": "uint256"
            }
          ],
          "name": "vote",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_candidateId",
              "type": "uint256"
            }
          ],
          "name": "candidateExists",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_candidateId",
              "type": "uint256"
            }
          ],
          "name": "getCandidate",
          "outputs": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "voteCount",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [],
          "name": "getAllCandidates",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "id",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "name",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "voteCount",
                  "type": "uint256"
                }
              ],
              "internalType": "struct Voting.Candidate[]",
              "name": "",
              "type": "tuple[]"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        }
      ];
    const votingContractAddress = '0xe7A5633A88D114bbd63Cb36Ea032DaE9E42F0C6B';

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/candidates');
                setCandidates(response.data);
            } catch (err) {
                console.error('Error fetching candidates:', err);
            }
        };

        // Initialize Web3 and Contract
        const initWeb3 = async () => {
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                await window.ethereum.request({ method: 'eth_requestAccounts' }); // Request accounts
                const contractInstance = new web3Instance.eth.Contract(votingContractABI, votingContractAddress);
                setWeb3(web3Instance);
                setVotingContract(contractInstance);
            } else {
                alert('Please install MetaMask to use this app.');
            }
        };

        fetchCandidates();
        initWeb3();
    }, []);

    const handleVote = async () => {
        const token = localStorage.getItem('token'); // Get JWT token from local storage

        if (!token) {
            setError('You need to be logged in to vote.');
            return;
        }

        const voterId = localStorage.getItem('voterId'); // Get voter ID from local storage

        try {
            if (!votingContract || !web3) {
                throw new Error('Web3 or contract not initialized');
            }

            // Get the list of accounts
            const accounts = await web3.eth.getAccounts();
            const account = accounts[0]; // Use the first account

            // Call the vote function on the smart contract
            const candidate = candidates.find(c => c._id === selectedCandidate);
            const candidateIdNum = candidate.numericalId; // Assuming numericalId is available

            // Send the transaction
            await votingContract.methods.vote(candidateIdNum).send({ from: account });

            // Increment the vote count in MongoDB
            await axios.post('http://localhost:5000/api/candidates/vote', { voterId, candidateId: selectedCandidate }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSuccess('Vote cast successfully!');
            setError('');
            setSelectedCandidate('');
        } catch (err) {
            if (err.message.includes('You have already voted!')) {
                setError('You have already voted!');
            } else {
                console.error(err);
                setError('An error occurred while casting your vote.');
            }
            setSuccess('');
        }
    };

    return (
        <div>
            <h3>Vote for a Candidate</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            {candidates.length > 0 ? (
                candidates.map((candidate) => (
                    <div key={candidate._id}>
                        <input
                            type="radio"
                            name="candidate"
                            value={candidate._id}
                            checked={selectedCandidate === candidate._id}
                            onChange={() => setSelectedCandidate(candidate._id)}
                        />
                        {candidate.name}
                    </div>
                ))
            ) : (
                <p>No candidates available</p>
            )}
            <button onClick={handleVote} disabled={!selectedCandidate}>
                Vote
            </button>
        </div>
    );
};

export default Vote;
