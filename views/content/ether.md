
## What is Ether?

Ether is a necessary element -- a fuel -- for operating the distributed application platform Ethereum. It is a form of payment made by the clients of the platform to the machines executing the requested operations. To put it another way, ether is the incentive ensuring that developers write quality applications (wasteful code costs more), and that the network remains healthy (people are compensated for their contributed resources).

Feeling comfortable? Time to get some ether!


## Get Ether

### 1. Mining ether yourself

Mining is the name of the 

Since you are one of the pioneers, it might be possible to acquire ether by _mining_: contributing your computing and storage resources to the platform in exchange for transaction costs and rewards. You will be competing with other miners in the network to find blocks that fit on top of the existing chain - the state of the platform - claiming the associated prize. You can start your mining operation by opening a Geth console and typing:


Before you can find any blocks however, your computer needs to go through a process called “building a DAG”. This DAG (short for “Directed Acyclic Graph”) is a large data structure (~1GB) required for mining, intended to prevent ASIC machines (“Application Specific Integrated Circuits”) from being mass manufactured for mining ether. Its goal is to protect miners like yourself, so that you will only ever need your home computer to remain competitive. The DAG should take about 10 minutes to generate and as soon as it finishes, Geth will start mining automatically. If at any point you want to see what is going on, you can type:

    miner.hashrate
 
This gives you a rough idea of how much work your computer is doing per second. Now head to the [Network Stats](https://stats.ethdev.com/) page and take a look at the _Difficulty_ value (top right). Dividing that number by your current hashrate will give you an estimate - in seconds - of how long it will take until you successfully mine a block and get some ether. This is an overestimate because it does not take in consideration uncle blocks, but it's a good starting point. You can use this code snippet to do this automatically:
 
    Math.floor(10 * eth.getBlock("latest").difficulty / miner.hashrate / 60) / 10 + " Minutes"

If you have successfully mined a block you will see a message like this among the logs:
  
    🔨 Mined block #12345
 
Your _coinbase_ (sometimes referred to as _etherbase_) is the Ethereum account where your mining rewards are sent. By default it is your primary account. To check your earnings, you can display your balance with:
 
    web3.fromWei(eth.getBalance(eth.coinbase), "ether")

*Note: The mining rewards in the Frontier network are only 10% of what they’ll be when the Homestead phase begins. Frontier should be always considered a test network for the Ethereum platform.*

If you are serious about mining, consider reading up on the current [proof of work](http://ethereum.gitbooks.io/frontier-guide/content/mining.html) and why it is ASIC resistant, about proof of stake, [mining with a CPU](http://ethereum.gitbooks.io/frontier-guide/content/mining_with_geth.html), or starting your [GPU operation](http://ethereum.gitbooks.io/frontier-guide/content/gpu.html). You will find plenty of help on the [official forums](http://forum.ethereum.org/) too.


### 2. Get ether from a friend

That is by far the easiest way to get ether, but you need to know someone who is willing to give you a hand. If you do have such a friend, then you can send them one of your addresses the the hopes of getting some sweet sweet ether:

    eth.accounts[0] 

Ether sent to your account should show up almost immediately, transactions being integrated into the system every 12 seconds. Make sure you are in sync with the network, otherwise your local Geth will not know about the transfer.


### 3. Importing from the presale wallet

Before you decide to import your presale ether wallet, please remember that Frontier is a public, live test network. **It is dangerous, potentially full of bugs and is prone to instability.** While all account balances above 1 ether will be moved over to Homestead when it launches, the ether in contracts will not. There are many potential mishaps, ether can be lost, stolen or locked into a broken contract. We strongly advise you to only move funds that you are willing to risk. If you understand the risks and still want to go forward, then importing your presale wallet is very easy:

    geth wallet import /path/to/my/presale.wallet 

This will prompt for your password and imports your ether presale account. It can be used non-interactively with the _--password_ option taking a password file as argument containing the wallet password in cleartext.


## Sending your first transaction

There are two types of accounts in Ethereum: *normal accounts*, holding ether that can only be moved with a private key and *contracts*, which hold ether only controlled by their own internal code. In this section we focus on the former and dedicate an entire page for the latter.

Similarly, your transactions are also of two types: those sent to normal accounts are *ether transfers*, while the rest are *communication* with smart contracts.

Before you execute your first ether transfer you need a friend to send your ether to. If you don’t have any, you can also create as many new accounts as you want, following the steps discussed previously and simply move your funds between accounts you own. Assuming you created a second account to send the ether to:
     
    var sender    = eth.accounts[0];
    var recipient = eth.accounts[1];

    var amount = web3.toWei(0.01, "ether");

The first two lines set local variables with account numbers for easier access later. Change the sender and recipient addresses as much as you like. If you are adding a friend's account address instead, put it in between quotes like ‘0xffd25e388bf07765e6d7a00d6ae83fa750460c7e'. The third line converts the chosen amount to the network's base unit.

Although there are many names for ether denominations, we will use only two: “ether” and “wei”. Wei is the atomic unit of ether, and is the one used on the system level. Most day to day transactions will be done with ether, which is equivalent to one quintillion wei, or a 1 followed by 18 zeros. So before sending any transactions, it’s very important to convert it to wei, and for that, use the _web3.toWei_ function. (If you are dealing with very small amounts of ether, it might be useful to use “finney”, which is a shorthand for a thousandth of an ether, but usually ether will suffice).

After having set the variables above, send the transaction with:

    eth.sendTransaction({from: sender, to: recipient, value: amount})

Waiting a few seconds, the transaction should be complete. To check the balance of an account, simply type:

    eth.getBalance(eth.accounts[0])


### Check All Balances at once

If you want to check the balance of all your accounts at once, use this JavaScript code snippet. It will iterate over each of your accounts and print their balance in ether:
 
    function checkAllBalances() { 
      var i = 0; 
      eth.accounts.forEach(function(id) {
        console.log("eth.accounts["+i+"]: " + id + "\tbalance: " + web3.fromWei(eth.getBalance(id), "ether") + " ether"); 
        i++;
      })
    }; 

Once you executed the line above, all you need to check your whole balance is:

    checkAllBalances() 

*Try it yourself: tweak this JavaScript function to make it show another unit, like “finney”.*

### Transaction Receipts

Anytime you create a transaction in Ethereum, the string that is returned is the **Transaction Hash**. You can use those to keep track of a transaction in progress, or the amount of gas spent in a past transaction using _eth.getTransaction()_ and _eth.getTransactionReceipt_. Here's how to use it:

    var tx =  eth.sendTransaction({from: eth.accounts[1], to: eth.accounts[0], value: amount});
    eth.getTransaction(tx);

And if the transaction has been picked up already, you can check it's receipt with this:

    eth.getTransactionReceipt(tx);


## Easier addresses: the Name Registrar

All accounts are referenced in the network by their public address. But addresses are long, difficult to write down, hard to memorize and immutable. The last one is especially important if you want to generate fresh accounts in your name or upgrade the code of your contract. In order to solve this, there is a default name registrar contract which is used to associate the long addresses with short, human-friendly names.

Names have to use only alphanumeric characters and cannot contain blank spaces. In future releases the name registrar will likely implement a bidding process to prevent name squatting, but for now it's a first come first served. As long as no one else registered the name, you can claim it.

First, select your name:
 
    var myName = "bob"

Then, check the availability of your name:
 
    registrar.addr(myName)

If that function returns "0x00..", you can claim it to yourself:
 
    registrar.reserve.sendTransaction(myName, {from: eth.accounts[0]})

Wait up to thirty seconds for the previous transaction to be picked up, then try:
 
    registrar.owner(myName)

If it returns your address, it means you own that name can set it to any address you want:
 
    registrar.setAddress.sendTransaction(myName, eth.accounts[1], true,{from: eth.accounts[0]})

You can send a transaction to anyone by name instead of account simply by typing 
 
    eth.sendTransaction({from: eth.accounts[0], to: registrar.addr("bob"), value: web3.toWei(1, "ether")})

*Note: Don't mistake registrar.addr for registrar.owner. The first is to which address that name is pointed at: anyone can point a name to anywhere else, just like anyone can forward a link to google.com, but only the owner of the name can change and update the link. You can set both to be the same address.*