from django.shortcuts import render
from re import S
from django.http import JsonResponse
from rest_framework import generics
from rest_framework.decorators import permission_classes
from rest_framework.permissions import *
from datetime import datetime
from game.models import Game
from rest_framework.parsers import JSONParser
from rest_framework import serializers
from rest_framework import status
from crypto.models import Crypto


def getCrypto():
    return Crypto.objects.all()


class WalletUserAPIVIEW(generics.GenericAPIView):
    def __init__(self):
        self.serialiser = 0

    def get(self, request):
        # This function should tell you if you can make a decision
        # Each decision has to be made with a 4 four delay
        return JsonResponse({"isIngame": True}, safe=False, content_type='application/json')

    def post(self, request):
        # This function should tell you if you can make a decision
        # Each decision has to be made with a 4 four delay
        crypto = getCrypto()
        print("Post req ", crypto)

        return JsonResponse({"isIngame": True}, safe=False, content_type='application/json')
