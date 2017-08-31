pragma solidity ^0.4.0;
import "browser/Listing";

contract SplytTracker {
    
    mapping (address => string) contractByAddress;
    mapping (string => address) contractById;
    
    // Setter functions
    function createListing( 
        string _listingId, 
        string _createdOn, 
        bool _isActive, 
        int _lng, 
        int _lat, 
        string _createdById, 
        string _createdByName
        ) {
        address newListing = new Listing(
            _listingId, 
            _createdOn, 
            _isActive, 
            _lng, 
            _lat, 
            _createdById, 
            _createdByName
            );
        contractByAddress[newListing] = _listingId;
        contractById[_listingId] = newListing;
    }
    
    // Getter functions
    function getAddressById (string _listingId) returns (address) {
        return contractById[_listingId];
    }
    
    function getIdByAddress (address _contractAddr) returns (string) {
        return contractByAddress[_contractAddr];
    }
}