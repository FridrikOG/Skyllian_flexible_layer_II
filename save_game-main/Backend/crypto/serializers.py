from rest_framework import serializers
from .models import Crypto


class CryptoSerializers(serializers.ModelSerializer):

    class Meta:
        model = Crypto
        fields = [
            'name',
            'ticker',
            'description',
            'crypto_string'
        ]
