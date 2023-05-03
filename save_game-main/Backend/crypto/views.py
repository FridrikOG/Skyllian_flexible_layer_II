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
from crypto.serializers import CryptoSerializers


class CryptoAPIVIEW(generics.GenericAPIView):
    def __init__(self):
        self.serialiser = 0

    def get(self, request):
        cryptoModelData = Crypto.objects.all().order_by("?")
        print("Model data ", cryptoModelData)
        retObj = []
        if cryptoModelData:
            for data in cryptoModelData:
                instanceData = CryptoSerializers(data).data
                retObj.append(instanceData)
        return JsonResponse(retObj, safe=False, content_type='application/json')

    def post(self, request):
        # Add a new cryptocurrency with name, ticker, and description
        data = request.data
        print("Data ", data)
        querySet = Crypto.objects.all()
        serializerClass = CryptoSerializers(data=data)
        if not serializerClass.is_valid():
            return JsonResponse(serializerClass.data, safe=False,
                                status=status.HTTP_400_BAD_REQUEST, content_type='application/json')
        serializerClass.save()
        return JsonResponse(serializerClass.data, safe=False,
                            status=status.HTTP_200_OK, content_type='application/json')
