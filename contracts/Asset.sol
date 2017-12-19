pragma solidity ^0.4.0;
// Dec 18, 2017

contract Asset {

    string public assetId;
    uint public term;
    string public termType;
    uint public amountFunded;
    string public title;
    uint public totalCost;
    uint public expirationDate;
    bool public isContract;

    mapping(string => uint) contributions;

    function Asset(string _assetId, uint _term, string _termType, string _title, uint _totalCost, uint _expirationDate) public {
        assetId = _assetId;
        term = _term;
        termType = _termType;
        title = _title;
        totalCost = _totalCost;
        expirationDate = _expirationDate;
        isContract = true;
    }

    function getAssetConfig() public constant returns(string, uint, string, uint, string, bool, uint, uint) {
        return (assetId, term, termType, amountFunded, title, isOpenForContribution(), totalCost, expirationDate);
    }

    function changeTitle(string _title) public {
        title = _title;
    }

    // Call this function from sat token to verify contributions are open and check for fractional or not
    function contributePrecheck() public constant returns(bool) {
        if(isOpenForContribution()) {
            return true;
        }
        return false;
    }

    function addToTotalContributions() private returns(bool) {
        if (amountFunded + msg.value <= totalCost) {
            amountFunded += msg.value;
            return false;
        } else {
            return true;
        }
    }

    function getMyContributions(string _userId) public constant returns (uint) {
        return contributions[_userId];
    }
    
    function isOpenForContribution() private constant returns (bool) {
       if(totalCost <= amountFunded || now <= expirationDate) {
           return true;
       }
       return false;
    }
    
    function isFractional() public constant returns (bool) {
        if(term > 0) {
            return true;
        } else {
            return false;
        }
    }
    
    function setFunded(uint _amountFund) public {
        amountFunded = _amountFund;
    }
}