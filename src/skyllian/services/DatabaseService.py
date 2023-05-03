from flask import Response

import json
import requests
import time
# Config
from config.FlaskConfig import FlaskConfig

# exceptions
from pymongo import MongoClient


from .ClientService import ClientService
from .SmartContractService import SmartContractService
from .TransactionService import TransactionService

cs = ClientService()
ss = SmartContractService()
ts = TransactionService()

# MongoClient client
client = None
import os

class DatabaseService:
    def __init__(self, database_name = None):
        # Use global client variable
        global client
        if database_name == None:
            database_name = os.environ.get("DATABASE_NAME")
        if database_name == None:
            database_name = 'skyllian'
        self.prefix = "./data/"
        self.flask_config = FlaskConfig()
        print("Databsae name ", database_name)
        if client is None:
            print("\nEstablishing existing client\n")
            client = MongoClient(host = "mongodb+srv://sky:sky@skyllian-db.dsclfjg.mongodb.net/" + "?retryWrites=true&w=majority")
            self.client = client
            print("Successfully connected to database ", database_name)
        else:
            print("\nUsing existing client\n")
            self.client = client
        self.db = self.client
        self.db_path = self.prefix + self.flask_config.DATABASE
        self.db = client.get_database(database_name)
        # TODO: Make this dynamic, use the database name passed in as a parameter
        # self.db = self.client.skyllian
        # if database_name is not None:
        #     self.db = self.client
        # else:            
        #     self.db = self.client
        
    def get_blocks(self):
        '''
        Gets all the transactions in mongodb
        '''
        blocks = self.db.blocks.find({})
        return blocks
    
    def get_smart_contract(self, contract_name: str):
        # contracts = self.db.blocks.find({"payload": {"header":{"type": "smart_contract"}}})
        print("The contract name ", contract_name)
        contract = self.db.blocks.find({"payload.payload.contract_name":contract_name})
        return list(contract)
    def get_blocks_object(self):
        '''
        Gets all the transactions in mongodb
        '''
        return self.db.blocks
    
    def populate_smartcontracts(self, blockchain_data):
        smartcontracts = self.db.smartcontracts
        contracts = ss.extract_smart_contracts(blockchain_data)
        smartcontracts.insert_many(contracts)
    
    def populate_transactions(self, blockchain_data):
        transactions = self.db.transactions
        trans = ts.extract_transactions(blockchain_data)
        transactions.insert_many(trans)
    
    def delete_smartcontracts(self):
        smartcontracts = self.db.smartcontracts
        smartcontracts.delete_many({})
    
    def delete_transactions(self):
        transactions = self.db.transactions
        transactions.delete_many({})
    
    def delete_blocks(self):
        blocks = self.db.blocks
        blocks.delete_many({})
        
    def check_if_update_necessary(self):
        trans = cs.get_blockchain()
        blocks = self.get_blocks_object()

        amount_blocks_on_mdb = self.get_database_size()
        print("Trans on mdb ", amount_blocks_on_mdb, "Vs otrans ", len(trans))
        
        if len(trans) <= 1:
            return 'Blockchain is empty, or not functioning'
        if amount_blocks_on_mdb == len(trans):
            print("Database already up to date")
        elif amount_blocks_on_mdb > len(trans):
            print("More blocks on mdb")
            # The amount of transactions in the store is more than chain
            # on the blockchain we need to delete and add everything again
            # Because no way to know how we have more transactions
            blocks.insert_many(trans) 
        elif amount_blocks_on_mdb < len(trans):
            # Try i times
            for i in range(10):
                blockchain_data = cs.get_missing_by_index(amount_blocks_on_mdb)
                
                if blockchain_data:
                    blocks.insert_many(blockchain_data)
                    break
                # Sleeping for 3 seconds so we don't hammer the API
                time.sleep(5)
    def setup_database(self):
        print("Setting up database for the first time")
        self.delete_blocks()
        # Update will always be necessary as long as blockchain is not empty 
        # Since we just cleaned the existing database
        self.check_if_update_necessary()
    

    def get_database_size(self):
        blocks = self.db.blocks
        return blocks.count_documents({})


    def update(self):
        ''' Updates the mongodb after receiving message from rabbitmq queue '''
        pass
