import json
with open("contract1.py", "rb") as f:
    binary_code =  f.read()
    print(binary_code)
    print(type(binary_code)) 
code_json = {
    'code' : binary_code.decode('ascii')
}
vari = code_json['code']
with open('data.json', 'w') as f:
    json.dump((code_json), f)
data = open('data.json')
# # returns JSON object as 
# # a dictionary
data = json.load(data)
# data = json.loads(data)
# print("Data ", data['code'].encode('ascii'))

print("Length " , len(data['code']))
print("Length " , data['code'])
data = data['code'].encode('ascii')

with open("test.py", "wb") as f:
    f.write(data)    
    
from test import printme

printme()

