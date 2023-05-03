from base64 import encode
from Crypto.PublicKey import RSA
from Crypto.Signature import pkcs1_15
from Crypto.Hash import SHA256
import requests
import json
import codecs


from hdwallet import BIP44HDWallet
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

GLOBAL = "http://185.3.94.49:80"
LOCAL = "http://127.0.0.1:5000/"
class Wallet():
    def __init__(self):
        self.pub_key = None
        self.priv_key = None

class Transaction:
    def __init__(self,recipient,signature,nonce,value,data):
        self.recipient = recipient
        self.signature = signature
        self.nonce = nonce
        self.value = value
        self.data = data


# with open("contract1.py, "rb") as f:


def get_message_type_dict(pub_key_exp:str, message:str, signature:str,message_type='document') -> dict:
    ''' Returns the correct dictionary for the message type specified'''
    if message_type == 'document':
        dict_ret = {
                    "payload": {
                    "headers" : {
                        "type" : "document",
                        "pubKey" : pub_key_exp,
                        "message": message,
                        "signature" : signature
                    }, 
                    "payload": {
                        "userId" : 13,
                        "documentId" : 8
                        }
                    }
            }
        return dict_ret
def signTransaction(privateKey:bytes, message:str='no message') -> list:
    ''' 
    Takes in a private key and signs a transaction
    '''
    
    # RSA key - takes in .pem format and converts it to RSA instance
    priv_key = RSA.import_key(extern_key=privateKey)
    
    # Encode message
    message = message.encode(encoding="utf-8")
    
    # Hash message/data with SHA256
    _hash = SHA256.new(data=message)

    # We create a signature with the RSA instance of private_key and hashed message
    signature = pkcs1_15.new(rsa_key=priv_key).sign(msg_hash=_hash)
    
    return _hash, signature, message
   

def signTransaction(priv_key:str,message:str="no message"):
    _private_key = unhexlify(priv_key)
    _key = ecdsa.SigningKey.from_string(_private_key, curve=SECP256k1)
    message = message.encode(encoding="utf-8")
    signature = _key.sign(message)

    return signature


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

def verifySignature(dict) -> None:
    pub_key_exp = dict['payload']['headers']['pubKey']
    message = dict['payload']['headers']['message']
    signature = dict['payload']['headers']['signature']
    try:
        verifySignatureString(pub_key_exp, message, signature)
        print("The signature is valid.")
    except (ValueError, TypeError):
        print("This should really never be invalid")
        print("The signature is not valid.")


# userKeys = getKeys()
def verifySignatureString(pubKey, message, signature) -> None:
    ''' Verifies a signed message with the public key'''
    message = message.encode("ISO-8859-1") 
    signature = signature.encode("ISO-8859-1") 
    pubKey = pubKey.encode("ISO-8859-1") 
    pubKey = RSA.importKey(pubKey)
    pkcsObj = pkcs1_15.new(pubKey)
    _hash = SHA256.new(message)
    
    return pkcsObj.verify(_hash, signature)

def moreTrash() -> None:
    signature = signature.strip('b"')
    signature = signature.strip(' "')
    signature = signature[1:-1]
    signature = codecs.decode(signature, "ISO-8859-1")
    print("The sign ", type(signature), signature)
    # signature = signature.encode("ISO-8859-1") 
    print("The sign ", type(signature), signature)
            

def printTerminal() -> None:
    print("1. Generate a new wallet")
    print("2. Get data from the blockchain")
    print("3. Create message")
    print("2. Insert wallet from mmemonic phrase")
    print("3. Get data from the blockchain")
    print("4. Create message")
    print("5. Sign Transaction")
    print("q to quit")

def printKeys(key) -> None:
    print("Here is your public key ", key.public_key().export_key())
    print("Here is your private key ", key.export_key())
    print("Your keys are also saved in private.pem and public.pem files locally ")
    
def decode_to_send():
    ''' Decode the '''
    pass 



if __name__ == "__main__":
    remoteClientBool = False 
    if remoteClientBool:
        clienturl = GLOBAL
    else:
        print("Running on local ", LOCAL)
        clienturl = LOCAL
    
    guard = True
    #command = input("Do you have a wallet? (y/n)").strip()
    command = 'y'
    wallet = Wallet()
    if command == "y":
        f = open('private.pem','r')
        key = RSA.import_key(f.read())
        
        
        printKeys(key)
    else:
        key = getKeys()
        printKeys(key)
        
    # Saving the public key
    wallet.pub_key = key.public_key().export_key()
    print("pub key")
    print(wallet.pub_key)
    # Saving the private key
    wallet.priv_key = key.export_key()
    print("priv key")
    print(wallet.priv_key)
    while guard:
        printTerminal()
        command = input('command? ').strip()

        # 1. Generate new wallet
        if command == '1':
            key = getKeys()
            printKeys(key)
        
        # 2. Retrieves data from the blockchain
        elif command == '2':
            # Get all the blockchain data
            r = requests.get(url = clienturl + '/blocks' )
            
            if r.status_code == 200:
                blockchain_data = r.json()
                # data = blockchain_data[-3:]
                data = blockchain_data
                print()
                print(data)
                print()
                for transaction in data:
                    print("Last 3 transactions ")
                    print("Round ", transaction['round'] , "payload",  transaction['payload'])
            else:
                print("Could not retreive blockchain data")

        # Creates a message - Sign Transaction/Message
        elif command == '3':
            # Message should be written in
            message = 'no_message'
            
            theHash, signature, message = signTransaction(wallet.priv_key, message)

            '''
            Decode information to respective format
            
            ISO-8859-1
            single byte encoding that can represent the first 256 unicode characters,
            while UTF-8 is a multibyte encoding that can also represent Unicode character.
            '''

            message = message.decode("ISO-8859-1") 
            signature = signature.decode("ISO-8859-1") 
            pub_key_exp = wallet.pub_key.decode("ISO-8859-1")

            # Here you get the dictionary that fits the expected type
            dict = get_message_type_dict(pub_key_exp, message, signature, 'document')
            verifySignature(dict)
            r = requests.post(url = clienturl + '/blocks' , json = dict)
            # r = requests.post(BASE + "blocks", json.dumps(dict))
            print("THe r ", r.status_code)
            if r.status_code == 200:
                print("It worked")
                r.json() # to get the data from the endpoint
                print("The resp ", r.json())


        elif command == '5':

            recipient="frikki"

            signature = signTransaction(priv_key=private_key, message=recipient)

            key = ecdsa.VerifyingKey.from_string(unhexlify(public_key), curve=SECP256k1)

            isVerified = key.verify(signature=signature,data=recipient.encode(encoding="utf-8"))

            print(signature)
            print(isVerified)

        
        
        elif command == 'q' or command == 'quit':
            exit()
        else:
            print('Invalid Command.')
        print()
            
