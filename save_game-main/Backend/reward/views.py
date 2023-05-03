from django.shortcuts import render
from rest_framework import status
from django.http import JsonResponse
from rest_framework.views import APIView
from .models import Reward
from rest_framework import generics
from rest_framework import serializers
# from core.serializers import InvoiceSerializer


class RewardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reward
        fields = '__all__'


class RewardAPIVIEW(generics.GenericAPIView):
    def post(self, request):
        serializer = RewardSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
        return JsonResponse({}, status=status.HTTP_201_CREATED)
