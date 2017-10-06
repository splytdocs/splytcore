pragma solidity ^0.4.0;

contract Listing {

    string listingId;
    string title;
    string listedByUserId;
    string dateListed;
    bool isActive;
    string expirationDate;
    address owner;
    address assetAddress;


    modifier onlyOwner() {
        if(msg.sender == owner) {
            _;
        }
    }

    // Constructor function. Declare all above variable in this function
    function Listing(
        string _listingId,
        string _title,
        string _listedByUserId,
        string _dateListed,
        string _expirationDate,
        address _assetAddress
        ) {
            owner = msg.sender;
            listingId = _listingId;
            title = _title;
            listedByUserId = _listedByUserId;
            dateListed = _dateListed;
            isActive = true;
            expirationDate = _expirationDate;
            assetAddress = _assetAddress;
    }


    function getListingConfig() onlyOwner constant returns(string, string, string, string, bool, string, address, address) {
        return (listingId, title, listedByUserId, dateListed, isActive, expirationDate, owner, assetAddress);
    }

    function changeActiveInactive (bool _isActive) onlyOwner {
        isActive = _isActive;
    }

    function changeTitle (string _title) onlyOwner {
        title = _title;
    }

    function changeExpirationDate (string _expirationDate) onlyOwner {
        expirationDate = _expirationDate;
    }
}