pragma solidity ^0.4.18;
// Dec 18, 2017

import 'browser/ERC20.sol';

contract SplytTracker {
    function getAddressById (string _assetId) public constant returns (address);
}

contract Asset {
    function isFractional() public constant returns (bool);
    function contributePrecheck() public constant returns(bool);
    function setFunded(uint _sats) public;
    uint public totalCost;
}

contract SatToken is ERC20 {
    string name;
    uint version;
    string description;
    address public trackerAddr;
    
    function SatToken (string _name, string _description, uint _version) public {
        name = _name;
        version = _version;
        description = _description;
    }
    
    function payout(string _assetId, address _from, address _to, uint _value) {
        SplytTracker splytTracker = SplytTracker(trackerAddr);
        address assetAddr = splytTracker.getAddressById(_assetId);
        Asset asset = Asset(assetAddr);
        if(asset.contributePrecheck()){
            if(asset.isFractional()){
                //TODO: Pay to contract instead of seller
                
            } else {
                //TODO: Pay to seller
                bool status = transferFrom(_from, _to, asset.totalCost());
                asset.setFunded(asset.totalCost());
            } 
        }
    }
    
    function setTrackerAddr(address _addr) public {
        trackerAddr = _addr;
    }
    
    
    //TODO: Put splyt related $$ transfer logic here
}

