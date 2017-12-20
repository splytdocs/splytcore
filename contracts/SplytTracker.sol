pragma solidity ^0.4.0;
import "browser/Asset.sol";

contract SplytTracker {

    mapping (address => string) assetIdByAddress;
    mapping (string => address) addressByassetId;
    uint public version;
    string public ownedBy;
    
    event Error(uint _code, string _message);
    event Success(uint _code, address _assetAddress);

    function SplytTracker(uint _version, string _ownedBy) public {
        version = _version;
        ownedBy = _ownedBy;
    }

    // Setter functions
    function createAsset(string _assetId, uint _term, string _termType, string _title, uint _totalCost, uint _exiprationDate, address _mpAddress, uint _mpAmount) public returns(bool) {
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
    function getAddressById (string _listingId) public constant returns (address) {
        return addressByassetId[_listingId];
    }

    function getIdByAddress (address _contractAddr) public constant returns (string) {
        return assetIdByAddress[_contractAddr];
    }
}