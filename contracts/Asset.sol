pragma solidity ^0.4.0;



contract Asset {

    string assetId;
    uint term;
    string termType;
    uint amountFunded;
    string title;
    bool openForContributions;
    uint totalCost;
    address owner;

    mapping(string => uint) contributions;

    modifier onlyOwner {
        if (msg.sender == owner) {
            _;
        }
    }

    function Asset(string _assetId, uint _term, string _termType, string _title, uint _totalCost, address _owner) public {
        assetId = _assetId;
        term = _term;
        termType = _termType;
        openForContributions = true;
        title = _title;
        totalCost = _totalCost;
        owner = _owner;
    }

    function getAssetConfig() public constant returns(string, uint, string, uint, string, bool, uint, address) {
        return (assetId, term, termType, amountFunded, title, openForContributions, totalCost, owner);
    }

    function changeTitle(string _title) public onlyOwner {
        title = _title;
    }

    // Fallback function to anyone who pays from outside the ecosystem
    function() public payable {
        msg.sender.transfer(msg.value);
    }

    function contribute(string _userId) public payable {
        if (!openForContributions) {
            msg.sender.transfer(msg.value);
            revert();
        }
        bool shouldRefundMoney = addToTotalContributions();
        if (shouldRefundMoney) {
            msg.sender.transfer(msg.value);
        }
        contributions[_userId] += msg.value;

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
}