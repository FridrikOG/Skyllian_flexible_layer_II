# from django.contrib.auth.views import LoginView, LogoutView
from django.urls import path
from .views import RewardAPIVIEW
from . import views

urlpatterns = [
    path('', RewardAPIVIEW.as_view(), name=''),
]
