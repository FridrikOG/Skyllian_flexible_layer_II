# Types
from enums.TransactionTypes import TransactionTypes

class SmartContractService:
    def __init__(self):
        pass


    def extract_smart_contracts(self, data):
        ''' Gets every single contract on the blockchain'''
        contract_lis = []
        for trans in data:
            print("Each trans ", trans)
            if trans['payload']['headers']['type'] == TransactionTypes.CONTRACT_TYPE.value:
                contract_lis.append(trans)
        return contract_lis
        
        
        





