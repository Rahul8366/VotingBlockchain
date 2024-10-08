// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    mapping(uint => Candidate) public candidates;
    mapping(address => bool) public hasVoted;
    uint public candidatesCount;

    constructor() {
        addCandidate("Alice");
        addCandidate("Bob");
    }

    function addCandidate(string memory _name) public {
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        candidatesCount++;
    }

    event Voted(address indexed voter, uint indexed candidateId);

function vote(uint _candidateId) public {
    require(!hasVoted[msg.sender], "You have already voted.");
    require(_candidateId < candidatesCount, "Invalid candidate ID.");

    hasVoted[msg.sender] = true;
    candidates[_candidateId].voteCount++;

    emit Voted(msg.sender, _candidateId);
}


    function candidateExists(uint _candidateId) public view returns (bool) {
        return _candidateId < candidatesCount;
    }

    function getCandidate(uint _candidateId) public view returns (string memory name, uint voteCount) {
    require(_candidateId < candidatesCount, "Invalid candidate ID.");
    Candidate memory candidate = candidates[_candidateId];
    return (candidate.name, candidate.voteCount);
    }

    function getAllCandidates() public view returns (Candidate[] memory) {
    Candidate[] memory allCandidates = new Candidate[](candidatesCount);
    for (uint i = 0; i < candidatesCount; i++) {
        allCandidates[i] = candidates[i];
    }
    return allCandidates; 
    }


}
