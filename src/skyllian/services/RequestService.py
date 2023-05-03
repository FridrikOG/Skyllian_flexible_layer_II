import json

# Exceptions
from exceptions.exceptionHandler import InvalidUsage

from Crypto.PublicKey import RSA 
from Crypto.Hash import SHA256 
from Crypto.Signature import pkcs1_15

class RequestService:
    def __init__(self):
        pass

    def get_json(self, request) -> dict:
        '''
        Tries to load to json the string request.data
        '''
        try:
            return json.loads(request.data) 
        except Exception:
            raise InvalidUsage("The JSON could not be decoded", status_code=400)

    def verify_request_object(self, request_object) -> bool:
        '''
        Tries to verify the request_object
        '''
        return True
        pub_key_exp = request_object['payload']['headers']['pubKey']
        message = request_object['payload']['headers']['message']
        signature = request_object['payload']['headers']['signature']
        try:
            verifySignature(pub_key_exp, message, signature)
            return True
        except:
            return False

    # OUTDATED
    def verifySignature(self, pubKey, message, signature) -> None:
        ''' Verifies a signed message with the public key'''
        message = message.encode("ISO-8859-1") 
        signature = signature.encode("ISO-8859-1") 
        pubKey = pubKey.encode("ISO-8859-1") 
        pubKey = RSA.importKey(pubKey)
        pkcsObj = pkcs1_15.new(pubKey)
        _hash = SHA256.new(message)
        return pkcsObj.verify(_hash, signature)

    def __verify_request_obj(self, request_obj):
        # Headers checks
        if 'sender' not in request_obj:
            raise InvalidUsage("JSON object has no sender", status_code=400)

        if 'nonce' not in request_obj:
            raise InvalidUsage("JSON object has no nonce ", status_code=400)

        if 'signature' not in request_obj:
            raise InvalidUsage("JSON object has no signature ", status_code=400)
        
        if '_hash' not in request_obj:
            raise InvalidUsage("JSON object has no _hash ", status_code=400)

        # Payload checks
        if 'receiver' not in request_obj:
            raise InvalidUsage("JSON object has no receiver ", status_code=400)

        if 'amount' not in request_obj:
            raise InvalidUsage("JSON object has no amount ", status_code=400)

    def get_request_attributes(self, request_obj):
        # header values from transaction
        _type = request_obj['type']
        sender = request_obj['sender']
        nonce = request_obj['nonce']
        signature = request_obj['signature']
        _hash = request_obj['_hash']
        
        # payload values from transaction
        receiver = request_obj['receiver']
        amount = request_obj['amount']

        return _type, sender, nonce, signature, _hash, receiver, amount

    def get_smart_contract_attributes(self, request_obj):
        # header values from transaction
        _type = request_obj['type']
        sender = request_obj['sender']
        nonce = request_obj['nonce']
        signature = request_obj['signature']
        _hash = request_obj['_hash']
        
        # payload values from transaction
        contract_name = request_obj['contract_name']
        code = request_obj['code']

        return _type, sender, nonce, signature, _hash, contract_name, code 