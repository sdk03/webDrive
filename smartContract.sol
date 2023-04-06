// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract cidIPFS{
    // Image Array
    string[] public imgArray;
    address public owner;

    constructor(){
        owner = msg.sender;
    }

    modifier checkUser {
        require(msg.sender == owner);
        _;
    }

    function addData(string memory _imgCID) checkUser public returns(string memory){
        imgArray.push(_imgCID);

        return "IPFS CID Added!";
    }

    function deleteData(uint _index) checkUser public returns(string memory){
        imgArray[_index] = imgArray[imgArray.length - 1];
        imgArray.pop();

        return "Given Index IPFS CID Deleted!";
    }

    function getAllImage() public view returns(string[] memory){
        return imgArray;
    }

    function changeOwner(address _newOwner) checkUser public returns(string memory){
        owner = _newOwner;
        return "Owner now changed!";
    }

}