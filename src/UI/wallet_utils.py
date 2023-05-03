from Crypto.PublicKey import RSA
from Crypto.Hash import SHA256
import requests
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

# Smart contract import dependencies
import json
import base64


DOCUMENT_TYPE ="document"
TRANSACTION_TYPE = "transaction"
FAUCET_TYPE = "faucet"
SMART_CONTRACT_TYPE = "smart_contract"

GLOBAL = "http://185.3.94.49:80/"
LOCAL = "http://127.0.0.1:5000/"
CLIENTURL = LOCAL


'''
KEY RELATED
'''

def get_wallet(mmemonic_phrase=False):
    ''' Generates a wallet or finds the wallet associated with a given mmemonic_phrase'''
    if not mmemonic_phrase:
        # Generate english mnemonic words
        mmemonic_phrase = generate_mnemonic(language="english", strength=128)
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


def get_skyllian_public_key(CLIENTURL = LOCAL):
    r = requests.get(url=CLIENTURL + '/public_key')
    if r.status_code == 200:
        skyllian_public_key = r.json()['public_key']
    return skyllian_public_key






'''
TRANSACITONS
'''

class Transaction:
    def __init__(self,data):
        self.data = data
    def hash(self):
        # Retrieve the dict values the v's in (k, v)
        values = self.data
        values_str = "".join(values).encode(encoding="utf-8")

        _hash_byte:bytes = SHA256.new(data=values_str).digest()
        
        self._hash = _hash_byte

def get_nonce(public_key:str):
    r = requests.get(url = CLIENTURL + f'nonce/{public_key}')
    print(r.json())
    data = r.json()['nonce']
    return data


def _sign_transaction(priv_key:str,transaction_hash:str="transaction") -> bytes:
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


def sign_transaction_action(transaction_type:str, public_key : str, private_key : str, amount:int = None, contract_name:str = None, code:str=None):
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
    
    if transaction_type == SMART_CONTRACT_TYPE:
        data['contract_name'] = contract_name
        data['code'] = code



    nonce = get_nonce(public_key=public_key)

    # For both document and transaction
    data['type'] = transaction_type
    data['sender'] = public_key
    data['nonce'] = nonce
    # signature
    # _hash
    data['receiver'] = scyllian_public_key
    data['amount'] = amount

    # Instantiate transaction instance
    t = Transaction(data=data)
    # Calculate hash
    t.hash()

    # Sign transaction with private key and transaction as the data
    signature:bytes = _sign_transaction(priv_key=private_key, transaction_hash=t._hash)
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







'''
BALANCE
'''

def get_balance(public_key):
    r = requests.get(url = CLIENTURL + f"/balance/{public_key}")
    if r.status_code == 200:
        print("Resp code ", r.status_code)
        print(f"Balance: {r.json()['balance']}")
        print(f"Your balance is:  {r.json()['balance']} ") 

        return r.json()['balance']

def get_faucet(public_key, private_key):
    d = sign_transaction_action(transaction_type=FAUCET_TYPE, public_key = public_key, private_key = private_key)

    r = requests.post(url = CLIENTURL + f'/faucet/{public_key}' , json=d)
    if r.status_code == 200:
        print("Great success 4.")
    else:
        print("Did not work ")


def get_transaction_history(public_key):
    r = requests.get(url = CLIENTURL + f"/transaction/history/{public_key}")

    trans_hist = r.json()['transactions']
    return trans_hist


def sign_transaction(public_key, private_key, amount):
    # Create transaction instance
    transaction_dict = sign_transaction_action(transaction_type=TRANSACTION_TYPE, public_key = public_key, private_key = private_key, amount=amount)
    
    # Post transaction instance to annallClientAPI
    print("The transaction dict ", transaction_dict)
    r = requests.post(url = CLIENTURL + '/sign-transaction', json=transaction_dict)
    if r.status_code == 200:
        print("Great success 3. ")
    else:
        # Print error message
        print(f"Statuscode: {r.status_code} with message - {r.json()['message']}")

def sign_smart_contract(public_key:str, private_key:str, contract_name:str, code:str):
    # Create transaction instance
    transaction_dict = sign_transaction_action(transaction_type=SMART_CONTRACT_TYPE, public_key = public_key, private_key = private_key, amount=None, contract_name=contract_name, code=code)
    
    # Post transaction instance to annallClientAPI
    print("The transaction dict ", transaction_dict)
    r = requests.post(url = CLIENTURL + '/smart_contract', json=transaction_dict)
    if r.status_code == 200:
        print("Great success 3. ")
    else:
        # Print error message
        print(f"Statuscode: {r.status_code} with message - {r.json()['message']}")




def read_contract_from_file(filename):
    with open(filename, "rb") as f:
        data =  f.read()
        print(data)
        print(type(data))
        
    code_json = {
        'code' : data
    }

    return code_json

def b64_encode_contract(code):
    code_encoded = base64.b64encode(s=code).decode()
    
    return code_encoded

def b64_decode_contract(code):
    code_decoded = base64.b64decode(s=code)

    return code_decoded





# with open("data.json", "w") as f:
#     _d = {"code": base64.b64encode(s=data).decode()}
#     print(_d)
#     f.write(json.dumps(_d))

# with open("data.json", "r") as f:
#     data = json.loads(f.read())
#     print()
#     print()
#     print()
#     code = data['code'].encode()

#     code = base64.b64decode(s=code)
# print("Type ", type(data['code']))
# print("DATA TO WRITE INTO ", data['code'])
# with open("test.py", "wb") as f:
#     f.write(code)
# print("Length " , len(code))
# print("Length " , code)
# from test import printme


# printme()

