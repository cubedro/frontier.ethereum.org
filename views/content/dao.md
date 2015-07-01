

# Democracy DAO

A decentralized autonomous organization: the Democracy Contract

So you raised money for your new country, but so far it’s an Oligarchy, where all the money is controlled by the few people that have the key for your multisignature wallet. This doesn’t sound like a great start for a new society, does it? So let’s create a democratic organization.

```js
contract multisig {   
  function multisig() { 
    // when a contract has a function with the same name as itself, 
    // then that function is run at startup
    m_numOwners = 1; 
    m_required = m_numOwners; 
    m_owners[msg.sender] = m_numOwners; 
  }
    
  function transact(address _to, uint _value) external onlyowner {
    // Each transaction is converted in a hash and awaits confirmation
        if (confirm(m_owners[msg.sender], sha3(_to, _value)))
            _to.send(_value);
    }
  
  function addOwner(address _newOwner) external onlyowner {
    // Any owner can invite more, and all transactions need to be approved by more than half of them
    if (!(isOwner(_newOwner))) {
      m_numOwners++;
      m_required = m_numOwners / 2 + 1;
      m_owners[_newOwner] = m_numOwners;  
    }
  }
  
    function confirm(uint _owner, bytes32 _hash) internal returns (bool) {
    // Does some bitshifting magic to confirm transactions
        uint ownerBit = 2**_owner;
        if (m_pending[_hash].confirmed & ownerBit == 0) {
            m_pending[_hash].confirmed &= ownerBit;
            if (++m_pending[_hash].numConfirmations >= m_required) { 
                delete m_pending[_hash];
                return true;
            }
        } 
    }
  // What follows are variables that are used to describe the function
    modifier onlyowner() { if (isOwner(msg.sender)) _ }
  
  // Accessors to allow reading function variables
    function isOwner(address addr) returns (bool) { return m_owners[addr] > 0; }
    function totalOwners() returns (uint) { return m_numOwners; }
    function totalRequiredConfirmations() returns (uint) { return m_required; }
  function pendingConfirmations(address _to, uint _value) returns (uint) { return m_pending[sha3(_to, _value)].numConfirmations; }
  
  // Declaring the contract structure
    uint m_numOwners;
    uint m_required;
    mapping(address => uint) m_owners;
    mapping(bytes32 => Pending) m_pending;
    struct Pending {
        uint confirmed;
        uint numConfirmations;
    }
}
```


There’s a lot going on in this contract right now, but if you have any experience with programming languages you will probably be able to get a grasp on it. The basics is that this is a collective account with multiple account owners. Any owner can invite more people to be owners, and any owner can request money to be sent to some other account. But in order for the transaction to go through, it has to be agreed by at least 50%+1 of the account holders.

Now take that contract and compile it via the online tool provided.

The most important is the compiled hex code and the contract interface. Replace the code below by what the compiler has provided you.

```js
var compiledCode = "0x5b6001600060005081905550600060005054600160005081905550600060005054600260005060003373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050819055505b6103db806100636000396000f3006000357c010000000000000000000000000000000000000000000000000000000090048063243669ad146100665780632f54bf6e14610078578063510f43f61461008d5780637065cb481461009f578063a7cf6e22146100b0578063f77ac668146100c857005b61006e61026d565b8060005260206000f35b61008360043561022c565b8060005260206000f35b61009561027f565b8060005260206000f35b6100aa60043561019f565b60006000f35b6100be600435602435610291565b8060005260206000f35b6100d66004356024356100dc565b60006000f35b6100e53361022c565b6100ee5761019a565b610160600260005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505460408473ffffffffffffffffffffffffffffffffffffffff166c01000000000000000000000000028152601401838152602001604090036040206102f9565b61016957610199565b8173ffffffffffffffffffffffffffffffffffffffff166000826000600060006000848787f161019557005b5050505b5b5b5050565b6101a83361022c565b6101b157610228565b6101ba8161022c565b156101c457610227565b6000600081815054809291906001019190505550600160026000600050540401600160005081905550600060005054600260005060008373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050819055505b5b5b50565b60006000600260005060008473ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054119050610268565b919050565b6000600060005054905061027c565b90565b6000600160005054905061028e565b90565b60006003600050600060408573ffffffffffffffffffffffffffffffffffffffff166c010000000000000000000000000281526014018481526020016040900360402081526020019081526020016000206000506001016000505490506102f3565b92915050565b600060008360020a905060008160036000506000868152602001908152602001600020600050600001600050541614610331576103d3565b8060036000506000858152602001908152602001600020600050600001600082828250541692505081905550600160005054600360005060008581526020019081526020016000206000506001016000818150546001019190508190551015610399576103d2565b600360005060008481526020019081526020016000206000600082016000506000905560018201600050600090555050600191506103d4565b5b5b509291505056"`

var multisigAbi = [   {      "constant" : false,      "inputs" : [],      "name" : "totalOwners",      "outputs" : [         {            "name" : "",            "type" : "uint256"         }      ],      "type" : "function"   },   {      "constant" : false,      "inputs" : [         {            "name" : "addr",            "type" : "address"         }      ],      "name" : "isOwner",      "outputs" : [         {            "name" : "",            "type" : "bool"         }      ],      "type" : "function"   },   {      "constant" : false,      "inputs" : [],      "name" : "totalRequiredConfirmations",      "outputs" : [         {            "name" : "",            "type" : "uint256"         }      ],      "type" : "function"   },   {      "constant" : false,      "inputs" : [         {            "name" : "_newOwner",            "type" : "address"         }      ],      "name" : "addOwner",      "outputs" : [],      "type" : "function"   },   {      "constant" : false,      "inputs" : [         {            "name" : "_to",            "type" : "address"         },         {            "name" : "_value",            "type" : "uint256"         }      ],      "name" : "pendingConfirmations",      "outputs" : [         {            "name" : "",            "type" : "uint256"         }      ],      "type" : "function"   },   {      "constant" : false,      "inputs" : [         {            "name" : "_to",            "type" : "address"         },         {            "name" : "_value",            "type" : "uint256"         }      ],      "name" : "transact",      "outputs" : [],      "type" : "function"   }]
```

```js
var sender = eth.accounts[0]
var codeAddress = eth.sendTransaction({data: compiledCode, from: sender}); 
```

Wait minute until and use the code below to test if your code has been deployed.

```js
eth.getCode(codeAddress)
```

If it has, then do these commands to instantiate it locally.

```js
MultisigContract = eth.contract(multisigAbi)
multisigInstance = MultisigContract.at(codeAddress)
```

The code is ready for use. The first thing you need to do is to add a new owner to it. If you want to test it with a friend, put his address here, but if you want to test it locally, you’ll need multiple accounts. Read the section “creating a new account” above, if you haven’t done so already.

```js
//.call().totalOwners()
//.call().totalRequiredConfirmations()
//.pendingConfirmations(eth.accounts[4], web3.toWei(1, "ether"))

var newSigner = eth.accounts[1]
multisigInstance.addOwner.sendTransaction(newSigner, {from: sender})
```

The next step is to fund your collective account. All contracts can hold ether, just like a normal account. Notice that any ether sent to the contract belongs to it now, and will be only moved under the specific circumstances set up by its code. So before you send any significant amount, test it with a tiny bit of funds, because if anything goes wrong that money will be lost forever.

```js
var amount = web3.toWei(0.01, "ether");
eth.sendTransaction({from: sender, to: codeAddress, value: amount})
```

Wait for a minute for the transaction to be picked up by the network and then you can execute this command to test the balance:

```js
eth.getBalance(codeAddress)
```

If the balance is not zero, this means that you have successfully funded your account, and that means that your previous transaction, adding a new owner to your multi-owned account, has also gone through. We’re going to ask for your contract now to send money to someone else. Generate a third account to be the beneficiary and type the following code:

```js
var beneficiary = eth.accounts[2] 
multisigInstance.transact.sendTransaction(beneficiary, 1000, {from: sender})
```

If you check the balance of the beneficiary or the contract, you’ll see that they haven’t changed, and this time it’s not a question of waiting a minute or so. It’s because for this particular contract’s transaction to go through, they need the approval of at least half, plus one, of the account owners. Since your contract is only owned by 2 accounts, it needs 2 approvals. In this case, this is done by having the second account send an identical transaction–same beneficiary and exact amount–as the previous:

```js
multisigInstance.transact.sendTransaction(beneficiary, 1000, {from: newSigner})`

Note: this transaction, because it’s intended to change the state of the blockchain, requires gas to be executed. If you just created the newSigner account and it doesn’t have any funds, it won’t be able to pay the gas for it to be executed. Check the section on sending transactions to learn how to send money to that account, before it can interact with the blockchain.

Now, wait a minute or so and check the balance of both the account and the beneficiary and you’ll see that the balance changed.

```js
eth.getBalance(beneficiary)
eth.getBalance(codeAddress)
```

If the beneficiary now has any non zero funds means that you just created a contract with multiple owners. Think for a moment about the possibilities: you could generate the second signature in another device you own and have it as a second authentication device, such that if one of your main keys was compromised, your money would still be safe. Or you could have a friend or family use the other signature and use this contract as a joint account, or a trust fund. This could scale up to a small company, where the CFO would have to sign off with any payments coming out of the companies account. 

You just created a Decentralized Autonomous Organization. It’s an organism made of robots and people that live in the blockchain. Just like the “Greeter” bot you created earlier, once it’s public it will always exist on the blockchain, following the exact rules it was supposed to do. Unless those were explicitly stated in its constitution, there’s nothing anyone can do to embezzle it’s funds or stop it, so exercise caution before launching one into the network.

Try for yourself: Currently any owner can invite an unlimited amount of other owners. Not only there is a technical limitation because after 256 owners, then the contract will start having weird behaviors, but this is also a trust issue. You may trust someone to give a second signature, but not to invite unlimited other accounts. A single malicious user could takeover the whole account bg generating a hundred private accounts and being the only one in control of all the money. Can you fix this such issue? Maybe set a maximum number of owners, or limit the people who are able to invite more. Also see if you can change the contract to create a requirement of a minimum quorum in order for a proposal to pass.  If you can, then try to set a rule that if the transaction is above a certain value, it will require a supermajority, not a simple one. Can you figure out a way to get rid of the immigration office altogether and invite and ban members using an election?