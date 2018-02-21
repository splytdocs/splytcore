pragma solidity ^0.4.18;

// Interface contracts are interface layers to the main contracts which define a function and its input/output parameters. 
// Use in conjuction to real contract's address, you can interact with external contract's functions using this interface layer
contract SplytTrackerInterface {
    function contribute (address _from, address _to, uint _amount) public returns (bool);
}

contract Asset {

    bytes12 public assetId;
    uint public term;
    string public termType;
    uint public amountFunded;
    string public title;
    uint public totalCost;
    uint public expirationDate;
    bool public isContract = true;
    address public mpAddress;
    uint public mpAmount;
    address public tracker;
    address public seller;

    mapping(address => uint) contributions;

    function Asset(bytes12 _assetId, uint _term, string _termType, string _title, uint _totalCost, uint _expirationDate, address _mpAddress, uint _mpAmount) public {
        assetId = _assetId;
        term = _term;
        termType = _termType;
        title = _title;
        totalCost = _totalCost;
        expirationDate = _expirationDate;
        mpAddress = _mpAddress;
        mpAmount = _mpAmount;
        tracker = msg.sender;
    }

    function getAssetConfig() public constant returns(bytes32, uint, string, uint, string, bool, uint, uint, address, uint) {
        return (assetId, term, termType, amountFunded, title, isOpenForContribution(), totalCost, expirationDate, mpAddress, mpAmount);
    }

    function changeTitle(string _title) public {
        title = _title;
    }

    function getMyContributions(address _contributor) public constant returns (uint) {
        return contributions[_contributor];
    }
    
    function isOpenForContribution() private constant returns (bool) {
       if (amountFunded >= totalCost || expirationDate >= now) {
           return false;
       }
       return true;
    }
    
    function isFractional() public constant returns (bool) {
        if (term > 0) {
            return true;
        } else {
            return false;
        }
    }
    
    function setFunded(uint _amountFund) public {
        amountFunded = _amountFund;
    }
    
    function contribute(address _buyingMarketPlace, uint _buyingMarketPlaceFee, address _contributor, uint _contributing) public {
        // Check if expirationDate is greater than now then listing is closed
        if (isOpenForContribution()) {
            revert();
        }
        
        SplytTrackerInterface splytTracker = SplytTrackerInterface(tracker);
        bool result;
        
        if (isFractional()) {
            result = splytTracker.contribute(_contributor, this, _contributing);
            if (result == true) {
                addToContributions(_contributor, _contributing);
            }
            
        } else if (_contributing >= totalCost) {
            result = splytTracker.contribute(_contributor, seller, _contributing);
            if (result == true) {
                addToContributions(_contributor, _contributing);
            }

        } else {
            revert();
        }
    }
    
    function addToContributions(address _contributor, uint _contributing) private {
        amountFunded += _contributing;
        contributions[_contributor] = _contributing;
    }
}