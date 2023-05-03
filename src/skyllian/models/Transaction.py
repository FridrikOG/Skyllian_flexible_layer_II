from Crypto.Hash import SHA256

class Transaction:
    def __init__(self,data):
        self.data = data
    def hash(self):
        # Retrieve the dict values the v's in (k, v)
        values = self.data
        values_str = "".join(values).encode(encoding="utf-8")

        print(values_str)

        _hash_byte:bytes = SHA256.new(data=values_str).digest()

        print(_hash_byte)
        
        self._hash = _hash_byte