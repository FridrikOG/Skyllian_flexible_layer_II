import base64

from exceptions.exceptionHandler import InvalidUsage

# Import types
# from types.TransactionTypes import TransactionTypes
from enums.TransactionTypes import TransactionTypes


class SmartContract:
    def __init__(self, request_obj: dict, get_contract: bool = True):
        self.request_obj = request_obj
        if get_contract: 
            self.validate_get_json()
            self.function = self.request_obj['function']
            self.params = self.request_obj['params']
        else:
            self.validate_post_json()
        self.contract_name = self.request_obj['contract_name']
            
    def validate_get_json(self) -> None:
        '''Validate the JSON representation of the smart contract'''
        if 'type' not in self.request_obj:
            raise InvalidUsage("Missing the type", status_code=400)
        if self.request_obj['type'] != 'smart_contract':
            raise InvalidUsage("Object passed is not of type smart_contract", status_code=400)
        if 'contract_name' not in self.request_obj:
            raise InvalidUsage("Missing contract_name variable", status_code=400)
        if 'function' not in self.request_obj:
            raise InvalidUsage("Missing function", status_code=400)
        if 'params' not in self.request_obj:
            raise InvalidUsage("Missing params", status_code=400)
    
    def validate_post_json(self) -> None:
        '''Validate the JSON representation of the smart contract'''
        if 'type' not in self.request_obj:
            raise InvalidUsage("Missing the type", status_code=400)
        if self.request_obj['type'] != 'smart_contract':
            raise InvalidUsage("Object passed is not of type smart_contract", status_code=400)
        if 'contract_name' not in self.request_obj:
            raise InvalidUsage("Missing contract_name variable", status_code=400)
            
    def get_smart_contracts(self, data):
        ''' Gets every single contract on the blockchain'''
        contract_lis = []
        for trans in data:
            if TransactionTypes.CONTRACT_TYPE.value == trans['payload']['headers']['type']:
                print("Found a contract")
                contract_lis.append(trans)
        return contract_lis
    def get_requested_contract(self, smart_contracts, contract_name):
        ''' Gets the requested contract by name '''
        if not smart_contracts:
            False
        for contract in smart_contracts:
            if contract['payload']['payload']['contract_name'] == contract_name:
                return contract
        return False
    
    def run_contract(self, code):
        ''' Uses the code passed in the paramater and runs it and returns the result'''
        # TODO: There is a strange error here where if blockchain_data is not a dictionary then it doesn't work
        # It refuses to create the smart contract for some strange reason if it's just a string variable
        # But if indexed as a dictionary it magically works. Fix this issue.
        blockchain_data ={}
        blockchain_data['code'] = code
        code = blockchain_data['code'].encode()
        code = base64.b64decode(s=code)
        with open("contract.py", "wb") as f:
            f.write(code)
        # from test import funcCall
        # Dynamically import the file specified by a string
        # We will always name it test so it's fine
        module = __import__('contract')
        func_to_call = getattr(module, self.function)
        # Calling the function
        ret = func_to_call(self.params)
        return ret