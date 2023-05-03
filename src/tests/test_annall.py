import os
import tempfile
import pytest
import requests
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
from hdwallet import BIP44HDWallet
from hdwallet.cryptocurrencies import EthereumMainnet
from hdwallet.derivations import BIP44Derivation
from hdwallet.utils import generate_mnemonic
import pprint

# from ..wallet.walletservice import get_wallet, sign_transaction
# from ..wallet.walletservice import get_wallet, sign_transaction
from wallet.walletservice import get_wallet, sign_transaction, get_skyllian_public_key, sign_transaction_action



DOCUMENT_TYPE ="document"
TRANSACTION_TYPE = "transaction"
FAUCET_TYPE = "faucet"
LOCAL = "http://127.0.0.1:5000/"
GLOBAL = "http://185.3.94.49:80/"
CLIENTURL = LOCAL

# Scyllian must be running either locally or remote for 
# The tests to work
# Added testing 
SEED_TESTING = 'hero flight mimic ritual rotate gain foam fashion sand sadness large deer'



def test_get_blockchain():
    ''' Tests if data can be retreived from the blockchain'''
    request = requests.get(url=LOCAL + '/blocks')
    assert request.status_code == 200
    assert request.json() is not None
        
        
def test_get_history():
    ''' Tests if data can be retreived from the blockchain'''
    request = requests.get(url=LOCAL + '/blocks')
    assert request.status_code == 200
    assert request.json() is not None

def test_use_faucet():
    wallet = get_wallet(SEED_TESTING)
    private_key = wallet.private_key()
    public_key = wallet.public_key()
    transaction_dict = sign_transaction_action(transaction_type=FAUCET_TYPE, public_key= public_key, private_key = private_key)
    request = requests.post(url = LOCAL + f'/faucet/{public_key}' , json=transaction_dict)
    assert request.status_code == 200

def test_get_skyllian_public_key():
    '''
    Tests if we can get the public key of Skyllian the 
    chain itself
    '''
    skyllian_public_key = '02a3293e85a7fbde059e221ace4edc6743a3ba5a2758cb3001acf6d81750089dcb'
    # ret_dict = {'public_key': SKYLLIAN_PUBLIC_KEY}
    request = requests.get(url = LOCAL + f'/public_key')
    assert request.status_code == 200
    assert request.json()
    assert request.json()['public_key']
    assert request.json()['public_key'] == skyllian_public_key
    print(" request ", request.json())
    
def test_transaction():
    ''' Test transaction'''
    wallet = get_wallet(SEED_TESTING)
    private_key = wallet.private_key()
    public_key = wallet.public_key()
    transaction_dict = sign_transaction_action(transaction_type=TRANSACTION_TYPE, public_key = public_key, private_key = private_key)
            # Post transaction instance to annallClientAPI
    request = requests.post(url = CLIENTURL + '/sign-transaction', json=transaction_dict)
    # request = requests.post(url = LOCAL + f'/sign_transaction' , json=transaction_dict)
    assert request.status_code == 200
    
def test_transaction_history():
    wallet = get_wallet(SEED_TESTING)
    private_key = wallet.private_key()
    public_key = wallet.public_key()
    transaction_dict = sign_transaction_action(transaction_type=TRANSACTION_TYPE, public_key = public_key, private_key = private_key)
            # Post transaction instance to annallClientAPI
    request = requests.get(url = CLIENTURL + f"/transaction/history/{public_key}")
    # request = requests.post(url = LOCAL + f'/sign_transaction' , json=transaction_dict)
    assert request.status_code == 200
