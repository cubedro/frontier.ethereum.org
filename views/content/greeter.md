Now that you mastered the basics on how to get started and how to send ether, it's time to get your hands dirty in what really makes ethereum stand out of the crowd: smart contracts. Smart contracts are pieces of code that live on the blockchain and execute commands exactly how they were told to. They can read other contracts, take decisions, send ether and execute other contracts. Contracts will exist and run as long as the whole network exists, and will only stop if they run out of gas or if they were programmed to self destruct.

What can you do with contracts? You can do almost anything really, but for this guide let's do something simple: you will start your new country.

Your country won't be very powerful compared to most: it will hold no land, have no military and hold no assets other than those that exist on the blockchain. All it's citizens will be voluntary and it is unable to coerce other people by force. 

But what it can do is to gather support around a united cause. You will get funds through a crowdfunding that, if successful, will supply a radically transparent and democratic organization that will only obey its own citizens, will never swerve away from its constitution and cannot be censored or shut down. And all that in less than 300 lines of code.

So let's start now.

**Important: Frontier is considered a test network. All contracts might be wiped when the project transitions to the next phase, and all ether they contain will be lost. Only send small amounts of funds to contracts, unless are okay losing them.**

## Your first citizen: the greeter

[Full documentation](https://github.com/ethereum/go-ethereum/wiki/Contracts-and-Transactions)


Now that you’ve mastered the basics of Ethereum, let’s move into your first serious contract. It’s a big open territory and sometimes you might feel lonely, so our first order of business will be to create a little automatic companion to greet you whenever you feel lonely. We’ll call him the “Greeter”.


    contract greeter {
        // Declare variable admin which will store an address
        address public admin;

        // this function is executed at initialization 
        // and sets the owner of the contract
        function greeter() {
            admin = msg.sender;
        }

        // main function
        function greet(bytes32 input) returns (bytes32) {
            if (input == "") {  return "Hello, World"; }
            return input; 
        }
       
        // Function to recover the funds on the contract
        function kill() {
            if (msg.sender == admin) {
                suicide(admin);
            }
        }
    }



As you can see, the Greeter is an intelligent digital entity that lives on the blockchain and is able to have conversations with anyone who interacts with it, based on its input. It might not be a talker, but it’s a great listener.

Before you are able to upload it to the network, you need two things: the compiled code, and the Application Binary Interface, which is a sort of user guide on how to interact with the contract.

The first you can get by using a compiler. You should have a solidity compiler built in on your geth console. To test it, use this command:

    eth.getCompilers()

If you have it installed, it should output something like this:

    ['Solidity' ]

If instead the command returns an error, then read the documentation on how to install a compiler, use Aleth zero or use the  online solidity compiler. 

If you have Geth Solidity Compiler installed,  you need now reformat by removing spaces so it fits into a string variable (there are some online tools that will do this):

    var greeterSource = 'contract greeter { address admin; function greeter() { admin = msg.sender; } function greet(bytes32 input) returns (bytes32) { if (input == "") { return "Hello, World"; } return input; } function kill() { if (msg.sender == admin) { suicide(admin); } }}'



Once you successfully executed the above, compile it and publish to the network using the following commands:

    var greeterCompiled = eth.compile.solidity(greeterSource)
    var greeterAddress = eth.sendTransaction({data: greeterCompiled.greeter.code, from: eth.accounts[0], gas:1000000, gasPrice: web3.toWei(0.001, "finney")}); 

You will probably be asked for the password you picked in the beginning. You are choosing from which account will pay for the transaction. Depending on the current gas price, expect that this contract to cost approximately 0.5 ether.

You can take a look to see if your transaction is on the list of pending transactions waiting to be picked up:

    eth.pendingTransactions()

Wait a minute for your transaction to be picked up and then type:

    eth.getCode(greeterAddress)

This should return the code of your contract. If it returns “0x”, it means that your transaction has not been picked up yet. Wait a little bit more. If it still hasn't, check if you are connected to the network

    net.peerCount

If you have more than 0 peers and it takes more than a minute or two for your transaction to be mined, your gas price might have been too low. Go back to that command above and try playing around with the gas price or gas amount. Go too up and you might reach gas limit of the block, go too low and the price might be too low, or the gas insufficient for the transaction to be picked up.

After your code has been accepted, eth.getCode(codeAddress) will return a long string of numbers. If that’s the case, congratulations, your little Greeter is live! If the contract is created again (by performing another eth.sendTransaction), it will be published to a new address. 

Now that your contract is live on the network, anyone can interact with it by instantiating a local copy. But in order to do that, your computer needs to know how to interact with it, which is what the Application Binary Interface (ABI) is for. To generate a contract from ABI you have to do this:

    greeterContract = eth.contract(greeterCompiled.greeter.info.abiDefinition)

**Tip: if the solidity compiler isn't properly installed in your machine, you can get the ABI from the online compiler . To do so, use the code below carefully replacing greeterCompiled.greeter.info.abiDefinition  with the abi from your compiler.**

After having created a local copy of the object, this is how you actually instantiate that object from a live contract address:

    greeterInstance = greeterContract.at(greeterAddress)

Alternatively, those two lines could be written together in a single call:

    greeterInstance = eth.contract(greeterCompiled.greeter.info.abiDefinition).at(greeterAddress)


Your instance is ready. In order to call it, just type the following command in your terminal:

    greeterInstance.greet.call("");

If your greeter returned “Hello World” then congratulations, you just created your first digital conversationalist bot!  Try again with: 

    greeterInstance.greet.call("hi");


### Cleaning up after yourself: 

You must be very excited to have your first contract live, but this excitement wears off sometimes, when the owners go on to write further contracts, leading to the unpleasant sight of abandoned contracts on the blockchain. In the future, blockchain rent might be implemented in order to increase the scalability of the blockchain but for now, be a good citizen and humanely put down your abandoned bots. The suicide is subsidized by the contract creation so it will cost much less than a usual transaction.

    greeterInstance.kill.sendTransaction({from:eth.accounts[0], gasPrice: web3.toWei(0.001, "finney")})

Notice that every contract has to implement it's own kill clause. In this particular case only the account that created the contract can kill it. If you don't add any kill clause it could potentially live forever (or at least until the frontier contracts are all wiped) independently of you and any earthly borders, so before you put it live check what your local laws say about it, including any possible limitation on technology export, restrictions on speech and maybe future legislation on civil rights of sentient digital beings.


**Try it yourself:  You can experiment changing its parameters to make it smarter. Challenge yourself to have it charge ether for its profound advice by adding the following function on the "greet". Here's a simple example on how to make the greeter into a joker by making it sell jokes\*:**


    if (input=="Who's there?") { 
    /* insert a joke here */
    } else if (msg.value > 1000) { 
    /* a trillionth of an ether. It's a cheap joke. */
    return "Knock knock!"; 
    }

Any balance your greeter is able to make will be forwarded to you on the kill call. 

_\* Actually the blockchain is open source and anyone could read your joke for free, but has anyone ever laughed by reading source code?_

*Test it with others: anyone else running the geth console can interact with your contract by first instantiating it using this line of code:*

    greeterInstance = eth.contract([{constant:false,inputs:[],name:'kill',outputs:[],type:'function'},{constant:false,inputs:[{name:'input',type:'bytes32'}],name:'greet',outputs:[{name:'',type:'bytes32'}],type:'function'},{inputs:[],type:'constructor'} ]).at(greeterAddress);


### Easier addresses: the Name Registrar

All accounts are referenced in the network by their public address. But addresses are long, difficult to write down, hard to memorize and immutable. The last one is specially important if you want to be able to generate fresh accounts in your name, or upgrade the code of your contract. In order to solve this, there is a default name registrar contract which is used to associate the long addresses with short, human-friendly names.

Names have to use only alphanumeric characters and, cannot contain blank spaces. In future releases the name registrar will likely implement a bidding process to prevent name squatting but for now, it's a first come first served based. So as long as no one else registered the name, you can claim it.

First, select your name:

    var myName = "bob"

Then, check the availability of your name:

    registrar.addr(myName)

If that function returns "0x00..", you can claim it to yourself:

    registrar.reserve.sendTransaction(myName, {from: eth.accounts[0]});

Wait for the previous transaction to be picked up. Wait up to thirty seconds and then try:

    registrar.owner(myName)

 If it returns your address, it means you own that name and are able to set your chosen name to any address you want:

    registrar.setAddress.sendTransaction(myName, eth.accounts[1], true,{from: eth.accounts[0]});


You can send a transaction to anyone by name instead of account simply by typing 

    eth.sendTransaction({from: eth.accounts[0], to: registrar.addr("bob"), value: web3.toWei(1, "ether")})


**Tip: don't mistake registrar.addr for registrar.owner. The first is to which address that name is pointed at: anyone can point a name to anywhere else, just like anyone can forward a link to google.com, but only the owner of the name can change and update the link. You can set both to be the same address.**


