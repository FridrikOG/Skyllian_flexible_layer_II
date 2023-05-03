from django.shortcuts import render
from rest_framework import status
from django.http import JsonResponse
from rest_framework.views import APIView
from .models import Feedback
from rest_framework import generics
from rest_framework import serializers
# from core.serializers import InvoiceSerializer
from rest_framework.permissions import *
from userStat.models import User
from user.views import getUserId
from rest_framework.decorators import permission_classes


class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__'


class FeedbackAPIVIEW(generics.GenericAPIView):
    @permission_classes([IsAuthenticated])
    def post(self, request):
        data = request.data
        # if description is empty
        if len(data['description']) <= 0:
            return JsonResponse({"error": "Description cannot be empty"}, safe=False, status=status.HTTP_403_FORBIDDEN,  content_type='application/json')
        userId = getUserId(request)
        user = User.objects.get(id=userId)
        # retJson = {
        #     "description": data['description']
        # }
        feedback = Feedback(user=user,  description=data['description'])
        # Save to database
        feedback.save()
        return JsonResponse({"description": data['description']}, status=status.HTTP_201_CREATED)
