import tkinter as tk
from pandastable import Table, TableModel
import pandas as pd
import numpy as np

from wallet_utils import get_wallet, getKeys, get_skyllian_public_key, get_balance, get_faucet, get_transaction_history, sign_transaction, b64_decode_contract, b64_encode_contract, sign_smart_contract

E=tk.E
W=tk.W
N=tk.N
S=tk.S
def main():
    app = App()
    app.master.title("Sample application")
    app.mainloop()


TRANSACTION_HISTORY_TABLE_TYPE = "transaction_history_table_type"
HOME_TYPE = "home_type"
CREATE_TRANSACTION_TYPE = "create_transaction_type"
SMART_CONTRACT_TYPE = "smart_contract_type"
FAUCET_TYPE = "faucet_type"

TYPES_LIS = [HOME_TYPE, CREATE_TRANSACTION_TYPE, SMART_CONTRACT_TYPE, FAUCET_TYPE, TRANSACTION_HISTORY_TABLE_TYPE]





class App(tk.Frame):
    def __init__(self, master=None):
        tk.Frame.__init__(self, master)
        self.grid(sticky=N+S+E+W)

        top = self.winfo_toplevel()
        top.rowconfigure(0, weight=1)
        top.columnconfigure(0, weight=1)

        self.rowconfigure(1, weight=1)
        self.columnconfigure(0, weight=1)

        # Global Variables
        self.wallet = None
        self.private_key = None
        self.public_key = None

        self.show_main_screen_type = HOME_TYPE
        self.main_screen = HomeScreen(self, height=100, width=100)



        # Call widets
        self.__createWidgets()

    def display_navbar(self):
        # nav- frame
        self.f1 = tk.Frame(self, height=400, width=400, bg='green')
        self.f1.grid(row=0, sticky=E+W)

        self.myBtn = tk.Button(self.f1,text="Home", command=lambda: self.change_main_screen_type(_type=HOME_TYPE))
        self.myBtn.grid(row=0,column=0,)

        self.myBtn = tk.Button(self.f1,text="Create Transaction", command=lambda: self.change_main_screen_type(_type=CREATE_TRANSACTION_TYPE))
        self.myBtn.grid(row=0,column=1)

        self.myBtn = tk.Button(self.f1,text="Smart Contract", command=lambda: self.change_main_screen_type(_type=SMART_CONTRACT_TYPE))
        self.myBtn.grid(row=0,column=2)

        self.myBtn = tk.Button(self.f1,text="Faucet", command=lambda: self.change_main_screen_type(_type=FAUCET_TYPE))
        self.myBtn.grid(row=0,column=3)

        self.myBtn = tk.Button(self.f1,text="History", command=lambda: self.change_main_screen_type(_type=TRANSACTION_HISTORY_TABLE_TYPE))
        self.myBtn.grid(row=0,column=4)


    def get_transaction_history_table(self):
        return TransactionHistoryTable(self, bg='yellow', height=1000, width=1000)

    def get_home_screen(self):
        return HomeScreen(self, height=400, width=400)

    def get_faucet_screen(self):
        return FaucetScreen(self, height=400, width=400)

    def get_transaction_screen(self):
        return CreateTransactionScreen(self, height=400, width=400)

    def get_smart_contract_screen(self):
        return SmartContractScreen(self, height=400, width=400)


    def change_main_screen_type(self, _type:str):
        if _type not in TYPES_LIS:
            return

        self.show_main_screen_type = _type

        if self.main_screen is not None:
            self.main_screen.destroy()

        if _type == TRANSACTION_HISTORY_TABLE_TYPE:
            self.main_screen = self.get_transaction_history_table()
            return

        elif _type == HOME_TYPE:
            self.main_screen = self.get_home_screen()
            return
        
        elif _type == FAUCET_TYPE:
            self.main_screen = self.get_faucet_screen()
            return
        
        elif _type == CREATE_TRANSACTION_TYPE:
            self.main_screen = self.get_transaction_screen()
            return

        elif _type == SMART_CONTRACT_TYPE:
            self.main_screen = self.get_smart_contract_screen()
            return



    def __createWidgets(self):
        self.display_navbar()

        # self.f3 = tk.Frame( self, bg = "cyan", height = 100, width = 200)
        # self.f3.grid(row=2, sticky=E+W)

        self.quitButton = tk.Button(self, text="Quit", command=self.quit)
        self.quitButton.grid(row=4, column=0, sticky=E+W)


class SmartContractScreen( tk.Frame ):
    def __init__(self, controller, cnf={}, **kw):
        tk.Frame.__init__(self, controller, cnf, **kw)
        self.controller = controller
        self.grid(row=1, sticky=N+W+E+S)
        self.rowconfigure(1, weight=1)
        self.columnconfigure(1, weight=1)

        self.code = None
        self.contract_name = "my contract"

        self.receiver = None

        self.display_content()



    def display_content(self):
        l1 = tk.Label(self, text="Public Key Selection")
        l1.grid(row=0, column=0)

        button_explore = tk.Button(self,
                        text = "Browse Files",
                        command = self.browse_files)
        button_explore.grid(row=1, column=0)


        l4 = tk.Label(self, text="Enter name of contract", fg="black")
        l4.grid(row=2,column=0)
        self.contract_name = tk.Entry(self, bd =5, width=60)
        self.contract_name.grid(row=2,column=0)

        btn_c = tk.Button(self,
                        text = "Create smart contract",
                        command = self.create_smart_contract)
        btn_c.grid(row=3, column=0)

    def browse_files(self):
        filename = tk.filedialog.askopenfilename(initialdir = "/", title = "Select a File")

        l1 = tk.Label(self, text="Public Key Selection")
        l1.grid(row=0, column=0)
        # Change label contents
        l1.configure(text="File Opened: "+filename)

        with open(filename ,"rb") as f:
            data = f.read()
        
        self.code = b64_encode_contract(code=data)

    def create_smart_contract(self):
        contract_name = self.contract_name.get()
        if self.code is None or contract_name is None:
            return 
        sign_smart_contract(public_key=self.controller.public_key, private_key=self.controller.private_key, contract_name=contract_name, code=self.code)
      

class TransactionHistoryTable( tk.Frame ):
    def __init__(self, controller, cnf={}, **kw):
        tk.Frame.__init__(self, controller, cnf, **kw)
        self.controller = controller
        self.grid(row=1, sticky=N+W+E+S)
        self.rowconfigure(1, weight=1)
        self.columnconfigure(1, weight=1)                
        # self.myText = tk.Text(self, )
        block_lis = get_transaction_history(public_key=self.controller.public_key)
        df = self.get_transaction_history_df(block_lis=block_lis)

        self.table = pt = Table(self, dataframe=df,
                                showtoolbar=False, showstatusbar=False)
        pt.show()

    def get_transaction_history_df(self, block_lis:list):
        # Find all columns to display
        all_columns = {}

        # Each column stored with an index - column name - value
        d = {}
        # Map col to index
        col_to_index = {}
        # Map index to col
        index_to_col = {}
        # Map col to header
        col_to_header = {}
        # How many unique column values do I have
        index = 0

        for block in block_lis:
            for k, headers in block.items():
                if type(headers) == str:
                    continue

                for header, header_values in headers.items():
                    for column, value in header_values.items():
                        if column not in all_columns:
                            all_columns[column] = index
                            d[index] = {}
                            d[index][column] = []
                            index_to_col[index] = column
                            col_to_index[column] = index
                            col_to_header[column] = header
                            index += 1


        for block in block_lis:
            for k,headers in block.items():
                if type(headers) == str:
                    continue
                cols_included = {}
                for header, header_values in headers.items():
                    
                    for column, value in header_values.items():
                        _index = col_to_index[column]
                        d[_index][column].append(value)
                    
                        cols_included[column] = 1
                    
                # Pad the missing column values with None
                for column in all_columns:
                    if column not in cols_included:
                        _index = col_to_index[column]
                        d[_index][column].append(None)

        _d = {}
        for index, dict_ in d.items():
            for k, v in dict_.items():
                _d[k] = v
                    


        df = pd.DataFrame(data=_d)

        return df


class HomeScreen( tk.Frame ):
    def __init__(self, controller, cnf={}, **kw):
        tk.Frame.__init__(self, controller, cnf, **kw)
        self.controller = controller
        self.grid(row=1, sticky=N+S+E+W)
        self.rowconfigure(0, weight=1)
        self.columnconfigure(0, weight=1)                
        # self.myText = tk.Text(self, )


        self.display_content()

        # df = TableModel.getSampleData()
        # self.table = pt = Table(self, dataframe=df,
        #                         showtoolbar=True, showstatusbar=True)
        # # pt.show()


    def display_content(self):
        l1 = tk.Label(self, text="Public Key Selection")
        l1.grid(row=0, column=0)


        l2 = tk.Label(self, text=f"Your Public Key: {self.controller.public_key}")
        l2.grid(row=1, column=0)

        l3 = tk.Label(self, text=f"Your Private Key: {self.controller.private_key}")    
        l3.grid(row=2, column=0)


        btn1 = tk.Button(self, text="Use Mmemonic phrase",
                            command=lambda: self.use_mmemonic_phrase())
        btn1.grid(row=3, column=0)


        btn2 = tk.Button(self, text="Generate new key",
                            command=lambda: self.genereate_new_keys())
        btn2.grid(row=3, column=1)


    def genereate_new_keys(self):
        # Generate new
        self.controller.wallet = get_wallet()
        self.controller.private_key = self.controller.wallet.private_key()
        self.controller.public_key = self.controller.wallet.public_key()

        self.controller.change_main_screen_type(_type=HOME_TYPE)



    def use_mmemonic_phrase(self):
        mmemonic = 'old maid abuse shoe story armor absorb deny rally legal shallow meat'
        mmemonic2 = 'hero flight mimic ritual rotate gain foam fashion sand sadness large deer'
        
        # Use existing from mmenoic phrase
        self.controller.wallet = get_wallet(mmemonic2)
        self.controller.private_key = self.controller.wallet.private_key()
        self.controller.public_key = self.controller.wallet.public_key()

        self.controller.change_main_screen_type(_type=HOME_TYPE)

    
        # self.controller.show_frame(CreateTransactionPage, update=True)


class FaucetScreen( tk.Frame ):
    def __init__(self, controller, cnf={}, **kw):
        tk.Frame.__init__(self, controller, cnf, **kw)
        self.controller = controller
        self.grid(row=1, sticky=N+S+E+W)
        self.rowconfigure(0, weight=1)
        self.columnconfigure(0, weight=1)                
        # self.myText = tk.Text(self, )


        self.display_content()    

    def display_content(self):
        l1 = tk.Label(self, text="Faucet")
        l1.grid(row=0, column=0)


        l2 = tk.Label(self, text="Balance")
        l2.grid(row=1, column=0)

        l3 = tk. Label(self,fg="blue", text=self.get_balance())
        l3.grid(row=2, column=0)


        btn1 = tk.Button(self, text="Get faucet",
                            command=lambda: self.get_faucet())
        btn1.grid(row=3, column=0)

    def get_faucet(self):
        get_faucet(public_key=self.controller.public_key, private_key=self.controller.private_key)
        self.controller.change_main_screen_type(_type=FAUCET_TYPE)

    def get_balance(self):
        balance = get_balance(public_key=self.controller.public_key)

        return balance

class CreateTransactionScreen( tk.Frame ):
    def __init__(self, controller, cnf={}, **kw):
        tk.Frame.__init__(self, controller, cnf, **kw)
        self.controller = controller
        self.grid(row=1, sticky=N+S+E+W)
        self.rowconfigure(0, weight=1)
        self.columnconfigure(0, weight=1)                
        # self.myText = tk.Text(self, )

        # Variables
        self.amount = tk.IntVar()
        self.amount.set(0)
        
        self._set_default_receiver_public_key()

        self.display_content()    

    def display_content(self):
        l1 = tk.Label(self, text="Create Transaction", fg="green")
        l1.grid(row=0, column=0)

        l2 = tk.Label(self, text="Public Key", fg="green")
        l2.grid(row=1, column=0)

        l3 = tk.Label(self, text=self.controller.public_key, fg="blue")
        l3.grid(row=2, column=0)

        l2 = tk.Label(self, text="Private Key", fg="blue")
        l2.grid(row=3, column=0)

        l3 = tk.Label(self, text=self.controller.private_key, fg="blue")
        l3.grid(row=4, column=0)

        l4 = tk.Label(self, text="Receiving public key address (DEFAULT=SKYLLIAN_PUBLIC_KEY)", fg="red")
        l4.grid(row=5,column=0)
        receiver = tk.Entry(self, bd =5, width=60)
        receiver.grid(row=6,column=0)
        receiver.insert(0, self.receiverkey)


        amount_title = tk.Label(self, text="Amount to send (in AC)", fg="red")
        amount_title.grid(row=7, column=0)
        amount = tk.Entry(self,textvariable=self.amount, bd =5, width=10)
        amount.grid(row=8, column=0)


        btn1 = tk.Button(self, text="Create Transaction",command=lambda: self.create_transaction())
        btn1.grid(row=9, column=0)


    def create_transaction(self):
        sign_transaction(public_key=self.controller.public_key,private_key=self.controller.private_key, amount=self.amount.get())

    def _set_default_receiver_public_key(self):
        self.receiverkey = get_skyllian_public_key()


if __name__ == "__main__":
    main()