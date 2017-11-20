pragma solidity ^0.4.18;

contract ERC20 {
    
    
    string public constant name = "Splyt Autonomous Tokens";
    string public constant symbol = "SAT";
    uint8 public constant decimals = 18;
    struct Meta {
        uint balance;
        mapping(address => uint)[] allowance;
    }
    mapping(address => Meta) user;
    
    
    function totalSupply() constant returns (uint totalSupply) {
        return this.balance;
    }
    
    function balanceOf(address _owner) constant returns (uint balance) {
        return user[_owner].balance;
    }
    
    function transfer(address _to, uint _value) returns (bool success) {
        if (user[msg.sender].balance >= _value) {
            user[msg.sender].balance -= _value;
            user[_to].balance += _value;
            return true;
        } else {
            return false;
        }
    }
    
    function transferFrom(address _from, address _to, uint _value) returns (bool success) {
        if(user[_from].balance >= _value) {
            user[_from].balance -= _value;
            user[_to].balance += _value;
            return true;
        } else {
            return false;
        }
    }
    
    function approve(address _spender, uint _value) returns (bool success) {
        user[msg.sender].allowance[_spender].push(_value) = _value;
        return true;
    }
    
    function allowance(address _owner, address _spender) constant returns (uint remaining) {
        
    }
    
    event Transfer(address indexed _from, address indexed _to, uint _value);
    event Approval(address indexed _owner, address indexed _spender, uint _value);
}