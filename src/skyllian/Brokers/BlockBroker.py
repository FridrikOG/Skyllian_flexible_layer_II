import ssl
import pika

from services.DatabaseService import DatabaseService
import os
class BlockBroker:

    def __init__(self, port, url):

        ''' Pika connection related '''
        # SSL Context for TLS configuration of Amazon MQ for RabbitMQ
        ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLSv1_2)
        ssl_context.set_ciphers('ECDHE+AESGCM:!ECDSA')
        parameters = pika.URLParameters(url)
        parameters.ssl_options = pika.SSLOptions(context=ssl_context)
        self.connection = pika.BlockingConnection(parameters)
        self.channel = None
        self.exchange_name = "block_exchange"
        self.routing_key = "create_block"
        self.queue_name = "block_queue" + port
        ''' Database related'''
        self.db = DatabaseService()
        
        
    def setup_connection(self):
        print(f"Attempting to setup broker to '{self.exchange_name}' connection")
        queue_name = self.queue_name
        try:
            self.channel = self.connection.channel()
            # Declare the exchange, if it doesn't exist
            self.channel.exchange_declare(exchange=self.exchange_name, exchange_type='direct', durable=True)
            # Declare the queue, if it doesn't exist
            self.channel.queue_declare(queue=queue_name, durable=True)
            # Bind the queue to a specific exchange with a routing key
            self.channel.queue_bind(exchange=self.exchange_name, queue=queue_name, routing_key=self.routing_key)
            print("Connection established!")
        except Exception as e:
            print("Failed to setup connection", e)

    def test(self, ch, method, properties, body):
        print("Before updating mongoDB")
        print(" body " , body)
        db = DatabaseService()
        db.check_if_update_necessary()
        print("After updating mongodb")


    def _receive_block(self):
        print("a")
        self.channel.basic_consume(on_message_callback=self.test,
                    queue=self.queue_name,
                    auto_ack=True)
        print("b")
        self.channel.start_consuming()
        print("c")
        print(f"Rabbit-mq consuming on '{self.exchange_name}' with '{self.routing_key}' on '{self.queue_name}'")
        
    def receive_block(self):
        """Publishes block to block_queue with 2 attempts"""
        print(f"Attempting to setup consumer on '{self.queue_name}'")
        try:
            self._receive_block()
        except Exception as e:
            print(f"Failed to consume on queue {self.queue_name}", e)
            self.setup_connection()
            try:
                self._receive_block()
            except:
                print(f"Failed to consume on queue {self.queue_name}", e)

    def setup(self):
        print("Setting up BlockBroker")
        self.setup_connection()
        self.receive_block()

        
