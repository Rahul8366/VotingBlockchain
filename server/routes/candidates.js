const express = require('express');
const Candidate = require('../models/Candidate');
const User = require('../models/User');
// const Web3 = require('web3').default; // Correct import

const router = express.Router();

// Connect to the local Ethereum node
// const web3 = new Web3('http://127.0.0.1:7545'); // Ensure Ganache is running here

// Replace with your actual contract ABI and address
// const votingContractABI =  [
//     {
//       "inputs": [],
//       "stateMutability": "nonpayable",
//       "type": "constructor"
//     },
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "voter",
//           "type": "address"
//         },
//         {
//           "indexed": true,
//           "internalType": "uint256",
//           "name": "candidateId",
//           "type": "uint256"
//         }
//       ],
//       "name": "Voted",
//       "type": "event"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         }
//       ],
//       "name": "candidates",
//       "outputs": [
//         {
//           "internalType": "uint256",
//           "name": "id",
//           "type": "uint256"
//         },
//         {
//           "internalType": "string",
//           "name": "name",
//           "type": "string"
//         },
//         {
//           "internalType": "uint256",
//           "name": "voteCount",
//           "type": "uint256"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function",
//       "constant": true
//     },
//     {
//       "inputs": [],
//       "name": "candidatesCount",
//       "outputs": [
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function",
//       "constant": true
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "",
//           "type": "address"
//         }
//       ],
//       "name": "hasVoted",
//       "outputs": [
//         {
//           "internalType": "bool",
//           "name": "",
//           "type": "bool"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function",
//       "constant": true
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "string",
//           "name": "_name",
//           "type": "string"
//         }
//       ],
//       "name": "addCandidate",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "uint256",
//           "name": "_candidateId",
//           "type": "uint256"
//         }
//       ],
//       "name": "vote",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "uint256",
//           "name": "_candidateId",
//           "type": "uint256"
//         }
//       ],
//       "name": "candidateExists",
//       "outputs": [
//         {
//           "internalType": "bool",
//           "name": "",
//           "type": "bool"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function",
//       "constant": true
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "uint256",
//           "name": "_candidateId",
//           "type": "uint256"
//         }
//       ],
//       "name": "getCandidate",
//       "outputs": [
//         {
//           "internalType": "string",
//           "name": "name",
//           "type": "string"
//         },
//         {
//           "internalType": "uint256",
//           "name": "voteCount",
//           "type": "uint256"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function",
//       "constant": true
//     },
//     {
//       "inputs": [],
//       "name": "getAllCandidates",
//       "outputs": [
//         {
//           "components": [
//             {
//               "internalType": "uint256",
//               "name": "id",
//               "type": "uint256"
//             },
//             {
//               "internalType": "string",
//               "name": "name",
//               "type": "string"
//             },
//             {
//               "internalType": "uint256",
//               "name": "voteCount",
//               "type": "uint256"
//             }
//           ],
//           "internalType": "struct Voting.Candidate[]",
//           "name": "",
//           "type": "tuple[]"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function",
//       "constant": true
//     }
//   ];
// const votingContractAddress = '0xe7A5633A88D114bbd63Cb36Ea032DaE9E42F0C6B';
// const votingContract = new web3.eth.Contract(votingContractABI, votingContractAddress);

// Example of using Web3 to get accounts
router.get('/accounts', async (req, res) => {
    try {
        const accounts = await web3.eth.getAccounts();
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching accounts', error });
    }
});

// Create Candidate
// router.post('/', async (req, res) => {
//     const { name } = req.body;
//     const candidate = new Candidate({ name });
//     await candidate.save();
//     res.json(candidate);
// });

// Create Candidate
// Create Candidate
router.post('/addCandidate', async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Candidate name is required.' });
    }

    try {
        // Calculate the next numerical ID
        const candidateCount = await Candidate.countDocuments();

        // Create a new candidate
        const candidate = new Candidate({ 
            name, 
            numericalId: candidateCount // Use the count as numerical ID
        });
        
        await candidate.save(); // Save candidate to MongoDB

        // Interact with the smart contract
        // const accounts = await web3.eth.getAccounts();
        // const account = accounts[0];
        // await votingContract.methods.addCandidate(name).send({ from: account });

        res.json({ message: 'Candidate added successfully', candidate });
    } catch (error) {
        console.error('Error adding candidate to smart contract:', error.message);
        res.status(500).json({ message: 'Error adding candidate', error: error.message });
    }
});



// Get Candidates
router.get('/', async (req, res) => {
    const candidates = await Candidate.find();
    res.json(candidates);
});

// Vote for Candidate
// router.post('/vote', async (req, res) => {
//     console.log('Vote request received:', req.body);
//     const { voterId, candidateId } = req.body;
//     const user = await User.findOne({ voterId });

//     if (!user) {
//         return res.status(404).json({ message: 'User not found!' });
//     }

//     if (user.hasVoted) {
//         return res.status(403).json({ message: 'You have already voted!' });
//     }

//     const accounts = await web3.eth.getAccounts();
//     const account = accounts[0]; // Assumes the first account is the one voting

//     try {
//         // Interact with the smart contract
//         await votingContract.methods.vote(candidateId).send({ from: account });

//         user.hasVoted = true;
//         await user.save();

//         res.json({ message: 'Vote cast successfully!' });
//     } catch (error) {
//         console.error('Blockchain error:', error); // Log the entire error object
//         res.status(500).json({ message: 'Error while casting vote.', error: error.message });
//     }
// });

// Vote for Candidate through blockchain only first vote
// router.post('/vote', async (req, res) => {
//     const { voterId, candidateId } = req.body;

//     const user = await User.findOne({ voterId });
//     if (!user) {
//         return res.status(404).json({ message: 'User not found!' });
//     }

//     if (user.hasVoted) {
//         return res.status(403).json({ message: 'You have already voted!' });
//     }

//     const candidate = await Candidate.findById(candidateId);
//     if (!candidate) {
//         return res.status(404).json({ message: 'Candidate not found!' });
//     }

//     const candidateIdNum = candidate.numericalId;

//     console.log(`Attempting to vote for candidate ID: ${candidateIdNum}`);
//     console.log(`Voter ID: ${voterId}, Candidate ID from MongoDB: ${candidateId}, Numerical ID for Voting: ${candidateIdNum}`);

//     const accounts = await web3.eth.getAccounts();
//     const account = accounts[0];

//     try {
//         await votingContract.methods.vote(candidateIdNum).send({ from: account, gas: 500000 });

//           // Increment the vote count in MongoDB
//           candidate.voteCount++; // Increment the vote count
//           await candidate.save(); // Save the updated candidate
 
//         user.hasVoted = true;
//         await user.save();

//         res.json({ message: 'Vote cast successfully!' });
//     } catch (error) {
//         console.error('Blockchain error:', error);
//         res.status(500).json({ message: 'Error while casting vote.', error: error.message });
//     }
// });

router.post('/vote', async (req, res) => {
    const { voterId, candidateId } = req.body;

    const user = await User.findOne({ voterId });
    if (!user) {
        return res.status(404).json({ message: 'User not found!' });
    }

    // console.log(`Voter ID: ${voterId}, Current Vote Status: ${user.hasVoted}`);

    if (user.hasVoted) {
        return res.status(403).json({ message: 'You have already voted!' });
    }

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
        return res.status(404).json({ message: 'Candidate not found!' });
    }

    // const candidateIdNum = candidate.numericalId;

    // console.log(`Attempting to vote for candidate ID: ${candidateIdNum}`);

    // const accounts = await web3.eth.getAccounts();
    // const account = accounts[0];

    try {
        // await votingContract.methods.vote(candidateIdNum).send({ from: account, gas: 500000 });
        
            // Increment the vote count in MongoDB
          candidate.voteCount++; // Increment the vote count
          await candidate.save(); // Save the updated candidate

        user.hasVoted = true;
        await user.save();

        console.log(`Vote cast successfully by voter ID: ${voterId}`);
        res.json({ message: 'Vote cast successfully!' });
    } catch (error) {
        console.error('Blockchain error:', error);
        res.status(500).json({ message: 'Error while casting vote.', error: error.message });
    }
});


module.exports = router;
