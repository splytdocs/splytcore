pragma solidity ^0.4.18;

import 'ERC20';

contract SatToken is ERC20 {
    string name;
    uint version;
    string description;
    
    function SatToken (string _name, string _description, uint _version) {
        name = _name;
        version = _version;
        description = _description;
        return true;
    }
    
    
    //TODO: Put splyt related $$ transfer logic here
    
    function initUser() {
        ERC20.initUser();
    }
    
    
}

