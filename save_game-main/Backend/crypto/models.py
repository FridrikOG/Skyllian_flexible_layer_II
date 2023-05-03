from django.db import models

# Create your models here.


# This is the type of cryptocurrency we are using

class Crypto(models.Model):
    # Bitcoin
    name = models.CharField(max_length=1024)
    # BTC
    ticker = models.CharField(max_length=1024)
    # A cryptocurrency ...
    description = models.CharField(max_length=1024)

    @property
    def crypto_string(self):
        return "Name: {} ticker: {} description: {}".format(self.name, self.ticker, self.description)
