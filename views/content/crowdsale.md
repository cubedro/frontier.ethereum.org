

# Crowdfund your idea

Sometimes a good idea takes a lot of funds and collective effort. You could ask for donations, but donors prefer to give to projects they are more certain that will get traction and proper funding. This is an example where a crowdfunding would be ideal: you set up a goal and a deadline for reaching it. If you miss your goal, the donations are returned, therefore reducing the risk for donors. Since the code is open and auditable, there is no need for a centralized trusted platform and therefore the only fees everyone will pay are just the gas fees.

In a crowdfunding prizes are usually given. This would require you to get everyones contact information and keep track of who owns what. But since you just created your own token, why not use that to keep track of the prizes? This allows donors to immediatly own something after they donated. They can store it safely, but they can also sell or trade it if they realize they don't want the prize anymore. If your idea is something physical, all you have to do after the project is completed is to give the product to everyone who sends you back a token. If the project is digital the token itself can be immediatly be used for users to participate or get entry on your project.

**Attention: All contracts could be wiped out at the end of Frontier. While balances on normal addresses will be transported to Homestead, balances in contracts, as well as addresses with less than 1 ether, will not. So use this crowdfunding contract for testing purposes and don't put any significant funds unless you know what you are doing.**

### The code

The way this particular crowdsale contract works is that you set an exchange rate for your token and then the donors will immediatly get a proportional amount of tokens in exchange of their ether. You will also choose a funding goal and a deadline: once that deadline is over you can ping the contract and if the goal was reached it will send the ether raised to you, otherwise it goes back to the donors. Donors keep their tokens even if the project doesnt reach it's goal, as a proof that they helped.

    contract token { mapping (address => uint) public coinBalanceOf; function token() {}  function sendCoin(address receiver, uint amount) returns(bool sufficient) {  } }

    contract CrowdSale {
        
        address public admin;
        address public beneficiary;
        uint public fundingGoal;
        uint public numFunders;
        uint public amountRaised;
        uint public deadline;
        uint public price;
        token public tokenReward;   
        mapping (uint => Funder) public funders;
        
        /* data structure to hold information about campaign contributors */
        struct Funder {
            address addr;
            uint amount;
        }
        
        /*  at initialization, setup the owner */
        function CrowdSale() {
        admin = msg.sender;
        }   
        
        function setup(address _beneficiary, uint _fundingGoal, uint _duration, uint _price, address _reward) returns (bytes32 response){
            if (msg.sender == admin && !(beneficiary > 0 && fundingGoal > 0 && deadline > 0)) {
                beneficiary = _beneficiary;
                fundingGoal = _fundingGoal;
                deadline = now + _duration * 1 minutes;
                price = _price;
                tokenReward = token(_reward);
                
                return "campaign is set";
            } else if (msg.sender != admin) {
                return "not authorized";
            } else  {
                return "campaign cannot be changed";
            }
        }
        
        /* The function without name is the default function that is called whenever anyone sends funds to a contract */
        function () returns (bytes32 response) {
            Funder f = funders[numFunders++];
            f.addr = msg.sender;
            f.amount = msg.value;
            amountRaised += f.amount;
            tokenReward.sendCoin(msg.sender, f.amount/price);
            
            return "thanks for your contribution";
        }
            
        /* checks if the goal or time limit has been reached and ends the campaign */
        function checkGoalReached() returns (bytes32 response) {
            if (amountRaised >= fundingGoal){
                uint i = 0; 
                beneficiary.send(amountRaised);
             suicide(beneficiary);
             return "Goal Reached!"; 
            }
            else if (deadline <= block.number){
                uint j = 0;
                uint n = numFunders;
                while (j <= n){
                    funders[j].addr.send(funders[j].amount);
                    funders[j].addr = 0;
                    funders[j].amount = 0;
                    j++;
                }
            suicide(beneficiary);
                return "Deadline passed";
            }
            return "Not reached yet";
        }
    }

You know the drill. Remove line breaks and copy the following commands on the terminal:


    var crowdsaleSource = 'contract token { mapping (address => uint) public coinBalanceOf; function token() {} function sendCoin(address receiver, uint amount) returns(bool sufficient) { } } contract CrowdSale { address public admin; address public beneficiary; uint public fundingGoal; uint public numFunders; uint public amountRaised; uint public deadline; uint public price; token public tokenReward; mapping (uint => Funder) public funders; /* data structure to hold information about campaign contributors */ struct Funder { address addr; uint amount; } /* at initialization, setup the owner */ function CrowdSale() { admin = msg.sender; } function setup(address _beneficiary, uint _fundingGoal, uint _duration, uint _price, address _reward) returns (bytes32 response){ if (msg.sender == admin && !(beneficiary > 0 && fundingGoal > 0 && deadline > 0)) { beneficiary = _beneficiary; fundingGoal = _fundingGoal; deadline = now + _duration * 1 minutes; price = _price; tokenReward = token(_reward); return "campaign is set"; } else if (msg.sender != admin) { return "not authorized"; } else { return "campaign cannot be changed"; } } /* The function without name is the default function that is called whenever anyone sends funds to a contract */ function () returns (bytes32 response) { Funder f = funders[numFunders++]; f.addr = msg.sender; f.amount = msg.value; amountRaised += f.amount; tokenReward.sendCoin(msg.sender, f.amount/price); return "thanks for your contribution"; } /* checks if the goal or time limit has been reached and ends the campaign */ function checkGoalReached() returns (bytes32 response) { if (amountRaised >= fundingGoal){ uint i = 0; beneficiary.send(amountRaised); suicide(beneficiary); return "Goal Reached!"; } else if (deadline <= block.number){ uint j = 0; uint n = numFunders; while (j <= n){ funders[j].addr.send(funders[j].amount); funders[j].addr = 0; funders[j].amount = 0; j++; } suicide(beneficiary); return "Deadline passed"; } return "Not reached yet"; } }'

    var crowdsaleCompiled = eth.compile.solidity(crowdsaleSource);
    var crowdsaleAddress = eth.sendTransaction({data: crowdsaleCompiled.CrowdSale.code, from: eth.accounts[0], gas:1000000, gasPrice: web3.toWei(0.001,"finney")}); 

Wait minute until and use the code below to test if your code has been deployed.

    eth.pendingTransactions();
    eth.getCode(crowdsaleAddress)


If it has, then do these commands to instantiate it locally.


    crowdsaleInstance = web3.eth.contract(crowdsaleCompiled.CrowdSale.info.abiDefinition).at(crowdsaleAddress)


### Set Up the crowdsale

Your first step now is to set the contract up. You can only do it once and it needs to come from the same account that created the contract in the first place.

    var beneficiary = eth.accounts[1];    // create an account for this
    var fundingGoal = web3.toWei(100, "ether"); // raises a 100 ether
    var duration = 7;     // number of days the campaign will last
    var price = web3.toWei(0.02, "ether"); // the price of the tokens, in ether
    var reward = registrar.addr("MyFirstCoin");   // the token contract address.

On Beneficiary put the new address that will receive the raised funds. The funding goal is the amount of ether to be raised. Deadline is measured in blocktimes which average 12 seconds, so the default is about 4 weeks. The price is tricky: but just change the number 2 for the amount of tokens the contributors will receive for each ether donated. Finally reward should be the address of the token contract you created in the last section.

In this example you are sending to the crowdsale fund 50% of all the tokens that ever existed, in exchange for 100 ether. Decide those parameters very carefully as they will play a very important role on the next part of our guide.

    crowdsaleInstance.setup.sendTransaction(beneficiary, fundingGoal, duration, price, reward, {from: eth.accounts[0], gas: 150000, gasPrice:web3.toWei(0.001, "finney")});

Dont forget to fund your newly created contract with the necessary tokens so it can pay back the contributors!

    tokenInstance.sendCoin.sendTransaction(crowdsaleAddress, 5000,{from: eth.accounts[0]})

After the transaction is picked, you can check the amount of tokens the crowdsale address has, and all other variables this way:

    "Current crowdsale must raise " + web3.fromWei(crowdsaleInstance.fundingGoal.call(), "ether") + " ether before " + Date(crowdsaleInstance.deadline.call())  + " in order to send it to " + crowdsaleInstance.beneficiary.call() + ". It currently holds " + tokenInstance.coinBalanceOf.call(crowdsaleAddress) + " reward tokens and " + web3.fromWei(crowdsaleInstance.amountRaised.call(), "ether") + " ether"


### Register the contract

You are now set. Anyone can now contribute by simply sending ether to the crowdsale address, but to make it even simpler, let's register a name for your sale. First, pick a name for your crowdsale:

    var name = "mycrowdsale"

Check if that's available and register:

    registrar.addr(name) 
    registrar.reserve.sendTransaction(name, {from: eth.accounts[0]});
 
Wait for the previous transaction to be picked up and then:

    registrar.setAddress.sendTransaction(name, crowdsaleAddress, true,{from: eth.accounts[0]});

### Contribute to the crowdsale

Anyone can contribute to it by simply executing this command: 

    var amount = web3.toWei(4, "ether") // decide how much to contribute

    eth.sendTransaction({from: eth.accounts[0], to: registrar.addr("mycrowdsale"), value: amount, gas:1000000, gasPrice:web3.toWei(0.001, "finney") })

Now wait a minute for the blocks to pickup and you can check if the contract received the ether by doing this: 

    web3.fromWei(crowdsaleInstance.amountRaised.call(), "ether") + " ether"

If the balance has changed, use now this to check if you received tokens

    tokenInstance.coinBalanceOf.call(eth.accounts[0]) + " tokens"

### Keep track of the crowdsale

Maybe you might want to interact more deeply with the contract other than contribute. For example you may want to build a service that regularly checks the progress of the crowdfund, or to inspect who are it's funders. In order to do that, one has to instantiate the contract by doing this:

    crowdsaleInstance = eth.contract([{ constant: false, inputs: [ ], name: 'checkGoalReached', outputs: [{ name: 'response', type: 'bytes32' } ], type: 'function' }, { constant: true, inputs: [ ], name: 'deadline', outputs: [{ name: '', type: 'uint256' } ], type: 'function' }, { constant: true, inputs: [ ], name: 'beneficiary', outputs: [{ name: '', type: 'address' } ], type: 'function' }, { constant: false, inputs: [{ name: '_beneficiary', type: 'address' }, { name: '_fundingGoal', type: 'uint256' }, { name: '_duration', type: 'uint256' }, { name: '_price', type: 'uint256' }, { name: '_reward', type: 'address' } ], name: 'setup', outputs: [{ name: 'response', type: 'bytes32' } ], type: 'function' }, { constant: true, inputs: [ ], name: 'tokenReward', outputs: [{ name: '', type: 'address' } ], type: 'function' }, { constant: true, inputs: [ ], name: 'fundingGoal', outputs: [{ name: '', type: 'uint256' } ], type: 'function' }, { constant: true, inputs: [ ], name: 'amountRaised', outputs: [{ name: '', type: 'uint256' } ], type: 'function' }, { constant: true, inputs: [ ], name: 'price', outputs: [{ name: '', type: 'uint256' } ], type: 'function' }, { constant: true, inputs: [ ], name: 'numFunders', outputs: [{ name: '', type: 'uint256' } ], type: 'function' }, { constant: true, inputs: [{ name: '', type: 'uint256' } ], name: 'funders', outputs: [{ name: 'addr', type: 'address' }, { name: 'amount', type: 'uint256' } ], type: 'function' }, { constant: true, inputs: [ ], name: 'admin', outputs: [{ name: '', type: 'address' } ], type: 'function' }, { inputs: [ ], type: 'constructor' } ]).at(registrar.addr('mycrowdsale'))


**Tip: we are working on a process to register your token ABI on the network so all the user needs is the name or address of the contract. The solution exists but it's not very friendly yet.**

Once instantiated, anyone can check the progress of the contract by calling one of it's functions, like this:

    "The current funding at " +( 100 *  crowdsaleInstance.amountRaised.call() / crowdsaleInstance.fundingGoal.call()) + "% of its goals. Currently, " + crowdsaleInstance.numFunders.call() + " funders have contributed a total of " + web3.fromWei(crowdsaleInstance.amountRaised.call(), "ether") + " ether. The deadline is at " + Date(crowdsaleInstance.deadline.call())

### Recover funds

Once the deadline is passed someone has to wake up the contract to have the funds sent to either the beneficiary or back to the funders (if it failed). This happens because there is no such thing as an active loop or timer on ethereum so any future transactions must be pinged by someone.

    crowdsaleInstance.checkGoalReached.sendTransaction({from:eth.accounts[1], gas: 1000000, gasPrice:web3.toWei(0.001, "finney")})

You can check your accounts with these lines of code:

    web3.fromWei(eth.getBalance(eth.accounts[0]), "ether") + " ether"
    tokenInstance.coinBalanceOf.call(eth.accounts[0]) + " tokens"

The crowdsale instance is setup to self destruct once it has done its job, so if the deadline is over and everyone got their prizes the contract is no more, as you can see by running this:

    eth.getCode(crowdsaleAddress)

So you raised a 100 ethers and sucessfully distributed your original coin among the crowdsale donors. What could you do next with those things?




