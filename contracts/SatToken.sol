pragma solidity ^0.4.19;

import 'browser/ERC20.sol';

// contract SplytTrackerInterface {
//     function getAddressById (string _assetId) public constant returns (address);
// }

// contract AssetInterface {
//     function isFractional() public constant returns (bool);
//     function contributePrecheck() public constant returns(bool);
//     function setFunded(uint _sats) public;
//     uint public totalCost;
//     uint public mpAmount;
//     address public mpAddress;
// }

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
    
    // function payout(string _assetId, address _from, address _to, uint _value, address _mp2Address) {
    //     SplytTracker splytTracker = SplytTracker(trackerAddr);
    //     address assetAddr = splytTracker.getAddressById(_assetId);
    //     Asset asset = Asset(assetAddr);
    //     if(asset.contributePrecheck()) {
    //         if(asset.isFractional()){
    //             //TODO: Pay to contract instead of seller
                
    //         } else {
    //             //TODO: Pay to seller
    //             uint amntToSeller = asset.totalCost() - asset.mpAmount();
    //             uint amntToMp2 = asset.mpAmount() / 2;
    //             uint amntToMp1 = asset.mpAmount() / 2;
    //             bool status1 = transferFrom(_from, _to, amntToSeller);
    //             bool status2 = transferFrom(_from, _mp2Address, amntToMp2);
    //             bool status3 = transferFrom(_from, asset.mpAddress(), amntToMp1);
    //             asset.setFunded(asset.totalCost());
    //         } 
    //     }
    // }
    
    function setTrackerAddr(address _addr) public {
        trackerAddr = _addr;
    }
    
    
    //TODO: Put splyt related $$ transfer logic here
}

