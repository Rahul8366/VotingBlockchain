import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Web3 from 'web3';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

const Vote = () => {
    const [candidates, setCandidates] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [web3, setWeb3] = useState(null);
    const [votingContract, setVotingContract] = useState(null);

    const votingContractABI = [
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
    const votingContractAddress = '0x7F7f17299ef1Bd91f8CB6fa2d5dC5C5083fAbC1a';

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/candidates');
                setCandidates(response.data);
            } catch (err) {
                console.error('Error fetching candidates:', err);
                setError('Failed to load candidates. Please try again later.');
            }
        };

        const initWeb3 = async () => {
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const contractInstance = new web3Instance.eth.Contract(votingContractABI, votingContractAddress);
                setWeb3(web3Instance);
                setVotingContract(contractInstance);

                // Log available methods to check if 'vote' is there
                console.log('Voting contract methods:', contractInstance.methods);
            } else {
                alert('Please install MetaMask to use this app.');
            }
        };

        fetchCandidates();
        initWeb3();
    }, []);

    const handleVote = async (candidateId) => {
        const token = localStorage.getItem('token');
        const voterId = localStorage.getItem('voterId');

        if (!token) {
            setError('You need to be logged in to vote.');
            return;
        }

        if (!candidateId) {
            setError('No candidate selected.');
            return;
        }

        try {
            if (!votingContract || !web3) {
                throw new Error('Web3 or contract not initialized');
            }

            const accounts = await web3.eth.getAccounts();
            const account = accounts[0];
            console.log(`Attempting to vote for candidate: ${candidateId} from account: ${account}`);
            const candidate = candidates.find(c => c._id === candidateId);
            const candidateIdNum = candidate.numericalId;

            // Check if votingContract has the vote method
            if (typeof votingContract.methods.vote !== 'function') {
                setError('The vote method is not available on the contract.');
                return;
            }

            // Call the vote function on the smart contract
            const receipt = await votingContract.methods.vote(candidateIdNum).send({ from: account, gas: 300000 });
            console.log('Transaction receipt:', receipt);

            // Increment the vote count in MongoDB
            await axios.post('http://localhost:5000/api/candidates/vote', { voterId, candidateId }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSuccess('Vote cast successfully!');
            setError('');
        } catch (err) {
            console.error('Vote error:', err);
            if (err.response) {
                if (err.response.status === 403) {
                    setError('You have already voted!');
                } else {
                    setError('An error occurred while casting your vote: ' + (err.response.data.message || err.message));
                }
            } else {
                setError('An error occurred while casting your vote: ' + err.message);
            }
            setSuccess('');
        }
    };

    return (
        <div className="container mt-5">
            <h3 className="text-center">Vote for a Candidate</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="row">
                {candidates.length > 0 ? (
                    candidates.map((candidate) => (
                        <div className="col-md-4 mb-4" key={candidate._id}>
                            <div className="card">
                                <div className="card-body text-center">
                                    <h5 className="card-title">{candidate.name}</h5>
                                    <button
                                        onClick={() => handleVote(candidate._id)}
                                        className="btn btn-primary"
                                    >
                                        Vote
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No candidates available</p>
                )}
            </div>
        </div>
    );
};

export default Vote;
