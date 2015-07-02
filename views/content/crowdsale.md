

# Crowdfunder

Creating an organization takes a lot of funds and collective effort. You could ask for donations, but donors prefer to give to projects they are more certain that will get traction and proper funding. This is an example where a crowdfunding would be ideal: you set up a goal and a deadline for reaching it. If you miss your goal, the donations are returned, therefore reducing the risk for donors. Since the code is open and auditable, there is no need for a centralized trusted platform and therefore the only fees everyone will pay are just the gas fees.

Since you already have your own internal currency, you can use that to help gather funds. In this crowdsale contract everyone who contribute will also get a proportional amount of the tokens you created. This can be used to as a proof of citizenship, as a share system or simply as a reward for their help as early pioneers.

**Attention: All contracts could be wiped out at the end of Frontier. While balances on normal addresses will be transported to Homestead, balances in contracts, as well as addresses with less than 1 ether, will not. So use this crowdfunding contract for testing purposes and don't put any significant funds unless you know what you are doing.**

### The code

    contract token { mapping (address => uint) public balance; function token() {}  function sendToken(address receiver, uint amount) returns(bool sufficient) {  } }

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
                deadline = now + _duration * 1 days;
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
            tokenReward.sendToken(msg.sender, f.amount/price);
            
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


    var crowdsaleSource = 'contract token { mapping (address => uint) public balance; function token() {}  function sendToken(address receiver, uint amount) returns(bool sufficient) {  } } contract CrowdSale { address public admin; address public beneficiary; uint public fundingGoal; uint public numFunders; uint public amountRaised; uint public deadline; uint public price; token public tokenReward; mapping (uint => Funder) public funders; /* data structure to hold information about campaign contributors */ struct Funder { address addr; uint amount; } /* at initialization, setup the owner */ function CrowdSale() { admin = msg.sender; } function setup(address _beneficiary, uint _fundingGoal, uint _duration, uint _price, address _reward) returns (bytes32 response){ if (msg.sender == admin && !(beneficiary > 0 && fundingGoal > 0 && deadline > 0)) { beneficiary = _beneficiary; fundingGoal = _fundingGoal; deadline = now + _duration * 1 days; price = _price; tokenReward = token(_reward); return "campaign is set"; } else if (msg.sender != admin) { return "not authorized"; } else { return "campaign cannot be changed"; } } /* The function without name is the default function that is called whenever anyone sends funds to a cntract */ function () returns (bytes32 response) { Funder f = funders[numFunders++]; f.addr = msg.sender; f.amount = msg.value; amountRaised += f.amount; tokenReward.sendToken(msg.sender, f.amount/price); return "thanks for your contribution"; } /* checks if the goal or time limit has been reached and ends the campaign */ function checkGoalReached() returns (bytes32 response) { if (amountRaised >= fundingGoal){ uint i = 0; beneficiary.send(amountRaised); suicide(beneficiary); return "Goal Reached!"; } else if (deadline <= block.number){ uint j = 0; uint n = numFunders; while (j <= n){ funders[j].addr.send(funders[j].amount); funders[j].addr = 0; funders[j].amount = 0; j++; } suicide(beneficiary); return "Deadline passed"; } return "Not reached yet"; } }'

    var crowdsaleCompiled = eth.compile.solidity(crowdsaleSource);
    var crowdsaleAddress = eth.sendTransaction({data: crowdsaleCompiled.CrowdSale.code, from: eth.accounts[0], gas:1000000, gasPrice: web3.toWei(0.001,"finney")}); 

Wait minute until and use the code below to test if your code has been deployed.

    eth.pendingTransactions();
    eth.getCode(crowdsaleAddress)


If it has, then do these commands to instantiate it locally.


    crowdsaleInstance = web3.eth.contract(crowdsaleCompiled.CrowdSale.info.abiDefinition).at(crowdsaleAddress)


### Set Up 

Your first step now is to set the contract up. You can only do it once and it needs to come from the same account that created the contract in the first place.

    var beneficiary = eth.accounts[1];    // create an account for this
    var fundingGoal = web3.toWei(100, "ether"); // raises a 100 ether
    var duration = 7;     // number of days the campaign will last
    var pri
    ce = web3.toWei(0.02, "ether"); // the price of the tokens, in ether
    var reward = registrar.addr("MyFirstCoin");   // the token contract address.

On Beneficiary put the new address that will receive the raised funds. The funding goal is the amount of ether to be raised. Deadline is measured in blocktimes which average 12 seconds, so the default is about 4 weeks. The price is tricky: but just change the number 2 for the amount of tokens the contributors will receive for each ether donated. Finally reward should be the address of the token contract you created in the last section.

In this example you are sending to the crowdsale fund 50% of all the tokens that ever existed, in exchange for 100 ether. Decide those parameters very carefully as they will play a very important role on the next part of our guide.

    crowdsaleInstance.setup.sendTransaction(beneficiary, fundingGoal, deadline, price, reward, {from: eth.accounts[0], gas: 150000, gasPrice:web3.toWei(0.001, "finney")});

Dont forget to fund your newly created contract with the necessary tokens so it can pay back the contributors!

    tokenInstance.sendToken.sendTransaction(crowdsaleAddress, 5000,{from: eth.accounts[0]})

After the transaction is picked, you can check the amount of tokens the crowdsale address has, and all other variables this way:

    tokenInstance.balance.call(crowdsaleAddress)
    crowdsaleInstance.beneficiary.call()
    crowdsaleInstance.amountRaised.call()
    crowdsaleInstance.fundingGoal.call()


### Register a name

You are now set. Anyone can now contribute by simply sending ether to the crowdsale address, but to make it even simpler, let's register a name for your sale. First, pick a name for your crowdsale:

    var name = "mycrowdsale"

Check if that's available and register:

    registrar.addr(name) 
    registrar.reserve.sendTransaction(name, {from: eth.accounts[0]});
 
Wait for the previous transaction to be picked up and then:

    registrar.setAddress.sendTransaction(name, crowdsaleAddress, true,{from: eth.accounts[0]});

Now anyone can contribute to it by simply executing this command: 

    var amount = web3.toWei(4, "ether") // decide how much to contribute

    eth.sendTransaction({from: eth.accounts[0], to: registrar.addr("mycrowdsale"), value: amount, gas:1000000, gasPrice:web3.toWei(0.001, "finney") })

Now wait a minute for the blocks to pickup and you can check if the contract received the ether by doing this: 

    eth.getBalance(crowdsaleAddress);

If the balance has changed, use now this to check if you received tokens

    tokenInstance.balance.call(eth.accounts[0])


This allows anyone to simply send ether to the contract, but others might want to interact more deeply with it, for example they may want to build a service that regularly checks the progress of the crowdfund, or to inspect who are it's funders. In order to do that, one has to instantiate the contract by doing this:

    crowdsaleInstance = eth.contract([{inputs:[],name:'checkGoalReached',outputs:[{name:'response',type:'bytes32'}],type:'function',constant:false},{inputs:[],name:'deadline',outputs:[{name:'',type:'uint256'}],type:'function',constant:true},{inputs:[],name:'beneficiary',outputs:[{name:'',type:'address'}],type:'function',constant:true},{outputs:[{name:'response',type:'bytes32'}],type:'function',constant:false,inputs:[{name:'_beneficiary',type:'address'},{name:'_fundingGoal',type:'uint256'},{name:'_deadline',type:'uint256'},{name:'_price',type:'uint256'},{name:'_reward',type:'address'}],name:'setup'},{constant:true,inputs:[],name:'tokenReward',outputs:[{name:'',type:'address'}],type:'function'},{constant:true,inputs:[],name:'fundingGoal',outputs:[{type:'uint256',name:''}],type:'function'},{inputs:[],name:'price',outputs:[{type:'uint256',name:''}],type:'function',constant:true},{constant:true,inputs:[],name:'amountRaised',outputs:[{name:'',type:'uint256'}],type:'function'},{constant:true,inputs:[],name:'numFunders',outputs:[{name:'',type:'uint256'}],type:'function'},{inputs:[{name:'',type:'uint256'}],name:'funders',outputs:[{name:'addr',type:'address'},{name:'amount',type:'uint256'}],type:'function',constant:true},{inputs:[],name:'admin',outputs:[{name:'',type:'address'}],type:'function',constant:true},{inputs:[],type:'constructor'}]).at(registrar.addr('mycrowdsale'))

**Tip: check the section on how to register your token ABI on the last chapter on how to upload the abi on the network so all the user needs is the name or address of the contract.**

Once instantiated, anyone can check the progress of the contract by calling one of it's functions, like this:

    "The current funding at " +( 100 *  crowdsaleInstance.amountRaised.call() / crowdsaleInstance.fundingGoal.call()) + "% of its goals. Currently, " + crowdsaleInstance.numFunders.call() + " funders have contributed a total of " + web3.fromWei(crowdsaleInstance.amountRaised.call(), "ether") + " ether. The deadline is at " + Date(crowdsaleInstance.deadline.call())


Once the deadline is passed someone has to wake up the contract to have the funds sent to either the beneficiary or back to the funders (if it failed). This happens because there is no such thing as an active loop or timer on ethereum so any future transactions must be pinged by someone.

    crowdsaleInstance.checkGoalReached.sendTransaction({from:eth.accounts[1], gas: 1000000, gasPrice:web3.toWei(0.001, "finney")})


