
# Skyllian flexible layer II

Blockchain was initially designed to facilitate a basic peer-to-peer payment system. As the flora of blockchain applications proliferates, an inherent growth in complexity exists, posing significant challenges for developers seeking to design and deploy blockchain-based applications. There is an increasing need for architectural refactoring that enables a new layer to engage the underlying elementary blockchain capabilities and support the development of applications and services. This paper introduces Skyllian, a Layer II solution that provides unprecedented flexibility for developing blockchain applications and tokens. Using a publish-subscribe architecture pattern, developers can create customized applications and tokens that meet their specific needs without being constrained by predetermined requirements. With Skyllian, we aim to unlock the full potential of blockchain technology and empower developers to build decentralized solutions that cater to their unique requirements.

Link to the paper: <link>


##  Requirements before running


Using the framework of Skyllian we have set up a gateway API intermediary between a client and the Annáll blockchain. On start, the API sets up two-way communication to a writer on the Annáll blockchain using a TCP socket.


To run the API:
Create a virtual environment by typing the command virtualenv api_venv
Activate the virtual environment by typing source ./api_venv/bin/activate
Install the required packages by typing pip install -r requirements.txt



```bash
    1. virtualenv api_venv
    2. source ./api_venv/bin/activate
    3. pip install -r requirements.txt
```

# Applications currently implemented using Skyllian's framework:
## Wallet service
The wallet service created by the Skyllian framework is a software wallet based on the BIP 39 standard that uses a mnemonic phrase and a PBKDF2 function to store the seed. It allows for importing or generating a new wallet, fetching public keys, displaying balances, creating transactions, and getting transaction history. Transactions use a nonce to prevent replay attacks and maintain order, and the sender's signature and hash guarantee the authenticity and uniqueness of the transaction. The wallet signs the transaction, which is then securely transmitted to Skyllian for verification and broadcasting to the underlying blockchain.

With the virtual environment activated:
```bash
 python3 src/wallet/walletservice.py
```


## Payment system
The payment system application built on Skyllian allows for the sending and receiving of tokens on a blockchain network. Each transaction contains information such as the sender's public key, receiver's public key, token type, and amount. Transactions are verified by Skyllian nodes and added to the blockchain if the correct conditions are met. In case of conflicting transactions, the node that processed the later transaction sends a cancellation transaction to the blockchain. Each Skyllian node maintains a locally cached record of transaction balances to quickly access wallet balances, but it ensures that the blockchain is the single source of truth.

With the virtual environment activated:
```bash
 python3 src/wallet/walletservice.py
```

## CBDC System
This system is built on the Skyllian framework and allows for the exchange of funds in different currencies on a blockchain. The system utilizes the OAuth protocol for authentication, granting limited access to resources for third-party applications without revealing passwords. The system integrates the government-sanctioned Audkenni service for secure and efficient logins, utilizing the user's phone number and a password prompt sent to their mobile device. The CBDC system also incorporates CBDC blocks and transaction blocks, allowing for flexibility and transparency.

How to run:
This is written in C# using ASP.NET 7. We recommend running it using Visual Studio (VS). Navigate to the cbdc_service folder and open cbdc_service/. Using Visual Studio will find dependencies automatically and download them.

## Safe Game
We found Skyllian's approach to the blockchain to be a perfect way to implement the use of NFTs as contractual tokens in the life insurance process, providing a novel approach to insurance agreements and risk management. To demonstrate the potential of this concept along with the platform, we have developed the game Safe Game. Safe Game is designed to simulate the life insurance process through an engaging and interactive gaming experience. Players assume the role of one of two characters, Joel or Anna, and navigate through five distinct life stages. At each stage, players must choose between two decisions, each presenting unique risks and potential rewards. These decisions directly impact the character's health and financial resources, simulating the real-life consequences of insurance-related choices.


### Running backend
First we have to navigate to save_game-main

then we activate venv and install requirements:

```bash
    1. virtualenv venv
    2. source ./venv/bin/activate
    3. pip install -r requirements.txt
```

Then we simply run ./dev which launches the backend, it runs the following command automatically: pipenv run python ./backend/manage.py runserver


```bash
    1. virtualenv venv
    2. source ./venv/bin/activate
    3. pip install -r requirements.txt
```

### Running frontend

```bash
    1. npm install (have node.js installed locally/globally on your machine)
    2. npm run dev (runs frontend application)


```


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

#### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

#### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


## Insurance
