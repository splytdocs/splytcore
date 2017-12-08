pragma solidity ^0.4.18;

import 'browser/ERC20.sol';

contract SatToken is ERC20 {
    string name;
    uint version;
    string description;
    
    function SatToken (string _name, string _description, uint _version) public {
        name = _name;
        version = _version;
        description = _description;
    }
    
    
    //TODO: Put splyt related $$ transfer logic here
}

