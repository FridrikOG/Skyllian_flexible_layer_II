#!/usr/bin/env python
# -*- coding: utf-8 -*- 

""" 
A ClientAPI for Annáll using Flask and Gunicorn.
"""

# Flask imports
from flask import Flask, request, jsonify, Response
import os
# Flask cors
from flask_cors import CORS

# Utils
import json
import threading

from binascii import (
    hexlify
)

import configparser
# Setup
from setup import Setup

# Exceptions
from exceptions.exceptionHandler import InvalidUsage

# Routes
from routes.smartcontract_routes import smartcontract
from routes.analysis_routes import analysis
from routes.explorer_route import explorer

# Configs
from config.FlaskConfig import FlaskConfig

# Services
from services.RequestService import RequestService
from services.ClientService import ClientService
from services.TransactionService import TransactionService
from services.DatabaseService import DatabaseService
from enums.TransactionTypes import TransactionTypes

# Models


''' Initializations '''

# Setup instance


# Services
rs = RequestService()
cs = ClientService()
ts = TransactionService()
ds = DatabaseService('skyllian')


# Config
fc = FlaskConfig()





print("Starting annallClientAPI Flask application server")
app = Flask('flask')

# Enable cors
CORS(app)

# Register routes to app
app.register_blueprint(blueprint=smartcontract, url_prefix="/sc")
app.register_blueprint(blueprint=analysis, url_prefix="/analysis")
app.register_blueprint(blueprint=explorer, url_prefix="/explorer")



''' 
Routes
'''
@app.errorhandler(InvalidUsage)
def handle_invalid_usage(error) -> Response:
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response


@app.route('/',methods=["GET"])
def getServerStatus() -> Response:
    return []

@app.route('/balance/<public_key>',methods=["GET"])
def getBalance(public_key:str) -> Response:
    # TODO: Fix get balance
    # Initial default balance
    ret_dict = {"balance": 0}

    # Fetch all transactions on the chain
    data = cs.get_blockchain()
    transactions = ts.extract_transactions(data)
    if not transactions:
        return ret_dict
    # retrieve the balance for a specified public key - accumulate the transactions send/receive of funds
    balance = ts.get_public_key_balance(public_key=public_key,transactions=transactions)

    # Set the new balance 
    ret_dict["balance"] = balance

    # Return response
    return ret_dict

@app.route("/faucet/<public_key>", methods=["POST"]) 
def getFaucet(public_key:str) -> Response:
    
    ''' 
    TODO: Missing signing the actual transaction since 
    now skyllian is approving the subtraction of its own funds
    '''
    # This needs to be stored in a environment variable
    # The standard dictionary 
    request_obj = rs.get_json(request)
    if "amount" in request_obj:
        
        faucet_value = request_obj['amount']
    else:
        faucet_value = 5
    
    data = cs.get_blockchain()
    if data:
        transactions = ts.extract_transactions(data=data)
        
    else:
        transactions = []
    ts.get_transactions_with_public_key(transactions=transactions,public_key=public_key)
    nonce = ts.get_nonce_from_lis(transactions=transactions)
    
    _hash = str(hexlify(ts.get_hash(TransactionTypes.FAUCET_TYPE.value, fc.SKYLLIAN_PUBLIC_KEY, nonce, public_key,faucet_value )),encoding="utf-8")
    key = fc.SKYLLIAN_PRIVATE_KEY
    _signature = str(hexlify(ts.sign_transaction(priv_key=key,transaction_hash=_hash)), encoding="utf-8")
    
    IsVerified = ts.verify_signature(public_key=fc.SKYLLIAN_PUBLIC_KEY, signature=_signature, _hash=_hash)
    

    msg_obj = ts.get_message_type_dict(nonce=nonce, signature=_signature ,_hash=_hash,transaction_type=TransactionTypes.FAUCET_TYPE.value, sender=fc.SKYLLIAN_PUBLIC_KEY, receiver=public_key,amount=faucet_value)
    # Store in database
    print("Message object ", msg_obj)
    # block = json.dumps({"request_type": "block", "name":"name", "payload": msg_obj['payload'], "payload_id" :1})
    resp_obj = json.dumps(msg_obj)
    resp_obj = cs.post_blockchain(resp_obj)
    return resp_obj

# TODO: Deprecated????? - uses server.send_msg ? 
# @app.route("/publishandsubscribe", methods=["GET"])
# def createSmartContracts() -> Response:
#     # Asks for blockchain and gets it back
#     requestObject = rs.get_json(request)
#     typeToGet = requestObject['type']
#     typeToGet = typeToGet.lower()
#     resp_obj = server.send_msg(json.dumps({"request_type": "read_chain"}))
#     obj = json.loads(resp_obj)
#     lis = []
#     for res in obj:
#         try:
#             if res['payload']['headers']['type'] == typeToGet:
#                 lis.append(res)
#         except:
#             print("Couldnt find a type")
#     lis = jsonify(lis)
#     return Response(lis, mimetype="application/json")


@app.route("/blocks", methods=["GET"])
def get_blockchain():
    try:
        data = cs.get_blockchain()
        print(type(data))
        return data
    except Exception:
        raise InvalidUsage("Failed to read from writer", status_code=500)

@app.route("/transactions", methods=["GET"])
def get_transactions():
    try:
        check_skyllian_db()
        data = cs.get_blockchain()
        transactions = ts.extract_transactions(data)
        return Response(json.dumps([json.dumps(x) for x in transactions] ), mimetype="application/json")
    except Exception:
        raise InvalidUsage("Failed to read from writer", status_code=500)

@app.route("/blocks/<int:public_key>", methods=["GET"])
def get_wallet_info():
    try:
        resp_obj = server.send_msg(json.dumps({"request_type": "read_chain"}))
        return Response(resp_obj, mimetype="application/json")
    except Exception:
        raise InvalidUsage("Failed to read from writer", status_code=500)
    


@app.route("/nonce/<public_key>", methods=["GET"])
def get_nonce(public_key):
    '''
    Retrieves the current nonce value - 
        nonce is defined as the number of transactions already in the chain
        corresponding to a specific public key.
    '''

    # Default nonce value if no transaction already exists.
    ret_dict = {"nonce": 0}
    
    # Reads 'chain' - transactions
    transactions = cs.get_blockchain()

    # There are no transactions in/on the database/chain
    if transactions == []:
        return ret_dict

    # Get all transactions with a specific public_key
    transactions_w_pk = ts.get_transactions_with_public_key(transactions=transactions,public_key=public_key)

    # Public key has no transactions return 'first' nonce=0
    if transactions_w_pk == []:
        return ret_dict

    # Find new nonce, max(nonce) + 1 that exists
    nonce = ts.get_nonce_from_lis(transactions=transactions_w_pk)

    # Assign new nonce to ret_dict
    ret_dict['nonce'] = nonce

    return ret_dict

def isDuplicateTransaction(transactions:list, sender, signature, nonce):
    ''' Checks if nonce has been used before or if signature has been used before'''
    for trans in transactions:
        print("Line338 ", trans['payload']['headers']['signature'])
        if trans['payload']['headers']['signature'] == signature:
            return True
        elif trans['payload']['headers']['nonce'] == nonce and trans['payload']['headers']['public_key'] == sender:
            return True
        # No duplicate transactio nfound
        return False





@app.route("/sign-transaction", methods=["POST"])
def sign_transaction():
    '''
    Retrieves a signed tratnsaction in the body of the POST request.
    Checks the transactions validity and returns the IsVerified boolean value.
    '''
    request_obj = rs.get_json(request)
    # Verify necessary attributes are in the object
    rs.verify_request_object(request_obj)
    
    # Get attributes from the request object
    _type, sender, nonce, signature, _hash,receiver,amount = rs.get_request_attributes(request_obj)
    # Verify the signature - returns a bool of which if true verified and false not verified
    # Check if signature is valid
    # TODO: Uncomment to check signature, for testing purposes signature is not checked
    # if not ts.verify_signature(public_key=sender, signature=signature, _hash=_hash):
    #     raise InvalidUsage("Signature not valid", status_code=401) 
    # Get all the data from the database
    data = cs.get_blockchain()
    transactions = []
    if data:
        # Get all transactions from the blockcahin
        transactions = ts.extract_transactions(data)
        # Check every transaction if this signature has been used previously
        # Or if nonce has been used by this public key
        if isDuplicateTransaction(transactions, sender=sender, signature=signature, nonce=nonce):
            raise InvalidUsage("Transaction has already been processed", status_code=401) 

    if not ts.has_sufficient_balance(public_key=sender,transactions=transactions,amount=amount):
        print("Insufficient funds")
        raise InvalidUsage("Public key has insufficient funds to perform transaction", status_code=400)
    # Get the format the annallclient prefers
    msg_obj = ts.get_message_type_dict(nonce=nonce, signature=signature,_hash=_hash,transaction_type=_type, sender=sender,receiver=receiver, amount=amount)
    block = json.dumps({"request_type": "block", "payload": msg_obj['payload']})
    resp_obj = cs.post_blockchain(block)
    return Response(f"isVerified: {True}",mimetype="application/json")


@app.route("/transaction/history/<public_key>", methods=["GET"])
def get_personal_transactions_history(public_key:str) -> Response:
    '''
    Retrieves the transaction history corresponding to the given public key
    '''
    transactions = cs.get_blockchain()
    transactions_with_public_key = ts.get_transactions_with_public_key(transactions=transactions,public_key=public_key)
    the_dict = {"transactions": transactions_with_public_key}
    return the_dict


@app.route("/public_key", methods=["GET"])
def get_skyllian_public_key() -> Response:
    '''
    Retrieves the public key corresponding to skyllian
    '''

    ret_dict = {'public_key': fc.SKYLLIAN_PUBLIC_KEY}
    
    return ret_dict

def run_app(host, port, debug, use_reloader ):
    config_obj = configparser.ConfigParser()
    import json
    # imp_conf =app.config.from_file("config.json", load=json.load)
    # print("conf ", imp_conf)
    # print(config_read.sections())
    print(    app.config)
    print("Local 1 ", config_obj)
    
    app.run(host=host, port=port, debug=debug, use_reloader=use_reloader)

if __name__ == '__main__':
  from argparse import ArgumentParser
  parser = ArgumentParser()
  # Allows you to run more than one instance of the app
  parser.add_argument('-port')
  parser.add_argument('-db')
  args = parser.parse_args()
  port = args.port
  db = args.db
  if port is None:
    port = 5000
  ds = DatabaseService(database_name=db)
  ds.setup_database()
  
  host="127.0.0.1"
  threading.Thread(target=lambda: run_app(host, port, debug = True, use_reloader=False)).start()
  # Get the authentication from the RabbitMQ environmental variable
  url = os.environ.get("RABBITMQ_PASSWORD")
  setup_instance = Setup(str(port), url)
# Starting message broker consumer - thread
  threading.Thread(target=setup_instance.setup_message_broker()).start()

  # threading.Thread(target=DatabaseService.setup_database()).start()
  
 


    