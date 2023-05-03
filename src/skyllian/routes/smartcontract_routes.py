# Flask
from flask import Blueprint, Response, request

# Base64
import base64



# Service imports
from services.SmartContractService import SmartContractService
from services.RequestService import RequestService
from services.TransactionService import TransactionService
from services.ClientService import ClientService
from services.DatabaseService import DatabaseService
from models.SmartContract import SmartContract


import json
cs = ClientService()

scs = SmartContractService()
rs = RequestService()
ts = TransactionService()
ds = DatabaseService()

smartcontract = Blueprint('smartcontract_route', __name__)

@smartcontract.route('/s', methods=['POST','GET'])
def s():
    return ["s from smartcontract routes"]

@smartcontract.route("/smart_contract", methods=["GET"])
def run_smart_contract():
    '''
    Retrieves a signed transaction in the body of the POST request.
    Checks the transactions validity and returns the IsVerified boolean value.
    '''
    request_obj = rs.get_json(request)
    # Initiate smart contract class that validates the json object
    smart_contract = SmartContract(request_obj, get_contract= True )  
    # Code in string format but it is bytes
    # blockchain_data = cs.get_blockchain()
    requested_contract = ds.get_smart_contract(contract_name = request_obj['contract_name'])

    print("The requested contract ", requested_contract)
    # smart_contracts = smart_contract.get_smart_contracts(data=blockchain_data)
    # requested_contract = smart_contract.get_requested_contract(smart_contracts = smart_contracts, contract_name = smart_contract.contract_name)
    if not requested_contract:
        return Response("Requested contract not found", 404)
    requested_contract = requested_contract[0]
    code = requested_contract['payload']['payload']['code']
    result = smart_contract.run_contract(code)
    # ds.check_if_update_necessary()
    return Response(f"return: {result}",mimetype="application/json")

@smartcontract.route("/smart_contract", methods=["POST"])
def create_smart_contract():
    '''
    Retrieves a signed transaction in the body of the POST request.
    Checks the transactions validity and returns the IsVerified boolean value.
    '''
    request_obj = rs.get_json(request)

    print(request_obj)
    
    data = cs.get_blockchain()
    request_obj = rs.get_json(request)
    # Initiate smart contract class that validates the json object
    smart_contract = SmartContract(request_obj, get_contract=False)  
    # Code in string format but it is bytes
    # blockchain_data = cs.get_blockchain()
    requested_contract = ds.get_smart_contract(contract_name = smart_contract.contract_name)
    print("Found contract ", requested_contract)
    if requested_contract:
        return Response("Contract already exits", 400)
    # Code in string format but it is bytes
    code = request_obj['code']
    _bytes = request_obj['code'].encode()
    request_obj['code'] = base64.b64decode(s=_bytes)
    code = request_obj['code']
    _type, sender, nonce, signature, _hash,contract_name, code = rs.get_smart_contract_attributes(request_obj)
    
    code = base64.b64encode(s=code).decode()
    msg_obj = ts.get_message_type_dict(nonce=nonce, signature=signature,_hash=_hash,transaction_type=_type, sender=sender,receiver='', amount = 0, contract_name=contract_name, code=code)
    block = json.dumps({"request_type": "block", "payload": msg_obj['payload']})
    print("Block to send to blockchain ", block)
    resp_obj = cs.post_blockchain(block)
    return Response(f"isVerified: {block}",mimetype="application/json")