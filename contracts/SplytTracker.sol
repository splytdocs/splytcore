pragma solidity ^0.4.0;

import "browser/Asset.sol";
import "browser/Events.sol";

contract SatTokenInterface {
    function transferFrom(address _from, address _to, uint _value) public returns (bool success);
}

contract SplytTracker {

    mapping (address => bytes12) assetIdByAddress;
    mapping (bytes32 => address) addressByassetId;
    uint public version;
    string public ownedBy;
    address public satTokenAddress;

    function SplytTracker(uint _version, string _ownedBy, address _satToken) public {
        version = _version;
        ownedBy = _ownedBy;
        satTokenAddress = _satToken;
    }

    // Setter functions
    function createAsset(bytes12 _assetId, uint _term, string _termType, string _title, uint _totalCost, uint _exiprationDate, address _mpAddress, uint _mpAmount) public returns(bool) {
        address newAsset = new Asset(_assetId, _term, _termType, _title, _totalCost, _exiprationDate, _mpAddress, _mpAmount);
        assetIdByAddress[newAsset] = _assetId;
        addressByassetId[_assetId] = newAsset;
    }

    // function addToTracker(string _listingId, address _listingAddressS) returns (bool) {
    //     idByAddress[_listingAddressS] = _listingId;
    //     addressById[_listingId] = _listingAddressS;
    //     return true;
    // }


    // Getter functions
    function getAddressById (bytes12 _listingId) public constant returns (address) {
        return addressByassetId[_listingId];
    }

    function getIdByAddress (address _contractAddr) public constant returns (bytes12) {
        return assetIdByAddress[_contractAddr];
    }
    
    function getIdByAddresstest (address _contractAddr) public constant returns (bool) {
        if(assetIdByAddress[_contractAddr] == "0x0") {
            return false;
        } else {
            return true;
        }
    }
    
    function contribute(address _from, address _to, uint _amount) public returns (bool) {
        if(assetIdByAddress[msg.sender] == "0x0") {
            return false;
        }
        SatTokenInterface satTokenInterface = SatTokenInterface(satTokenAddress);
        bool result = satTokenInterface.transferFrom(_from, _to, _amount);
        return result;
    }
}