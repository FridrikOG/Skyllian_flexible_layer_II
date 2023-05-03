import os

class FlaskConfig(object):
    def __init__(self):
        # Change this to environment variable
        self.IS_LOCAL = True
        self.LOCAL = 'config-local.json'
        self.REMOTE = 'config-remote.json'
        self.DATABASE = 'database.json'
        self.SKYLLIAN_PUBLIC_KEY = '02a3293e85a7fbde059e221ace4edc6743a3ba5a2758cb3001acf6d81750089dcb'
        self.SKYLLIAN_PRIVATE_KEY = "884e3e27c05bae200023502843254b4e1484c2391b5be908b43b114d50a7376e"