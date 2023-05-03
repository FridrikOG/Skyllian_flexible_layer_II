import json
import base64


with open("contract1.py", "rb") as f:
    data =  f.read()
    print(data)
    print(type(data))
    
code_json = {
    'code' : data
}

with open("data.json", "w") as f:
    _d = {"code": base64.b64encode(s=data).decode()}
    print(_d)
    f.write(json.dumps(_d))

with open("data.json", "r") as f:
    data = json.loads(f.read())
    print()
    print()
    print()
    code = data['code'].encode()

    code = base64.b64decode(s=code)
print("Type ", type(data['code']))
print("DATA TO WRITE INTO ", data['code'])
with open("test.py", "wb") as f:
    f.write(code)
print("Length " , len(code))
print("Length " , code)
from test import printme


printme()

