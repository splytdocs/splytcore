pragma solidity ^0.4.0;

contract Listing {
    
    struct CreatedBy {
        string userId;  // userId from mongo collection
        string name;    // name from mongo collection
        address createdByAddress;
    }
    
    string listingId;               // listingId from mongo collection
    string createdOn;               // iso date from mongo collection, prefably milliseconds
    bool isActive;                  // isActive flag from mongo collection
    int []location;                 // location[0] == lng, location[1] == lat
    uint totalContributions;         // !mongo collection, just calculated based on each contributions
    CreatedBy createdBy;
    mapping (address => uint) contributions;    
    
    // Constructor function. Declare all above variable in this function
    function Listing(
        string _listingId, 
        string _createdOn, 
        bool _isActive, 
        int _lng, 
        int _lat, 
        string _createdById, 
        string _createdByName
        ) {
            
            listingId = _listingId;
            createdOn = _createdOn;
            isActive = _isActive;
            location.push(_lng);
            location.push(_lat);
            createdBy.createdByAddress = msg.sender;
            createdBy.userId = _createdById;
            createdBy.name = _createdByName;
            
    }
    
    
    function contribute() payable returns (bool) {
        contributions[msg.sender] = msg.value;
        addToTotalContributions();
        return true;
    }
    
    function addToTotalContributions() private {
        totalContributions += msg.value;
    }
    
    function setActiveInactive(bool _flag) returns (bool) {
        isActive = _flag;
    }
    
    // TODO: Calculate percent ownership
    // TODO: Calculate open seats AKA which days can you buy in before purchasing
    // TODO: 1 person buying in more than once into the same product
    
    
    function getMyContributions() returns (uint) {
        return contributions[msg.sender];
    }
    
    function revokeContributions() returns (bool) {
        msg.sender.transfer(contributions[msg.sender]);
        return true;
    }
}