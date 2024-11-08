import { useState } from 'react'

import './App.css'
import { ethers } from 'ethers';
 import contractABI from './Web3.json'; // Adjust the path as needed

// Example of connecting to a contract

const contractAddress = "0x99207Ebb2654671e586198e755a5CA0678E30d20";

let provider = new ethers.providers.Web3Provider(window.ethereum);
let contract = new ethers.Contract(contractAddress, contractABI, provider);
let signer;



function App() {
  const [donated,setDonated] = useState(0);
  const [lidoBalance,setLidoBalance] = useState(0);
  const [surplus,setSurplus] = useState(0);



  const connect = async () => {
    await provider.send("eth_requestAccounts",[]);
    signer =  provider.getSigner();
  
    const userAddress = await signer.getAddress();
    contract = new ethers.Contract (contractAddress, contractABI, signer);
    console.log(userAddress); 
  
  };
  
  const deposit = async () => {
    let userAmount = document.getElementById('deposit-amount').value;
    const weiAmount = ethers.utils.parseEther(userAmount);
    const tx = await contract.deposit({ value: weiAmount });
    await tx.wait();
    updateBalances();
  }
  
  const withdraw = async () => {
   await contract.withdraw();
  updateBalances();
  };
  
  const updateBalances = async () => {
    
    const donated =  await contract.donated(); 
    setDonated(ethers.utils.formatEther(donated));

    const lidoBalance = await contract.lidoBalance();
    setLidoBalance(ethers.utils.formatEther(lidoBalance));

    const surplus = lidoBalance.sub(donated);
    setSurplus(ethers.utils.formatEther(surplus));

  };
 
  setTimeout(() => {
    updateBalances();
  }, 1000);


  return (
    
      <div className='App'>
  <header className='App-header'>



           <h2><span className='blue'>WEB</span>3</h2>



           <p>A perpetual vault for charity donation</p>

        </header>



          <div className='App-body'>
          <div className='App-balances'>
            Donated : {donated} ETH <br />
            Balance : {lidoBalance} ETH <br />
            Surplus : {surplus} ETH <br />


          </div>

          <div className='App-button-box'>
             <button onClick={connect}>CONNECT</button>
          </div>

          <div className='App-button-box'>
            <input type="text" id='deposit-amount' placeholder='ETH' /><br></br>
             <button onClick={deposit}>DEPOSIT</button>
            </div>

            <div className='App-button-box'>
              <button onClick={withdraw}>WITHDRAW</button>
          </div>


          </div>




      </div>

    
  )
}

export default App
