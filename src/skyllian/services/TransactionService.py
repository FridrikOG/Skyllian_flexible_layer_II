# Ecdsa
import ecdsa
from ecdsa.curves import SECP256k1
from ecdsa.keys import (
    SigningKey, VerifyingKey
)

# Binary to hex - hex to binary module
from binascii import unhexlify

# Exceptions
from exceptions.exceptionHandler import InvalidUsage

# Types
from enums.TransactionTypes import TransactionTypes

from models.Transaction import Transaction


class TransactionService():
    def __init__(self):
        pass
    
    def verify_signature(self, public_key,signature,_hash):
        # Retrieve the VerifyingKey instance from the public key using the respective curve
        try:
            key:VerifyingKey = ecdsa.VerifyingKey.from_string(unhexlify(public_key), curve=SECP256k1)
        except Exception as e:
            return False

        # Verify the signature against the data provided in the signing of the transaction
        try:
            isVerified = key.verify(signature=unhexlify(signature),data=unhexlify(_hash))
        except Exception as e:
            print("Cannot verify signature")
            return False

        return isVerified

    def sign_transaction(self,priv_key:str,transaction_hash:str="transaction") -> bytes:
        '''
        Signs a transaction with the private key and the transaction
        Some conversions of types are required - unhexlif() and encode() are used.
        '''

        # unhexlify private_Key to bytes representation
        _private_key:bytes = unhexlify(priv_key)

        # Create SigningKey instance from ecdsa library assigning the private key to it.
        _key:SigningKey = ecdsa.SigningKey.from_string(_private_key, curve=SECP256k1)

        print(transaction_hash)

        # Sign transaction
        signature:bytes = _key.sign(unhexlify(transaction_hash))

        return signature

    def get_hash(self, _type, sender, nonce,receiver,amount):
        t = Transaction(data={"type": _type, "public_key": sender, "nonce": nonce,"receiver": receiver, "amount": amount})
        _hash = t.hash()

        return t._hash

    def get_transactions_with_public_key(self, transactions, public_key):
        # transaction_with_public_key
        t_w_pk_lis = []
        for _dict in transactions:
            print("The transaction before crash ", _dict)
            try:
                transaction_public_key = _dict['payload']['headers']['public_key']
                transaction_receiver = _dict['payload']['payload']['receiver']
                print(f"pub {transaction_public_key} private {transaction_receiver}")
            except:
                print("Could not find public and private key")
            if transaction_public_key == public_key or transaction_receiver == public_key:
                t_w_pk_lis.append(_dict)
        return t_w_pk_lis

    def get_nonce_from_lis(self, transactions):
        '''
        Get highest nonce from transactions list
        '''
        nonce_lis = []

        for _dict in transactions:
            # print(_dict['payload']['payload'])
            nonce = _dict['payload']['headers']['nonce']
            nonce_lis.append(nonce)

        try:
            print("nonce_lis")
            print(nonce_lis)
            return max(nonce_lis) + 1
        except ValueError:
            return 0

    def get_public_key_balance(self, public_key, transactions):
        ''' This endpoint takes the total received and total sent and returns the balance'''
        receiver_transactions = self.__get_receiver_transactions(transactions=transactions, public_key=public_key)
        sender_transactions = self.__get_sender_transactions(transactions=transactions, public_key=public_key)
        received_balance = sum(int(x['payload']['payload']['amount']) for x in receiver_transactions)
        sender_balance = sum(int(x['payload']['payload']['amount']) for x in sender_transactions)
        print(f"balance: {received_balance} - {sender_balance}")
        balance = received_balance - sender_balance
        return balance

    def has_sufficient_balance(self, public_key, transactions, amount):
        balance = self.get_public_key_balance(public_key, transactions)
        print("__has_sufficient_balance")
        print(balance,amount)
        if balance < amount:
            return False
        return True




    def get_message_type_dict(self, nonce:str, signature:str,_hash,transaction_type, sender, receiver ='',amount = 0, contract_name = '', code = '') -> dict:
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
                    "contract_name" : contract_name,
                    "code" : code
                    }
                }
        }

        # get scyllians public key
        if transaction_type == TransactionTypes.DOCUMENT_TYPE.value:
            # Set attributes 
            dict_ret['payload']['headers']['type'] = transaction_type
            dict_ret['payload']['headers']['public_key'] = sender
            dict_ret['payload']['headers']['nonce'] = nonce
            dict_ret['payload']['headers']['signature'] = signature
            dict_ret['payload']['headers']['_hash'] = _hash
            dict_ret['payload']['payload']['receiver'] = receiver
            dict_ret['payload']['payload']['amount'] = 5

        elif transaction_type == TransactionTypes.CONTRACT_TYPE.value:
            dict_ret['payload']['headers']['type'] = transaction_type
            dict_ret['payload']['headers']['public_key'] = sender
            dict_ret['payload']['headers']['nonce'] = nonce
            dict_ret['payload']['headers']['signature'] = signature
            dict_ret['payload']['headers']['_hash'] = _hash
            dict_ret['payload']['payload']['contract_name'] = contract_name
            dict_ret['payload']['payload']['code'] = code
            

        elif transaction_type == TransactionTypes.TRANSACTION_TYPE.value:
            
            # Set attributes 
            dict_ret['payload']['headers']['type'] = transaction_type
            dict_ret['payload']['headers']['public_key'] = sender
            dict_ret['payload']['headers']['nonce'] = nonce
            dict_ret['payload']['headers']['signature'] = signature
            dict_ret['payload']['headers']['_hash'] = _hash
            dict_ret['payload']['payload']['receiver'] = receiver
            dict_ret['payload']['payload']['amount'] = amount

        elif transaction_type == TransactionTypes.FAUCET_TYPE.value:
            # Set attributes 
            dict_ret['payload']['headers']['type'] = transaction_type
            dict_ret['payload']['headers']['public_key'] = sender
            dict_ret['payload']['headers']['nonce'] = nonce
            dict_ret['payload']['headers']['signature'] = signature
            dict_ret['payload']['headers']['_hash'] = _hash
            dict_ret['payload']['payload']['receiver'] = receiver
            dict_ret['payload']['payload']['amount'] = amount
        return dict_ret




    def __get_sender_transactions(self, transactions, public_key):
        ts = [t for t in transactions if t['payload']['headers']['public_key'] == public_key]
        return ts

    def __get_receiver_transactions(self, transactions, public_key):
        ts = []
        for t in transactions:
            # print(t)
            # print(type(t))
            print("The transaction ", t)
            if t['payload']['payload']['receiver'] == public_key:
                ts.append(t)
        return ts

    def extract_transactions(self, data):
        ''' We want to extract transactions from data,'''
        transactions = []
        if data:
            for trans in data:
                print("Trans ", trans)
                try:
                    if trans['round'] == 0:
                        print("First block")
                except Exception as ex:
                    print("Exception ",ex)
                try:
                    if trans['payload']['headers']['type'] == TransactionTypes.TRANSACTION_TYPE.value:
                        transactions.append(trans)
                        print("Type trans added ")
                    elif trans['payload']['headers']['type'] == TransactionTypes.FAUCET_TYPE.value:
                        transactions.append(trans)
                        print("Type faucet added ")
                except Exception as ex:
                    print("Exception ", ex)
            return transactions


