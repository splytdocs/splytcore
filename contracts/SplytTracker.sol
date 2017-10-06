pragma solidity ^0.4.0;
import "browser/Listing.sol";

contract SplytTracker {

    mapping (address => string) idByAddress;
    mapping (string => address) addressById;
    uint public version;
    string public ownedBy;

    function SplytTracker(uint _version, string _ownedBy) {
        version = _version;
        ownedBy = _ownedBy;
    }

    // Setter functions
    function createListing(
        string _listingId,
        string _title,
        string _listedByUserId,
        string _dateListed,
        string _expirationDate,
        address _assetAddress
        ) private returns(bool) {
        address newListing = new Listing(
            _listingId,
            _title,
            _listedByUserId,
            _dateListed,
            _expirationDate,
            _assetAddress
            );
        idByAddress[newListing] = _listingId;
        addressById[_listingId] = newListing;
        return true;
    }

    function addToTracker(string _listingId, address _listingAddressS) returns (bool) {
        idByAddress[_listingAddressS] = _listingId;
        addressById[_listingId] = _listingAddressS;
        return true;
    }

    // Getter functions
    function getAddressById (string _listingId) public constant returns (address) {
        return addressById[_listingId];
    }

    function getIdByAddress (address _contractAddr) public constant returns (string) {
        return idByAddress[_contractAddr];
    }
}