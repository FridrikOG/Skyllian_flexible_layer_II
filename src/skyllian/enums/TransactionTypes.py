from enum import Enum
class TransactionTypes(Enum):
    ''' Gets the Enum representing the types that Skyllian accepts'''
    # Example: 
    # Types.CONTRACT_TYPE.value gives the value 'smart_contract', 
    # Types.CONTRACT_TYPE.name gives the name of CONTRACT_TYPE
    # Types.CONTRACT_TYPE gives <CONTRACT_TYPE: 'smart_contract'>
    DOCUMENT_TYPE ="document"
    TRANSACTION_TYPE = "transaction"
    FAUCET_TYPE = "faucet"
    CONTRACT_TYPE = 'smart_contract'