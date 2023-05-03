
About Skyllian:
Blockchain was initially designed to facilitate a basic peer-to-peer payment system.
As the flora of blockchain applications proliferates, an inherent growth in complex-
ity exists, posing significant challenges for developers seeking to design and deploy
blockchain-based applications. There is an increasing need for architectural refactor-
ing that enables a new layer to engage the underlying elementary blockchain capabili-
ties and support the development of applications and services. This paper introduces
Skyllian, a Layer II solution that provides unprecedented flexibility for developing
blockchain applications and tokens. Using a publish-subscribe architecture pattern,
developers can create customized applications and tokens that meet their specific needs
without being constrained by predetermined requirements. With Skyllian, we aim to
unlock the full potential of blockchain technology and empower developers to build
decentralized solutions that cater to their unique requirements


Link to the paper: <link> 

Using the framework of Skyllian we have set-up a  

Skyllian is a Python Flask gateway API intermediary between a client and the Annáll blockchain. On start, the API sets up two way communication to a writer on the Annáll blockchain using a TCP socket.

Before running virtual environment is necessary:

To run the API:
    1. virtualenv api_venv
    2. source ./api_venv/bin/activate
    3. pip install -r requirements.txt


Applications currently implemented using Skyllian's framework:

Wallet service:
The wallet service created by the Skyllian framework is a software wallet based on the BIP 39 standard that uses a mnemonic phrase and a PBKDF2 function to store the seed. It allows for importing or generating a new wallet, fetching public keys, displaying balances, creating transactions, and getting transaction history. Transactions use a nonce to prevent replay attacks and maintain order, and the sender's signature and hash guarantee the authenticity and uniqueness of the transaction. The wallet signs the transaction, which is then securely transmitted to Skyllian for verification and broadcasting to the underlying blockchain.

How to run: 
    With activated venv type in the command python3 src/wallet/walletservice.py 

Payment system:

The payment system application built on Skyllian allows for the sending and receiving of tokens on a blockchain network. Each transaction contains information such as the sender's public key, receiver's public key, token type, and amount. Transactions are verified by Skyllian nodes and added to the blockchain if the correct conditions are met. In case of conflicting transactions, the node that processed the later transaction sends a cancellation transaction to the blockchain. Each Skyllian node maintains a locally cached record of transaction balances to quickly access wallet balances, but it ensures that the blockchain is the single source of truth.


How to run: 
    With activated venv type in the command python3 src/application/skyllian_application.py 


The payment system application built on Skyllian allows for the sending and receiving of tokens on a blockchain network. Each transaction contains information such as the sender's public key, receiver's public key, token type, and amount. Transactions are verified by Skyllian nodes and added to the blockchain if the correct conditions are met. In case of conflicting transactions, the node that processed the later transaction sends a cancellation transaction to the blockchain. Each Skyllian node maintains a locally cached record of transaction balances to quickly access wallet balances, but it ensures that the blockchain is the single source of truth.



CBDC System: 

This system is built on the Skyllian framework and allows for the exchange of funds in different currencies on a blockchain. The system utilizes the OAuth protocol for authentication, granting limited access to resources for third-party applications without revealing passwords. The system integrates the government-sanctioned Audkenni service for secure and efficient logins, utilizing the user's phone number and a password prompt sent to their mobile device. The CBDC system also incorporates CBDC blocks and transaction blocks, allowing for flexibility and transparency.


This is written in C# using ASP.NET 7, we recommend running it using Visual Studio (VS):

Navigate to cbdc_service folder and open cbdc_service/using Visual Studio will find dependencies automatically and download them then run it using built in tools.

If you want to run it using terminal just remember to install all dependencies before entering the command dotnet run.




The API of Annall is rudementary and as such gets incoming requests of type:
a. GET /blocks
b. POST /block {"payload": payload}
For a POST /block, the API expects a key "payload" and payload in a JSON object.

To run the API:
    1. virtualenv api_venv
    2. source ./api_venv/bin/activate
    3. pip install -r requirements.txt
    4. python annallClientAPI.py <local writer port>

    For auto flask run this command: FLASK_APP=skyllian.py FLASK_ENV=development flask run

NOTE: A writer has to be running for the API to service requests.

The API tries ten times over ten seconds to connect to the TCP socket of the writer on the selected port. If it fails ten times, the API remains running but none of the requests are handled.

The API can run using gunicorn. Gunicorn is a WSGI server that can run in a production environment and supports multiple workers.

- gunicorn -w <no. of workers> -b <ip_address:port> annallClientAPI:app
- gunicorn annallClientAPI:app

  The API has a class for the writer connection and a class for exception handling.
