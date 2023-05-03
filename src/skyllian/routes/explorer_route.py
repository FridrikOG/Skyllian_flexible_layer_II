# Flask
from flask import Blueprint, Response, request

from services.ExplorerService import ExplorerService


es_service = ExplorerService()





explorer = Blueprint('explorer_route', __name__)


# TODO Search
@explorer.route("/search", methods=["POST"])
def search_by() -> list:
    data = request.json

    print(data)

    data:list = es_service.get_by_search_filter(keyword=data['keyword'], option=data['option'])

    return data


'''
Basic info - Annall - price, market cap, transactions, last finalized block, Annall transaction history in 14 days?
'''





'''
Latest blocks & latest transactions
'''
@explorer.route("/latest_blocks", methods=["GET"])
def latest_blocks():
    return es_service.get_latest_five_blocks()

@explorer.route("/latest_transactions", methods=["GET"])
def latest_transactions():
    return es_service.get_latest_five_blocks()



# TODO:
@explorer.route("/last_finalized_block", methods=["GET"])
def last_finalized_block():
    return []

@explorer.route("/transaction-history-14-days", methods=["GET"])
def transaction_history_last_fourteen_days():
    return []

@explorer.route("/market-cap", methods=["GET"])
def market_cap():
    '''
    How much AC (AnnallCoin) has been distributed in the blockchain in forms of faucets

    Defintion:
    Market capitalization, sometimes referred to as market cap, is the total value of a 
    publicly traded company's outstanding common shares owned by stockholders. 
    Market capitalization is equal to the market price per common share multiplied 
    by the number of common shares outstanding. Wikipedia
    ''' 
    return []

# @explorer.route("/number-of-transactions", methods=["GET"])
# def number_of_transactions():
#     return []



'''
Timestamps and time related data measuring annall's performance in terms of complexity resolution.
'''

@explorer.route("/avg-time-to-add-block", methods=["GET"])
def number_of_transactions():
    '''
    Returns a time-series of average time for Annall to process a block.
    '''
    return []

# @explorer.route("/avg-time-to-st", methods=["GET"])
# def number_of_transactions():
#     '''
#     Returns a time-series of average time for Annall to process a block.
#     '''
#     return []