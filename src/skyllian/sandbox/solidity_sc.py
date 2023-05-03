import base64

import json #to save the output in a JSON file
from solcx import compile_standard, install_solc

install_solc("0.8.0")
with open("sc.sol", "r") as file:
    contact_list_file = file.read()

compiled_sol = compile_standard(
    {
        "language": "Solidity",
        "sources": {"ContactList.sol": {"content": contact_list_file}},
        "settings": {
            "outputSelection": {
                "*": {
                    "*": ["abi", "metadata", "evm.bytecode", "evm.bytecode.sourceMap"] # output needed to interact with and deploy contract 
                }
            }
        },
    },
    solc_version="0.8.0",
)

# get bytecode
bytecode = compiled_sol["contracts"]["ContactList.sol"]["ContactList"]["evm"]["bytecode"]["object"]
# get abi
abi = json.loads(compiled_sol["contracts"]["ContactList.sol"]["ContactList"]["metadata"])["output"]["abi"]
print("Bytecode ", bytecode)

print('abi \n', abi)