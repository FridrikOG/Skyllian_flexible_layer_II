from Brokers.BlockBroker import BlockBroker

class Setup():
    def __init__(self, port, url):
        self.bb = BlockBroker(port, url)


    def setup_message_broker(self):
        self.bb.setup()