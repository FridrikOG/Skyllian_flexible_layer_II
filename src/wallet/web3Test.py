# from eth_account._utils.transactions import serializable_unsigned_transaction_from_dict
# from web3 import Web3

# transaction = {
#     'to': Web3.toChecksumAddress('0x4d6bb4ed029b33cf25d0810b029bd8b1a6bcab7b'),
#     'gas': 21000,
#     'gasPrice': 10000000000,
#     'nonce': 1,
#     'value': 1,
# }
# serializable_transaction = serializable_unsigned_transaction_from_dict(transaction)
# transaction_hash = serializable_transaction.hash()
# print(transaction_hash.hex())


from eth_account import Account
from binascii import (
    hexlify, unhexlify
)

a = Account()



a_obj = a.create()

print(a_obj)

print(a_obj.key)
print(type(a_obj.key))
print(unhexlify(a_obj.key))