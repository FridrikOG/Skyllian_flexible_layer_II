from ast import Pass
from base64 import encode
from sqlite3 import register_converter
from xml.dom.expatbuilder import DOCUMENT_NODE
from Crypto.PublicKey import RSA
from Crypto.Signature import pkcs1_15
from Crypto.Hash import SHA256
import requests
import json
import codecs
from hdwallet import BIP44HDWrallet
from hdwallet.cryptocurrencies import EthereumMainnet
from hdwallet.derivations import BIP44Derivation
from hdwallet.utils import generate_mnemonic
from typing import Optional

import ecdsa
from ecdsa.curves import SECP256k1
from ecdsa.keys import (
    SigningKey, VerifyingKey
)
from binascii import (
    hexlify, unhexlify
)

'''

RSA KEYS: 
https://pycryptodome.readthedocs.io/en/latest/src/public_key/rsa.html

'''

DOCUMENT_TYPE ="document"
TRANSACTION_TYPE = "transaction"
FAUCET_TYPE = "faucet"

GLOBAL = "http://185.3.94.49:80/"
LOCAL = "http://127.0.0.1:5000/"
CLIENTURL = LOCAL
class Wallet():
    def __init__(self):
        self.public_key = None
        self.priv_key = None


class Transaction:
    def __init__(self,data):
        self.data = data
    def hash(self):
        # Retrieve the dict values the v's in (k, v)
        values = self.data
        values_str = "".join(values).encode(encoding="utf-8")

        _hash_byte:bytes = SHA256.new(data=values_str).digest()
        
        self._hash = _hash_byte

def get_skyllian_public_key(CLIENTURL = LOCAL):
    r = requests.get(url=CLIENTURL + '/public_key')
    if r.status_code == 200:
        skyllian_public_key = r.json()['public_key']
    return skyllian_public_key


def get_message_type_dict(nonce:str, signature:str,_hash=None,transaction_type=DOCUMENT_TYPE, public_key='') -> dict:
    ''' Returns the correct dictionary for the message type specified'''
    dict_ret = {
            "payload": {
            "headers" : {
                "type" : None,
                "public_key" : None,
                "nonce": nonce,
                "signature" : signature,
                "_hash": _hash
            }, 
            "payload": {
                }
            }
    }

    # get scyllians public key
    skyllian_public_key = get_skyllian_public_key()
    if transaction_type == DOCUMENT_TYPE:
        # This sessions public_key
        sender = public_key
        receiver = skyllian_public_key
        # Set attributes 
        dict_ret['payload']['headers']['type'] = DOCUMENT_TYPE
        dict_ret['payload']['headers']['public_key'] = sender
        dict_ret['payload']['headers']['nonce'] = nonce
        dict_ret['payload']['headers']['signature'] = signature
        dict_ret['payload']['headers']['_hash'] = _hash
        
        dict_ret['payload']['payload']['receiver'] = receiver
        dict_ret['payload']['payload']['amount'] = 5


    elif transaction_type == TRANSACTION_TYPE:
        
        # This sessions public_key
        sender = public_key
        receiver = skyllian_public_key
        # Set attributes 
        dict_ret['payload']['headers']['type'] = TRANSACTION_TYPE
        dict_ret['payload']['headers']['public_key'] = sender
        dict_ret['payload']['headers']['nonce'] = nonce
        dict_ret['payload']['headers']['signature'] = signature
        dict_ret['payload']['headers']['_hash'] = _hash

        dict_ret['payload']['payload']['receiver'] = receiver
        dict_ret['payload']['payload']['amount'] = 5

    elif transaction_type == FAUCET_TYPE:
        sender = skyllian_public_key
        # This sessions public_key
        receiver = public_key
        # Set attributes 
        dict_ret['payload']['headers']['type'] = FAUCET_TYPE
        dict_ret['payload']['headers']['public_key'] = sender
        dict_ret['payload']['headers']['nonce'] = None
        dict_ret['payload']['headers']['signature'] = None
        dict_ret['payload']['headers']['_hash'] = None
        dict_ret['payload']['payload']['receiver'] = receiver
        dict_ret['payload']['payload']['amount'] = None
    return dict_ret



def sign_transaction(priv_key:str,transaction_hash:str="transaction") -> bytes:
    '''
    Signs a transaction with the private key and the transaction
    Some conversions of types are required - unhexlif() and encode() are used.
    '''

    # unhexlify private_Key to bytes representation
    _private_key:bytes = unhexlify(priv_key)

    # Create SigningKey instance from ecdsa library assigning the private key to it.
    _key:SigningKey = ecdsa.SigningKey.from_string(_private_key, curve=SECP256k1)

    # Sign transaction
    signature:bytes = _key.sign(transaction_hash)

    return signature

def verify_transaction(public_key:str, signature,_hash):
    # Retrieve the VerifyingKey instance from the public key using the respective curve
    key:VerifyingKey = ecdsa.VerifyingKey.from_string(unhexlify(public_key), curve=SECP256k1)
    # Verify the signature against the data provided in the signing of the transaction
    isVerified:bool = key.verify(signature=signature,data=_hash)
    print("\nsignature")
    print(isVerified)
        
    return isVerified

def get_nonce(public_key:str):
    r = requests.get(url = CLIENTURL + f'nonce/{public_key}')
    print(r.json())
    data = r.json()['nonce']
    return data

def sign_transaction_action(transaction_type:str, public_key : str, private_key : str):
    '''
    v2 - 
        convert transaction dictionary to string and hashed
        transaction t, t_hash is signed with privkey and signature assigned to t object.
        Verified with publickey, signature, t_hash
    '''
    scyllian_public_key = get_skyllian_public_key()

    data = {
        'type': None,
        "sender": None,
        'nonce': None,
        'signature': None,
        "_hash": None,
        "receiver": None,
        "amount": None,
    }
    if transaction_type == FAUCET_TYPE:
        ''' 
        Here it makes no sense for this sessions public_key to sign the transaction, 
        we therefore send a request to annall/scyllian who will have to sign and approve the transaction 
        '''

        # Message 'hash' of the transaction - recipient at this point
        # transaction_dict = get_message_type_dict(nonce=None,signature=None,_hash=None,transaction_type=FAUCET_TYPE, public_key = public_key)

        sender = get_skyllian_public_key()
        receiver = public_key

        print("receiver")
        print(receiver)

        data['type'] = FAUCET_TYPE
        data['sender'] = sender


        data['receiver'] = receiver


        return data



    nonce = get_nonce(public_key=public_key)

    # For both document and transaction
    data['type'] = transaction_type
    data['sender'] = public_key
    data['nonce'] = nonce
    # signature
    # _hash
    data['receiver'] = scyllian_public_key
    data['amount'] = 5

    # Instantiate transaction instance
    t = Transaction(data=data)
    # Calculate hash
    t.hash()

    # Sign transaction with private key and transaction as the data
    signature:bytes = sign_transaction(priv_key=private_key, transaction_hash=t._hash)
    # verify transaction
    isVerified:bool = verify_transaction(public_key=public_key, signature=signature, _hash=t._hash)
    # Assign attributes
    t.signature:str = str(hexlify(signature), encoding="utf-8")
    t._hash:str = str(hexlify(t._hash), encoding="utf-8")

    data['signature'] = t.signature
    data['_hash'] = t._hash


    # Message 'hash' of the transaction - recipient at this point
    # transaction_dict = get_message_type_dict(nonce=nonce,signature=t.signature,_hash=t._hash,transaction_type=transaction_type, public_key=public_key)
    
    return data


def getKeys() -> RSA.RsaKey:
    ''' 
    Returns a dictionary of a public and private key
    '''
    keyDict = {}
    # 2048 bits deemed sufficient length.
    key = RSA.generate(bits=2048)
    # Export key to PEM format
    privateKey = key.export_key(format="PEM")
    file_out = open("private.pem", "wb")
    file_out.write(privateKey)
    file_out.close()
    keyDict['privateKey'] = privateKey
    # Export key to PEM format
    publicKey = key.publickey().export_key(format="PEM")
    file_out = open("public.pem", "wb")
    file_out.write(publicKey)
    file_out.close()
    keyDict['publicKey'] = publicKey
    return key 

def printTerminal() -> None:
    print("1. Get data from the blockchain")
    print("2. Sign Transaction")
    print("3. Get Faucet")
    print("4. Get personal transaction history")
    print("me. Wallet information for this session")
    print("q to quit")

def printKeys(key) -> None:
    print("Here is your public key ", key.public_key().export_key())
    print("Here is your private key ", key.export_key())
    print("Your keys are also saved in private.pem and public.pem files locally ")


def get_wallet(mmemonic_phrase=False):
    ''' Generates a wallet or finds the wallet associated with a given mmemonic_phrase'''
    if not mmemonic_phrase:
        # Generate english mnemonic words
        mmemonic_phrase: str = generate_mnemonic(language="english", strength=128)
        print(f"Your mmemonic words are ---- {mmemonic_phrase} ---- keep them in a safe place!")
        # Secret passphrase/password for mnemonic
    PASSPHRASE: Optional[str] = None  # "meherett"
    # Initialize Ethereum mainnet BIP44HDWallet
    bip44_hdwallet: BIP44HDWallet = BIP44HDWallet(cryptocurrency=EthereumMainnet)
    # Get Ethereum BIP44HDWallet from mnemonic
    bip44_hdwallet.from_mnemonic(
        mnemonic=mmemonic_phrase, language="english", passphrase=PASSPHRASE)
    # Clean default BIP44 derivation indexes/paths
    bip44_hdwallet.clean_derivation()
    for address_index in range(10):
        # Derivation from Ethereum BIP44 derivation path
        bip44_derivation: BIP44Derivation = BIP44Derivation(
            cryptocurrency=EthereumMainnet, account=0, change=False, address=address_index
        )
        # Drive Ethereum BIP44HDWallet
        bip44_hdwallet.from_path(path=bip44_derivation)
        # Print address_index, path, address and private_key
        print(f"({address_index}) {bip44_hdwallet.path()} {bip44_hdwallet.address()} 0x{bip44_hdwallet.private_key()}")
        # Clean derivation indexes/paths
        bip44_hdwallet.clean_derivation()
    return bip44_hdwallet

def print_transaction_history(history, public_key):
    history = history['transactions'] 
    for trans in history:
        payload = trans['payload']['payload']
        headers = trans['payload']['headers']
        if trans['payload']['payload']['receiver'] == public_key: 
            print(f"Received coins: {payload['amount'] } From: {headers['public_key']} Amount: {payload['amount']}")
        else: 
            print(f"Sent coins: {payload['amount'] } To: {payload['receiver']} Amount: {payload['amount']}")

def printWelcome():
    print("Welcome to your wallet!")
    print("Press 1 to generate a new wallet")
    print("Press 2 to import a wallet using mmemonic phrase")

if __name__ == "__main__":
    remoteClientBool = False 
    if remoteClientBool:
        CLIENTURL = GLOBAL
    else:
        print("Running on local ", LOCAL)
        CLIENTURL = LOCAL
    printWelcome()
    command = input('command? ').strip()
    # command = '2'
    if command == '1':
        key = getKeys()
        wallet = get_wallet()
        private_key = wallet.private_key()
        public_key = wallet.public_key()
        print(f"Private key: {private_key}  Public key:  {public_key}") 

    if command == '2':
        mmemonic = 'old maid abuse shoe story armor absorb deny rally legal shallow meat'
        mmemonic2 = 'hero flight mimic ritual rotate gain foam fashion sand sadness large deer'
        wallet = get_wallet(mmemonic2)
        private_key = wallet.private_key()
        public_key = wallet.public_key()
        print("Private key ", private_key, "public key ", public_key)
        print("The mmemonic phrase ", wallet)
        
        
    guard = True
    while guard:
        r = requests.get(url = CLIENTURL + f"/balance/{public_key}")
        if r.status_code == 200:
            print("Resp code ", r.status_code)
            print(f"Balance: {r.json()['balance']}")
            print(f"Your balance is:  {r.json()['balance']} ") 
        printTerminal()
        command = input('command? ').strip()
        # 1. Generate new wallet
        # 2. Retrieves data from the blockchain
        if command == '1':
            # Get all the blockchain data
            r = requests.get(url=CLIENTURL + '/blocks')
            print("The status code ", r.status_code)
            if r.status_code == 200:
                data = r.json()
                # data = json.loads(data)
                for trans in data:
                    print(f"Each transaction {json.loads(trans)}")
            else:
                print("Could not retreive blockchain data")
        # CREATE TRANSACTION
        elif command == '2':
            # Create transaction instance
            transaction_dict = sign_transaction_action(transaction_type=TRANSACTION_TYPE, public_key = public_key, private_key = private_key)
            # Post transaction instance to annallClientAPI
            print("The transaction dict ", transaction_dict)
            r = requests.post(url = CLIENTURL + '/sign-transaction', json=transaction_dict)
            if r.status_code == 200:
                print("Great success 3. ")
            else:
                # Print error message
                print(f"Statuscode: {r.status_code} with message - {r.json()['message']}")
        #FAUCET 
        elif command == '3':
            d = sign_transaction_action(transaction_type=FAUCET_TYPE, public_key = public_key, private_key = private_key)

            print(d)

            r = requests.post(url = CLIENTURL + f'/faucet/{public_key}' , json=d)
            if r.status_code == 200:
                print("Great success 4.")
            else:
                print("Did not work ")

        
        # Personal transaction history
        elif command == "4":
            r = requests.get(url = CLIENTURL + f"/transaction/history/{public_key}")
            print("\n---------------- Personal Transaction History ----------------")
            print_transaction_history(r.json(), public_key)
            # pprint.pprint(r.json())
        
        elif command == "me":
            print("\nPrivate key:", private_key)
            print("Public key:", public_key)
            print("The mmemonic phrase ", wallet)

        elif command == 'q' or command == 'quit':
            exit()
        else:
            print('Invalid Command.')
        print()
            
