import React, { useEffect, useState } from 'react';
import Web3 from 'web3';

const SendTransaction = () => {
    const [account, setAccount] = useState('');
    const [web3, setWeb3] = useState(null);
    const [transactionStatus, setTransactionStatus] = useState('');

    useEffect(() => {
        const initWeb3 = async () => {
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const accounts = await web3Instance.eth.getAccounts();
                setAccount(accounts[0]);
                setWeb3(web3Instance);
            } else {
                alert('Please install MetaMask!');
            }
        };

        initWeb3();
    }, []);

    const sendTransaction = async () => {
        if (!web3 || !account) {
            console.error('Web3 or account not initialized');
            return;
        }

        const transactionParameters = {
            to: '0x03020A0F51b15B8018b3C184af9D03c592cbfce5', // Replace with the recipient address
            from: account,
            value: web3.utils.toHex(web3.utils.toWei('0.01', 'ether')), // Sending 0.01 ETH
            gas: '21000', // Gas limit
            gasPrice: web3.utils.toHex(await web3.eth.getGasPrice()), // Fetch current gas price
        };

        try {
            const txHash = await web3.eth.sendTransaction(transactionParameters);
            setTransactionStatus(`Transaction sent! Hash: ${txHash.transactionHash}`);
        } catch (error) {
            console.error('Error sending transaction:', error);
            setTransactionStatus('Transaction failed.');
        }
    };

    return (
        <div>
            <h2>Send Transaction</h2>
            <p>Account: {account}</p>
            <button onClick={sendTransaction}>Send 0.01 ETH</button>
            {transactionStatus && <p>{transactionStatus}</p>}
        </div>
    );
};

export default SendTransaction;
