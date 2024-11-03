// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;


import "@openzeppelin/contracts/token/ERC20/IERC20.sol";



interface ILido is IERC20 {
  function submit(address _referral) external payable returns (uint256 StETH);
  function withdraw(uint256 _amount, bytes32 _pubkeyHash) external; // wont be available until post-merge
  function sharesOf(address _owner) external returns (uint balance);
}





contract web3simple{


address public  charity =    0x0464C41A7Ca22878B2D95e6967ed564ee0B77286;  // givewell address = 0x4647c3b4c5ba4efa6d8197331de00c26ce36e8e6  
address public  stETH = 0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af;   // Lido and stETH token address (sepholia)
uint public donated;

function deposit() public payable  {
    ILido(stETH).submit{value: msg.value}(address(this));
    donated += msg.value;
}

function lidoBalance() public view  returns(uint) {
  return  ILido(stETH).balanceOf(address(this));

}

function withdraw() public {
    uint balance = ILido(stETH).balanceOf(address(this));

    uint surplus = balance - donated;

    require(surplus >= 0, "Nothing to return"); 

    ILido(stETH).transfer(charity, surplus);
}



function updateWallet(address _newAddress) public {
     require(msg.sender==charity,"Only charity can update wallet");
     charity = _newAddress;
}

}
