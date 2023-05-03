from services.ClientService import ClientService

from enums.TransactionTypes import TransactionTypes

import textdistance as td

class ExplorerService():
    def __init__(self):
        self.cs = ClientService()

    ''' Get Latest '''
    def get_latest_blocks(self):
        block_lis =  self.cs.get_blockchain()

        return block_lis

    def get_latest_five_blocks(self):
        block_lis =  self.cs.get_blockchain()

        return block_lis[:5]

    
    ''' Search Filter '''

    def get_by_search_of_addresses(self,keyword:str, blocks:list) -> dict:
        _dic = {}

        for b in blocks:
            _hash = b['hash']
            headers = b['payload']['headers']
            payload = b['payload']['payload']

            public_key = headers['public_key']

            score_pub_key = td.hamming(public_key, keyword)

            if headers['type'] == TransactionTypes.TRANSACTION_TYPE.value:
                receiver = payload['receiver']

                score_recv_key = td.hamming(receiver, keyword)

                if score_recv_key <= 0.5:
                    _dic[_hash] = b

            if score_pub_key <= 0.5:
                _dic[_hash] = b

        return _dic

    def get_by_search_of_types(self, keyword:str, blocks:list) -> dict:
        _dic = {}

        for b in blocks:
            _hash = b['hash']
            headers = b['payload']['headers']

            _type = headers['type'] 

            sim_score = td.hamming(keyword, _type)

            if sim_score <= 0.5:
                _dic[_hash] = b

        return _dic

    def get_by_search_of_hash(self, keyword:str, blocks:list) -> dict:
        _dic = {}

        for b in blocks:
            _hash = b['hash']
            headers = b['payload']['headers']

            _hash = headers['hash'] 

            sim_score = td.hamming(keyword, _hash)

            if sim_score <= 0.5:
                _dic[_hash] = b

        return _dic

    def get_by_search_of_contract_name(self, keyword:str, blocks:list) -> dict:
        _dic = {}

        for b in blocks:
            _hash = b['hash']
            headers = b['payload']['headers']
            payload = b['payload']['payload']

            public_key = headers['public_key']

            score_pub_key = td.hamming(public_key, keyword)

            if headers['type'] == TransactionTypes.CONTRACT_TYPE.value:
                contract_name = payload['contract_name']

                sim_score = td.hamming(contract_name, keyword)
                
                if sim_score <= 0.5:
                    _dic[_hash] = b

        return _dic

    def get_by_search_filter(self, keyword, option):
        blocks = self.cs.get_blockchain()

        lis = []

        print(option)

        if option == "All Filters":
            _d = {}
            
            d = self.get_by_search_of_addresses(keyword=keyword, blocks=blocks)
            _d.update(d)

            d = self.get_by_search_of_types(keyword=keyword,blocks=blocks)
            _d.update(d)

            d = self.get_by_search_of_hash(keyword=keyword, blocks=blocks)
            _d.update(d)

            d = self.get_by_search_of_contract_name(keyword=keyword, blocks=blocks)
            _d.update(d)

            lis = list(_d.values())

        elif option == "Addresses":
            lis = list(self.get_by_search_of_addresses(keyword=keyword, blocks=blocks).values())

        elif option == "Types":
            lis = list(self.get_by_search_of_types(keyword=keyword, blocks=blocks).values())

        elif option == "Hash":
            lis = list(self.get_by_search_of_hash(keyword=keyword, blocks=blocks).values())

        elif option == "Contract Name":
            lis = list(self.get_by_search_of_contract_name(keyword=keyword, blocks=blocks).values())

        print(f"List len: {len(lis)} & {len(blocks)}")


        # res_lis = [b for b in blocks if b['payload']['headers']['type'] == TransactionTypes.TRANSACTION_TYPE.value and (b['payload']['headers']['public_key'] == keyword or b['payload']['payload']['receiver'] == keyword)]

        return lis


    