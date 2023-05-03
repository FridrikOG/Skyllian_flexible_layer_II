from rest_framework import serializers
from .models import Walletuser


class WalletUserSerializers(serializers.ModelSerializer):

    class Meta:
        model = Walletuser
        fields = [
            'name',
            'ticker',
            'description',
            'crypto_string'
        ]
