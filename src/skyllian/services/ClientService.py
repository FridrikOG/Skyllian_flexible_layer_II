from flask import Response

import json
import requests

# Config
from config.FlaskConfig import FlaskConfig

# exceptions
from exceptions.exceptionHandler import InvalidUsage

class ClientService:
    def __init__(self):
        self.prefix = "./data/"
        self.flask_config = FlaskConfig()

        self.db_path = self.prefix + self.flask_config.DATABASE

    # def get_blockchain(self):
    #     with open(self.db_path) as config_file:
    #         db = json.load(config_file)
    #         print("Db ", db)

    def get_blockchain(self, production=True):

        '''
        Reads the blockchain if true else it reads a local json file
        '''

        if production:
            # TODO: DEPRECATED
            # data = server.send_msg(json.dumps({"request_type": "read_chain"}))
            # TODO: Instead talk to client api
            # http://185.3.94.49:80/blocks 
            data = requests.get('http://185.3.94.49:80/blocks')        
            # data = requests.get('http://185.3.94.49:80/blocks/0x16711e48d09c38f30e2d1128b75534a415ec3943094f896f3dc13581e51ec10f/verified')        
            
            if data.status_code == 200:
                print("Data from blockcahin ")
                data = data.json()
                return data
            print("Could not get from blockchain ", data.status_code)
            return []
        else:
            # This is essential just transactions
            f = open(self.db_path)
            # Load data from file
            data = json.load(f)
            # Close file read
            f.close()


            # Load data inside the list to json (dictionary)
            data = [json.loads(d) for d in data]

            
            return data

    def get_blockchain_size(self):
        # This is while blockchain isn't working properly, but
        # This should be a lot faster than getting the entire blockchain
        return len(self.get_blockchain())

    def get_missing_by_index(self, last_known_index):
        print("Last known index ", last_known_index)
        # Last known index is the last index we know was in the blockchain
        if self.get_blockchain_size() <= last_known_index:
            return []
        # Again, faking it, just getting the entire blockchain
        # But when it works on Annall we should only get from 
        # index x to y
        chain = self.get_blockchain() 
        if (self.get_blockchain_size() - last_known_index) == 1:
            return [chain[last_known_index]]
        return chain[last_known_index:]

    def post_blockchain(self, dict:str, production= True ):
        
        '''
        stores data in the blockchain - on_chain or locally (JSON)
        '''
        
        if production:
            print("Posting to db")
            try:
                
                resp_obj = requests.post('http://185.3.94.49:80/blocks', dict)
                if resp_obj.status_code == 201:
                    print("Transaction added to the blockcahin")
                else:
                    print("Not addedt  oblockcahin")
                    print("Code ", resp_obj.status_code)
                return Response(resp_obj, mimetype="application/json")
            except Exception:
                raise InvalidUsage("Unable to post to writer", status_code=500)
        else:
            listObj = []
            # Read JSON file
            with open(self.db_path) as fp:
                listObj = json.load(fp)
                print("Adding this round to json ", len(listObj))
                listObj.append(dict)
            with open(self.db_path, 'w') as json_file:
                json.dump(listObj, json_file, 
                                    indent=4,  
                                    separators=(',',': '))
            return Response({"Success": True}, mimetype="application/json")