"""squid URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from rest_framework.response import Response

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes


@permission_classes([AllowAny])
class Home(generics.GenericAPIView):

    def get(self, request):
        return Response("squid-django-backend")


PREFIX = 'api/'

urlpatterns = [
    path('admin/', admin.site.urls),
    path(f'{PREFIX}', Home.as_view()),
    path(f'{PREFIX}user/', include('user.urls')),
    path(f'{PREFIX}game/', include('game.urls')),
    path(f'{PREFIX}decision/', include('decision.urls')),
    path(f'{PREFIX}userStat/', include('userStat.urls')),
    path(f'{PREFIX}character/', include('character.urls')),
    path(f'{PREFIX}reward/', include('reward.urls')),
    path(f'{PREFIX}feedback/', include('feedback.urls')),
    path(f'{PREFIX}crypto/', include('crypto.urls')),
    path(f'{PREFIX}walletuser/', include('walletuser.urls')),

]
